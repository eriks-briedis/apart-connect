import { Router } from 'express';
import { Users } from '../models';

export const usersRouter = Router();

/**
 * GET /users
 * Lists all users
 */
usersRouter.get('/', async (_, res) => {
  console.log('GET /users')
  const users = await Users().select()

  res.json({ data: users})
})
