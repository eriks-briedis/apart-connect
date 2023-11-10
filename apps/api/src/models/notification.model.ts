import { NotificationModel, NotificationType } from 'shared'
import { knexInstance } from '../db/knexfile'
import { getAllPropertyUsers } from './property-user.table'
import { Property } from './property.table'

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  url: string
  type: NotificationType
  read: boolean
  created_at: Date
  updated_at: Date
}

export interface NotifyAllUsersInput {
  property: Property
  type: NotificationType
  title: string
  message: string
  url: string
}

export const Notifications = () => knexInstance<Notification>('notification')

export const getNotificationsByUserId = async (userId: number) => {
  return await Notifications().where({ user_id: userId }).orderBy('created_at', 'desc')
}

export const createNotification = async (input: Partial<Notification>) => {
  const result = await Notifications().insert({
    ...input,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('*')

  const notification = result[0]

  return notification
}

export const getNotificationById = async (id: number) => {
  return await Notifications().where({ id }).first()
}

export const markNotificationAsRead = async (id: number) => {
  return await Notifications().where({ id }).update({ read: true })
}

export const notifyAllUsersInProperty = async ({
  property,
  type,
  title,
  message,
  url,
}: NotifyAllUsersInput) => {
  const users = await getAllPropertyUsers(property.id, ['active'])

  for (const user of users) {
    await createNotification({
      user_id: user.id,
      title,
      message,
      url,
      type,
    })
  }
}

export const notificationToJSON = (notification: Notification): NotificationModel => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  url: notification.url,
  type: notification.type,
  read: notification.read,
  createdAt: notification.created_at,
  updatedAt: notification.updated_at,
})
