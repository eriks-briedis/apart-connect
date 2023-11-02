import { verify } from "jsonwebtoken";

/**
 * Middleware that checks for a valid JWT on the Authorization header
 */
export const routeGuard = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Not authorized!' })
    return
  }

  try {
    verify(token, process.env.JWT_SECRET)
    next()
  } catch (e) {
    res.status(401).json({ error: 'Not authorized!' })
    return
  }
}
