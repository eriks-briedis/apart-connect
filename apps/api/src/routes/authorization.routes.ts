import { compareSync, hash } from 'bcrypt'
import { Router } from 'express'
import { createUser, createUserToken, getUserByEmail, userToJSON } from '../models'

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
    user: userToJSON(user),
    token: createUserToken(user),
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
    first_name,
    last_name,
  } = req.body

  if (!email || !password || !first_name || !last_name) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const passwordHash = await hash(password, saltRounds)

  await createUser({ email, passwordHash, first_name, last_name })

  res.json({ success: true, message: 'ok' })
})
