import { knexInstance } from '../db/knexfile'

export enum NotificationType {
  INVITATION = 'invitation',
  RESOLUTION = 'resolution',
}

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: NotificationType
  read: boolean
  created_at: Date
  updated_at: Date
}

export const Notifications = () => knexInstance<Notification>('notification')

export const getNotificationsByUserId = async (userId: number) => {
  return await Notifications().where({ user_id: userId })
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

export const notificationToJSON = (notification: Notification) => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  read: notification.read,
  created_at: notification.created_at,
  updated_at: notification.updated_at,
})
