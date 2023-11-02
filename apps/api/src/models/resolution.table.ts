import { knexInstance } from '../db/knexfile'
import { VoteType } from './vote.table'

export enum ResolutionStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum ResolutionType {
  INFO = 'info',
  SINGED = 'signed',
  EMERGENCY = 'emergency',
}

export interface Resolution {
  id: number
  label: string
  description: string
  status: ResolutionStatus
  type: ResolutionType
  property_id: number
  created_by: number
  created_at: Date
  updated_at: Date
}

export const Resolutions = () => knexInstance<Resolution>('resolution')

export const createResolution = async (resolution: Partial<Resolution>) => {
  return await Resolutions().insert({
    ...resolution,
    created_at: new Date(),
    updated_at: new Date(),
  })
}

export const getResolutionById = async (id: number) => {
  return await Resolutions().where('id', id).first()
}

export const getResolutionsByPropertyId = async (propertyId: number) => {
  return await Resolutions().where({ property_id: propertyId })
}

export const isValidVoteTypeForResolution = (resolution: Resolution, voteType: VoteType) => {
  switch (resolution.type) {
    case ResolutionType.INFO: {
      return true
    }
    case ResolutionType.SINGED:
    case ResolutionType.EMERGENCY: {
      return voteType === VoteType.SIGNED
    }
    default:
      return false
  }
}

export const resolutionToJSON = (resolution: Resolution) => ({
  id: resolution.id,
  label: resolution.label,
  description: resolution.description,
  status: resolution.status,
  type: resolution.type,
  updatedAt: resolution.updated_at,
  createdAt: resolution.created_at,
})
