import { verify } from 'jsonwebtoken'
import { User, getUserById } from '../models'

export interface RequestWithUser extends Request {
  user: User
}

/**
 * Middleware that checks for a valid JWT on the Authorization header
 */
export const routeGuard = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({ error: 'Not authorized!' })
    return
  }

  try {
    const user = await getUserFromToken(token)
    if (user) {
      req.user = user
      next()
    }
  } catch (e) {
    res.status(401).json({ error: 'Not authorized!' })
  }
}

export const getUserFromToken = async (token: string): Promise<User | null> => {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('No token provided')
  }
  try {
    const data = verify(token, jwtSecret)
    if (data instanceof Object) {
      const user = await getUserById(data._id)
      return user ?? null
    }
    return null
  } catch (e) {
    return null
  }
}
