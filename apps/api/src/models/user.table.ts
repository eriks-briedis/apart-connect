import { knexInstance } from "../db/knexfile"

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  passwordHash: string
  date_of_birth: string
  phone: string
  role: UserRole
  property_id: string
  created_at: Date
  updated_at: Date
}

export const Users = () => knexInstance<User>('user')
