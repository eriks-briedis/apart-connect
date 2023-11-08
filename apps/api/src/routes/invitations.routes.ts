import { Router } from 'express'
import { routeGuard } from '../utils'
import { attachUserToProperty, doesUserBelongToProperty, getPropertyById, getUserByEmail, isUserAttachedToProperty } from '../models'
import { createInvitation, createInvitationUrl, getInvitationByToken, invitationToJSON } from '../models/invitation.model'
import { markNotificationAsRead } from '../models/notification.model'

export const invitationsRouter = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
invitationsRouter.use(routeGuard)

invitationsRouter.post('/', async (req, res) => {
  const { email, propertyId } = req.body

  if (!propertyId) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  if (!email) {
    // create generic invitation
    const invitation = await createInvitation({
      property_id: property.id,
      invited_by: req.user.id,
    })
    if (!invitation) {
      res.status(500).json({ error: 'Failed to create invitation' })
      return
    }

    res.json({ success: true, data: createInvitationUrl(invitation, true) })
    return
  }

  if (!doesUserBelongToProperty(property, req.user)) {
    res.status(400).json({ error: 'Only the property admin can invite users' })
    return
  }

  const invitee = await getUserByEmail(email)
  if (!invitee) {
    // @TODO: Send email to invitee
  }

  const invitation = await createInvitation({
    email,
    property_id: property.id,
    user_id: !!invitee ? invitee.id : undefined,
    invited_by: req.user.id,
  })

  res.json({ success: true, data: invitationToJSON(invitation) })
})

invitationsRouter.post('/accept', async (req, res) => {
  const { token } = req.body

  if (!token) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const invitation = await getInvitationByToken(token)
  if (!invitation || invitation.user_id !== req.user.id || invitation.status !== 'pending') {
    res.status(400).json({ error: 'Invalid invitation' })
    return
  }

  const property = await getPropertyById(invitation.property_id)
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  if (await isUserAttachedToProperty(property.id, req.user.id)) {
    await markNotificationAsRead(invitation.id)
    res.status(400).json({ error: 'User is already attached to this property' })
    return
  }

  await attachUserToProperty(property.id, req.user.id)
  await markNotificationAsRead(invitation.id)

  res.json({ success: true, message: 'ok' })
})
