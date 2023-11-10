export type NotificationType = 'invitation' | 'initiative'

export interface NotificationModel {
  id: number
  title: string
  message: string
  url: string
  type: NotificationType
  read: boolean
  createdAt: Date
  updatedAt: Date
}
