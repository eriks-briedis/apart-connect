import { PropertyUserRole, PropertyUserStatus } from 'shared'
import { knexInstance } from '../db/knexfile'
import { Property } from './property.table'
import { User, getUsersByIds } from './user.table'

export interface PropertyUser {
  id: number
  property_id: number
  user_id: number
  role: PropertyUserRole
  status: PropertyUserStatus
  attached_at: Date
  detached_at: Date
  created_at: Date
  updated_at: Date
}

export const PropertyUsers = () => knexInstance<PropertyUser>('property_user')

export const getPropertyUsers = async (propertyId: number) => {
  return await PropertyUsers().where({ property_id: propertyId })
}

export const doesUserBelongToProperty = async (property: Property, user: User) => {
  const propertyUser = await PropertyUsers().where({ property_id: property.id, user_id: user.id }).first()

  return propertyUser?.status === 'active'
}

export const attachUserToProperty = async (propertyUser: Partial<PropertyUser>) => {
  return await PropertyUsers().insert({
    ...propertyUser,
    attached_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  })
}

export const approveUserForProperty = async (propertyId: number, userId: number) => {
  return await PropertyUsers().where({ property_id: propertyId, user_id: userId }).update({
    status: 'active',
    updated_at: new Date(),
  })
}

export const detachUserFromProperty = async (propertyId: number, userId: number) => {
  return await PropertyUsers().where({ property_id: propertyId, user_id: userId }).del()
}

export const getUserProperties = async (userId: number, statuses: string[] = []) => {
  return await PropertyUsers().where({ user_id: userId })
    .modify((queryBuilder) => {
      if (statuses.length) {
        queryBuilder.whereIn('status', statuses)
      }
    })
}

export const getAllPropertyUsers = async (propertyId: number, statuses: PropertyUserStatus[] = []): Promise<User[]> => {
  const propertyUsers = await PropertyUsers()
    .where({ property_id: propertyId })
    .modify((queryBuilder) => {
      if (statuses.length) {
        queryBuilder.whereIn('status', statuses)
      }
    })
  const users = await getUsersByIds(propertyUsers.map((pu) => pu.user_id))

  return users.filter((user, index, self) => {
    return self.findIndex((u) => u.id === user.id) === index
  })
}

export const isUserPropertyAdmin = async (propertyId: number, userId: number) => {
  const roles = [
    'property_admin',
    'super_admin',
  ]
  const propertyUser = await PropertyUsers().where({ property_id: propertyId, user_id: userId }).first()

  return propertyUser && roles.includes(propertyUser.role)
}
