import { Router } from 'express';
import { Users } from '../models';
import { routeGuard } from '../utils';
export const usersRouter = Router();

/**
 * All routes in this file are protected by the routeGuard middleware
 */
usersRouter.use(routeGuard)

/**
 * GET /users
 * Lists all users
 */
usersRouter.get('/', async (_, res) => {
  const users = await Users().select()

  res.json({ data: users})
})
