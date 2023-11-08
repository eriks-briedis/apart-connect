import { Router } from 'express'
import { routeGuard } from '../utils'
import { getNotificationById, markNotificationAsRead } from '../models/notification.model'

export const notificationsRouter = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
notificationsRouter.use(routeGuard)

notificationsRouter.post('/:id/reject', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  const notification = await getNotificationById(id)

  if (!notification || notification.user_id !== req.user.id) {
    res.status(400).json({ error: 'Invalid notification' })
    return
  }

  await markNotificationAsRead(id)

  res.json({ success: true, message: 'ok' })
})
