import moment from 'moment'
import { knexInstance } from '../db/knexfile'
import { randomBytes } from 'crypto'
import { NotificationType, createNotification } from './notification.model'
import { getPropertyById } from './property.table'

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Invitation {
  id: number
  email: string
  user_id: number
  invited_by: number
  token: string
  property_id: number
  status: InvitationStatus
  expires_at: Date
  created_at: Date
  updated_at: Date
}

export const Invitations = () => knexInstance<Invitation>('invitation')

export const getInvitationById = async (id: number) => {
  return await Invitations().where({ id }).first()
}

export const getInvitationByToken = async (token: string) => {
  return await Invitations().where({ token }).first()
}

export const createInvitation = async (input: Partial<Invitation>) => {
  const result = await Invitations().insert({
    ...input,
    token: randomBytes(32).toString('hex'),
    expires_at: moment().add(1, 'week').toDate(),
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('*')

  const invitation = result[0]

  const property = await getPropertyById(invitation.property_id)
  if (!property) {
    throw new Error('Invalid property')
  }

  const notificationUrl = `${process.env.APP_URL}/invitations/${invitation.token}`

  await createNotification({
    user_id: invitation.user_id,
    title: 'You have a new invitation',
    message: `You have been invited to join ${property.name}. Click <a href="${notificationUrl}">here</a> to accept the invitation.`,
    type: NotificationType.INVITATION,
  })

  return invitation
}

export const invitationToJSON = (invitation: Invitation) => ({
  id: invitation.id,
  email: invitation.email,
  userId: invitation.user_id,
  invitedBy: invitation.invited_by,
  token: invitation.token,
  propertyId: invitation.property_id,
  status: invitation.status,
  expiresAt: invitation.expires_at,
  updatedAt: invitation.updated_at,
  createdAt: invitation.created_at,
})
