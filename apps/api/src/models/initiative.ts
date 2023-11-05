import { InitiativeModel } from 'shared'
import { knexInstance } from '../db/knexfile'

export interface Initative {
  id: number
  label: string
  description: string
  status: 'draft' | 'open' | 'closed'
  type: 'poll' | 'majority' | 'unanimous'
  requires_signature: boolean
  created_by: number
  property_id: number
  expires_at: Date
  created_at: Date
  updated_at: Date
}

export const Initiatives = () => knexInstance<Initative>('initiative')

export const createInitiative = async (initiative: Partial<Initative>) => {
  const result = await Initiatives().insert({
    ...initiative,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('*')

  return result[0]
}

export const getInitiativesByPropertyId = async (propertyId: number) => {
  return await Initiatives().where({ property_id: propertyId })
}

export const initiativeToJSON = (initiative: Initative): InitiativeModel => ({
  id: initiative.id,
  label: initiative.label,
  description: initiative.description,
  status: initiative.status,
  type: initiative.type,
  requiresSignature: initiative.requires_signature,
  createdBy: initiative.created_by,
  propertyId: initiative.property_id,
  expiresAt: initiative.expires_at,
  createdAt: initiative.created_at,
  updatedAt: initiative.updated_at,
})
