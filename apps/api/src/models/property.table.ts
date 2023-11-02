import { knexInstance } from '../db/knexfile'

export interface Property {
  id: string
  name: string
  address: string
  city: string
  zip: string
  country: string
  admin_id: string
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

export const getUserProperties = async (userId: string) => {
  return await Properties().where({ admin_id: userId })
}

export const propertyToJSON = (property: Property) => ({
  id: property.id,
  name: property.name,
  address: property.address,
  city: property.city,
  zip: property.zip,
  country: property.country,
  updatedAt: property.updated_at,
  createdAt: property.created_at,
})
