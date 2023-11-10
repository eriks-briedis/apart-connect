import { NotificationModel } from './notification'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserModel {
  id: number
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phone: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserLoginModel extends UserModel {
  notifications: NotificationModel[]
}

export interface UserLoginResponse {
  success: boolean
  token?: string
  user: UserLoginModel
}
