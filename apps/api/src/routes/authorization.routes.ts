import { compareSync, hash } from 'bcrypt'
import { Router } from 'express'
import { User, approveUserForProperty, attachUserToProperty, createUser, createUserToken, deleteUser, getInvitationByToken, getUserByEmail, getUserByInvitationToken, getUserByToken, setInvitationStatus, updateUser, userToJSON } from '../models'
import { getUserFromToken } from '../utils'
import { getNotificationsByUserId, notificationToJSON } from '../models/notification.model'
import { sendEmail } from '../utils/send-email'
import { randomBytes } from 'crypto'

export const authRouter = Router()
const SALT_ROUNDS = 10

/**
 * POST /auth/login
 * Logs in a user and returns a JWT
 */
authRouter.post('/login', async (req, res) => {
  const {
    email,
    password,
  } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const user = await getUserByEmail(email)

  if (!user?.is_verified) {
    res.status(400).json({ error: 'Invalid credentials' })
    return
  }

  const passwordMatches = compareSync(password, user.passwordHash)

  if (!passwordMatches) {
    res.status(400).json({ error: 'Invalid credentials' })
    return
  }

  res.json({
    success: true,
    token: createUserToken(user),
    data: userToJSON(user),
  })
})

authRouter.get('/me', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  const user = await getUserFromToken(token)

  if (!user) {
    res.status(401).json({ error: 'Not authorized!' })
    return
  }

  const notifications = await getNotificationsByUserId(user.id)

  res.json({
    success: true,
    data: {
      ...userToJSON(user),
      notifications: notifications.map(notificationToJSON),
    },
  })
})

/**
 * POST /auth/register
 * Registers a new user
 */
authRouter.post('/register', async (req, res) => {
  const {
    email,
    password,
    passwordRepeat,
    firstName,
    lastName,
    token,
  } = req.body

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  if (password !== passwordRepeat) {
    res.status(400).json({ error: 'Passwords do not match' })
    return
  }

  const passwordHash = await hash(password, SALT_ROUNDS)
  const user = await createUser({ email, passwordHash, first_name: firstName, last_name: lastName, token })
  if (!user) {
    res.status(500).json({ error: 'Failed to create user' })
    return
  }

  if (token) {
    const invitation = await getInvitationByToken(token)
    if (invitation) {
      await attachUserToProperty({
        property_id: invitation.property_id,
        user_id: user.id,
        role: 'user',
        status: 'pending',
      })
    }
  }

  const verifyUrl = `${process.env.APP_URL}/auth/verify/${user.token}`

  try {
    await sendEmail({
      receiverEmail: email,
      receiverName: `${firstName} ${lastName}`,
      subject: 'Reģistrācija ApartConnect',
      html: `
        <h1>Apsveicam!</h1>
        <p>Jūs esat veiksmīgi reģistrējies ApartConnect sistēmā!</p>
        <p>Lai pabeigtu reģistrāciju, lūdzu, apmeklējiet šo saiti: <a href="${verifyUrl}">${verifyUrl}</a></p>
      `,
    })
  } catch (e) {
    await deleteUser(user.id)
    console.error(e)
    res.status(500).json({ error: 'Failed to register' })
    return
  }

  res.json({ success: true, message: 'ok' })
})

/**
 * GET /auth/verify/:token
 * Verifies a user's email address
 */
authRouter.post('/verify', async (req, res) => {
  const { token, type, password, passwordRepeat } = req.body
  let user: User | undefined = undefined

  if (!type) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }


  if (type === 'verify') {
    const data = await getUserByInvitationToken(token)
    user = data?.user
    const invitation = data?.invitation

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    if (!invitation) {
      res.status(404).json({ error: 'Invitation not found' })
      return
    }

    await updateUser(
      user.id,
      {
        is_verified: true,
        token: null,
      },
    )
    await approveUserForProperty(invitation.property_id, user.id)
    await setInvitationStatus(invitation.id, 'accepted')
  } else if (type === 'reset-password') {
    user = await getUserByToken(token)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    if (!password || !passwordRepeat) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    if (password !== passwordRepeat) {
      res.status(400).json({ error: 'Passwords do not match' })
      return
    }

    await updateUser(
      user.id,
      {
        passwordHash: await hash(password, SALT_ROUNDS),
        password_reset: false,
        token: null,
      },
    )
  } else {
    res.status(400).json({ error: 'Invalid type' })
    return
  }

  res.json({
    success: true,
    token: createUserToken(user),
    data: userToJSON(user),
  })
})

/**
 * GET /auth/invitation-token/:token
 * Returns the email address associated with an invitation token
 */
authRouter.get('/invitation-token/:token', async (req, res) => {
  const { token } = req.params

  if (!token) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const invitation = await getInvitationByToken(token)
  if (!invitation) {
    res.status(404).json({ error: 'Invitation not found' })
    return
  }

  res.json({ success: true, data: { email: invitation.email } })
})

/**
 * POST /auth/reset-password
 * Sends a password reset email
 */
authRouter.post('/reset-password', async (req, res) => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const user = await getUserByEmail(email)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  const token = randomBytes(32).toString('hex')
  await updateUser(user.id, {
    password_reset: true,
    token,
  })

  const resetUrl = `${process.env.APP_URL}/auth/reset-password/${token}`

  try {
    await sendEmail({
      receiverEmail: email,
      receiverName: `${user.first_name} ${user.last_name}`,
      subject: 'Parole ApartConnect',
      html: `
        <h1>Paroles maiņa</h1>
        <p>Lai nomainītu paroli, lūdzu, apmeklējiet šo saiti: <a href="${resetUrl}">${resetUrl}</a></p>
      `,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to reset password' })
    return
  }

  res.json({ success: true, message: 'ok' })
})

/**
 * GET /auth/availability
 * Checks if an email address is available
 */
authRouter.get('/availability', async (req, res) => {
  const { email } = req.query

  if (!email) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const user = await getUserByEmail(email as string)
  if (user) {
    res.json({ success: true, data: false })
    return
  }

  res.json({ success: true, data: true })
})
