export type InvitationStatus = 'pending' | 'accepted' | 'expired'

export interface InvitationModel {
  id: number
  email?: string
  userId?: number
  invitedBy: number
  token: string
  propertyId: number
  status: InvitationStatus
  expiresAt: Date
  updatedAt: Date
  createdAt: Date
}
