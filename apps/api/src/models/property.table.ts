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
  number_of_units: number
  /** @deprecated use PropertyUser.role */
  admin_id: number
  created_at: Date
  updated_at: Date
}

export const Properties = () => knexInstance<Property>('property')

export const createProperty = async (property: Partial<Property>) => {
  const result = await Properties().insert({
    ...property,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('*')

  return result[0]
}

export const updateProperty = async (id: number, property: Partial<Property>) => {
  const results = await Properties().where({ id }).update({
    ...property,
    updated_at: new Date(),
  }).returning('*')

  return results[0]
}

export const deleteProperty = async (id: number) => {
  return await Properties().where({ id }).del()
}

export const getPropertyById = async (id: number) => {
  return await Properties().where('id', id).first()
}

export const getPropertyByIds = async (ids: number[]) => {
  return await Properties().whereIn('id', ids)
}

export const getAllUserProperties = async (userId: number) => {
  const userProperties = await getUserProperties(userId, ['active'])
  const properties = await getPropertyByIds(userProperties.map((p) => p.property_id))

  return properties.filter((property, index, self) => {
    return self.findIndex((p) => p.id === property.id) === index
  })
}

export const propertyToJSON = (property: Property): PropertyModel => ({
  id: property.id,
  name: property.name,
  address: property.address,
  city: property.city,
  zip: property.zip,
  country: property.country,
  numberOfUnits: property.number_of_units,
  updatedAt: property.updated_at,
  createdAt: property.created_at,
})
