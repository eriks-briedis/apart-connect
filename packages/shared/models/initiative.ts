export type InitiativeType = 'poll' | 'majority' | 'unanimous'
export type InitiativeStatus = 'draft' | 'open' | 'closed'

export interface InitiativeModel {
  id: number
  label: string
  description: string
  status: InitiativeStatus
  type: InitiativeType
  requiresSignature: boolean
  createdBy: number
  propertyId?: number
  canVote?: boolean
  totalVotes?: number
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}
