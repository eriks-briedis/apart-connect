import { knexInstance } from '../db/knexfile'

export enum ResolutionStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum ResolutionType {
  INFO = 'info',
  SINGED = 'signed',
  EMEGENCY = 'emergency',
}

export interface Resolution {
  id: string
  label: string
  description: string
  status: ResolutionStatus
  type: ResolutionStatus
  created_at: Date
  updated_at: Date
}

export const Resolutions = () => knexInstance<Resolution>('resolution')
