export type NotificationType = 'invitation' | 'resolution'

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
