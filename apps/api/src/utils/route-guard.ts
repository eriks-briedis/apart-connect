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
    const data = verify(token, process.env.JWT_SECRET)
    if (data instanceof Object) {
      const user = await getUserById(data._id)
      req.user = user
    }
    next()
  } catch (e) {
    res.status(401).json({ error: 'Not authorized!' })
  }
}
