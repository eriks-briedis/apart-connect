import { knexInstance } from '../db/knexfile'
import { Property } from './property.table'
import { User } from './user.table'

export interface PropertyUser {
  id: number
  property_id: number
  user_id: number
  created_at: Date
  updated_at: Date
}

export const PropertyUsers = () => knexInstance<PropertyUser>('property_user')

export const getPropertyUsers = async (propertyId: number) => {
  return await PropertyUsers().where({ property_id: propertyId })
}

export const isUserAttachedToProperty = async (propertyId: number, userId: number) => {
  const propertyUser = await PropertyUsers().where({ property_id: propertyId, user_id: userId }).first()

  return !!propertyUser
}

export const doesUserBelongToProperty = async (property: Property, user: User) => {
  const isUserAttached = await isUserAttachedToProperty(user.id, property.id)
  const isUserAdmin = user.id == property.admin_id

  return isUserAttached || isUserAdmin
}

export const attachUserToProperty = async (propertyId: number, userId: number) => {
  return await PropertyUsers().insert({
    property_id: propertyId,
    user_id: userId,
    created_at: new Date(),
    updated_at: new Date(),
  })
}

export const detachUserFromProperty = async (propertyId: number, userId: number) => {
  return await PropertyUsers().where({ property_id: propertyId, user_id: userId }).del()
}
