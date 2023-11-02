import { compareSync, hash } from 'bcrypt';
import { Router } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { Users } from '../models';
export const usersRouter = Router();

const SECRET_KEY = process.env.JWT_SECRET

/**
 * GET /users
 * Lists all users
 */
usersRouter.get('/', async (req, res) => {
  console.log('GET /users')
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Not authorized!' })
    return
  }

  try {
    verify(token, SECRET_KEY)
  } catch (e) {
    res.status(401).json({ error: 'Not authorized!' })
    return
  }

  const users = await Users().select()

  res.json({ data: users})
})

usersRouter.post('/login', async (req, res) => {
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

  const token = sign({ _id: user.id, firstName: user.first_name, lastName: user.last_name }, SECRET_KEY, {
    expiresIn: '2 days',
  });

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

usersRouter.post('/register', async (req, res) => {
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
