import { Router } from 'express'
import { Users } from '../models'
import { compareSync, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

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

  const user = await Users().where('email', email).first()

  if (!user) {
    res.status(400).json({ error: 'Invalid credentials' })
    return
  }

  const passwordMatches = compareSync(password, user.passwordHash)

  if (!passwordMatches) {
    res.status(400).json({ error: 'Invalid credentials' })
    return
  }

  const token = sign({ _id: user.id, firstName: user.first_name, lastName: user.last_name }, process.env.JWT_SECRET, {
    expiresIn: '2 days',
  })

  res.json({
    success: true,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      updatedAt: user.updated_at,
      createdAt: user.created_at,
    },
    token,
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

  await Users().insert({
    email,
    passwordHash,
    first_name,
    last_name,
    created_at: new Date(),
    updated_at: new Date(),
  })

  res.json({ success: true, message: 'ok' })
})
