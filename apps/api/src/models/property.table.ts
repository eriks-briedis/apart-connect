import { knexInstance } from '../db/knexfile'

export interface Property {
  id: string
  name: string
  address: string
  city: string
  zip: string
  country: string
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
