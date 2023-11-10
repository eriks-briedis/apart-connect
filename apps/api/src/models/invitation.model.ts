import moment from 'moment'
import { knexInstance } from '../db/knexfile'
import { randomBytes } from 'crypto'
import { createNotification } from './notification.model'
import { getPropertyById } from './property.table'
import { InvitationModel, InvitationStatus } from 'shared'
import { User, getUserByEmail, getUserById } from './user.table'

export interface Invitation {
  id: number
  email?: string
  user_id?: number
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

  if (!invitation) {
    throw new Error('Failed to create invitation')
  }

  const property = await getPropertyById(invitation.property_id)
  if (!property) {
    throw new Error('Invalid property')
  }

  const notificationUrl = createInvitationUrl(invitation)

  if (invitation.user_id) {
    await createNotification({
      user_id: invitation.user_id,
      title: 'Jūs esat saņēmis jaunu ielūgumu!',
      message: `Jūs esat saņēmis uzaicinājumu pievienoties ${property.name}. Lūdzu, apskatiet un pieņemiet vai norietu uzaicinājumu`,
      url: notificationUrl,
      type: 'invitation',
    })

  }

  return invitation
}

export const setInvitationStatus = async (id: number, status: InvitationStatus) => {
  return await Invitations().where({ id }).update({
    status,
    updated_at: new Date(),
  })
}

export const getUserByInvitationToken = async (token: string) => {
  const invitation = await getInvitationByToken(token)
  let user: User | undefined = undefined

  if (!!invitation?.user_id) {
    user = await getUserById(invitation.user_id)
  }

  if (!!invitation?.email) {
    user = await getUserByEmail(invitation.email)
  }

  return {
    user,
    invitation,
  }
}

export const createInvitationUrl = (invitation: Invitation, newUser = false) => {
  return `${process.env.APP_URL}/${newUser ? 'auth/join' : 'invitations'}/${invitation.token}`
}

export const invitationToJSON = (invitation: Invitation): InvitationModel => ({
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
