export interface InitiativeModel {
  id: number
  label: string
  description: string
  status: 'draft' | 'open' | 'closed'
  type: 'poll' | 'majority' | 'unanimous'
  requiresSignature: boolean
  createdBy: number
  propertyId: number
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}
