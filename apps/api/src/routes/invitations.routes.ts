import { Router } from 'express'
import { routeGuard } from '../utils'
import { attachUserToProperty, doesUserBelongToProperty, getPropertyById, getUserByEmail, isUserAttachedToProperty } from '../models'
import { InvitationStatus, createInvitation, getInvitationByToken, invitationToJSON } from '../models/invitation.model'

export const invitationsRoute = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
invitationsRoute.use(routeGuard)

invitationsRoute.post('/', async (req, res) => {
  const { email, propertyId } = req.body

  if (!email || !propertyId) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
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
    user_id: !!invitee ? invitee.id : null,
    invited_by: req.user.id,
  })

  res.json({ success: true, invitation: invitationToJSON(invitation) })
})

invitationsRoute.post('/accept', async (req, res) => {
  const { token } = req.body

  if (!token) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const invitation = await getInvitationByToken(token)
  if (!invitation || invitation.user_id !== req.user.id || invitation.status !== InvitationStatus.PENDING) {
    res.status(400).json({ error: 'Invalid invitation' })
    return
  }

  const property = await getPropertyById(invitation.property_id)
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  if (await isUserAttachedToProperty(property.id, req.user.id)) {
    res.status(400).json({ error: 'User is already attached to this property' })
    return
  }

  await attachUserToProperty(property.id, req.user.id)

  res.json({ success: true, message: 'ok' })
})
