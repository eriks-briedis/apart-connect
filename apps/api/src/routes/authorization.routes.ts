import { compareSync, hash } from 'bcrypt'
import { Router } from 'express'
import { createUser, createUserToken, getUserByEmail, userToJSON } from '../models'
import { getUserFromToken } from '../utils'
import { getNotificationsByUserId, notificationToJSON } from '../models/notification.model'

export const authRouter = Router()

/**
 * POST /users/login
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

  if (!user) {
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
 * POST /users/register
 * Registers a new user
 */
authRouter.post('/register', async (req, res) => {
  const saltRounds = 10
  const {
    email,
    password,
    firstName,
    lastName,
  } = req.body

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const passwordHash = await hash(password, saltRounds)

  await createUser({ email, passwordHash, first_name: firstName, last_name: lastName })

  res.json({ success: true, message: 'ok' })
})
