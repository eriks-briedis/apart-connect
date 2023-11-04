import { knexInstance } from '../db/knexfile'
import { getUserProperties } from './property-user.table'
import { PropertyModel } from 'shared'
export interface Property {
  id: number
  name: string
  address: string
  city: string
  zip: string
  country: string
  admin_id: number
  created_at: Date
  updated_at: Date
}

export const Properties = () => knexInstance<Property>('property')

export const createProperty = async (property: Partial<Property>) => {
  return await Properties().insert({
    ...property,
    created_at: new Date(),
    updated_at: new Date(),
  })
}

export const getPropertyById = async (id: number) => {
  return await Properties().where('id', id).first()
}

export const getPropertyByIds = async (ids: number[]) => {
  return await Properties().whereIn('id', ids)
}

export const getAllUserProperties = async (userId: number) => {
  const adminProperties = await Properties().where({ admin_id: userId })
  const userProperties = await getUserProperties(userId)
  const properties = await getPropertyByIds(userProperties.map((p) => p.property_id))

  return [...adminProperties, ...properties]
    .filter((property, index, self) => self.findIndex((p) => p.id === property.id) === index)
}

export const propertyToJSON = (property: Property): PropertyModel => ({
  id: property.id,
  name: property.name,
  address: property.address,
  city: property.city,
  zip: property.zip,
  country: property.country,
  updatedAt: property.updated_at,
  createdAt: property.created_at,
})
