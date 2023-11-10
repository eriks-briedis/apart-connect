import { sign } from 'jsonwebtoken'
import { knexInstance } from '../db/knexfile'
import { UserModel, UserRole } from 'shared'
import { randomBytes } from 'crypto'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  passwordHash: string
  date_of_birth: string
  phone: string
  role: UserRole
  password_reset: boolean
  is_verified: boolean
  token: string | null
  created_at: Date
  updated_at: Date
}

export const Users = () => knexInstance<User>('user')

export const getUserById = async (id: number) => {
  return await Users().where('id', id).first()
}

export const getUsersByIds = async (ids: number[]) => {
  return await Users().whereIn('id', ids)
}

export const getUserByEmail = async (email: string) => {
  return await Users().where('email', email).first()
}

export const createUser = async (user: Partial<User>) => {
  const result = await Users().insert({
    ...user,
    is_verified: false,
    token: user.token ?? randomBytes(32).toString('hex'),
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('*')

  return result[0]
}

export const updateUser = async (id: number, user: Partial<User>) => {
  const result = await Users().where('id', id).update({
    ...user,
    updated_at: new Date(),
  }).returning('*')

  return result[0]
}

export const deleteUser = async (id: number) => {
  await Users().where('id', id).delete()
}

export const getUserByToken = async (token: string) => {
  return await Users().where('token', token).first()
}

export const createUserToken = (user: Partial<User>) => {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET')
  }

  return sign(
    { _id: user.id, firstName: user.first_name, lastName: user.last_name },
    jwtSecret,
    {
      expiresIn: '2 days',
    },
  )
}

export const userToJSON = (user: User): UserModel => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  phone: user.phone,
  dateOfBirth: user.date_of_birth,
  isVerified: user.is_verified,
  updatedAt: user.updated_at,
  createdAt: user.created_at,
})
