import { sign } from 'jsonwebtoken'
import { knexInstance } from '../db/knexfile'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  // @TODO: rename to password_hash
  passwordHash: string
  date_of_birth: string
  phone: string
  role: UserRole
  property_id: string
  created_at: Date
  updated_at: Date
}

export const Users = () => knexInstance<User>('user')

export const getUserById = async (id: number) => {
  return await Users().where('id', id).first()
}

export const getUserByEmail = async (email: string) => {
  return await Users().where('email', email).first()
}

export const createUser = async (user: Partial<User>) => {
  return await Users().insert({
    ...user,
    created_at: new Date(),
    updated_at: new Date(),
  })
}

export const createUserToken = (user: Partial<User>) => {
  return sign({ _id: user.id, firstName: user.first_name, lastName: user.last_name }, process.env.JWT_SECRET, {
    expiresIn: '2 days',
  })
}

export const userToJSON = (user: User) => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  updatedAt: user.updated_at,
  createdAt: user.created_at,
})
