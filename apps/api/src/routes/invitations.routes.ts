import { Router } from 'express'
import { attachUserToProperty, doesUserBelongToProperty, getPropertyById, getUserByEmail } from '../models'
import { createInvitation, createInvitationUrl, getInvitationByToken, invitationToJSON, setInvitationStatus } from '../models/invitation.model'
import { markNotificationAsRead } from '../models/notification.model'
import { routeGuard } from '../utils'
import { sendEmail } from '../utils/send-email'

export const invitationsRouter = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
invitationsRouter.use(routeGuard)

/**
 * POST /invitations
 * Creates a new invitation
 * If no email is provided, a generic invitation is created
 * If an email is provided, an invitation is created for that email
 * If the email is already registered, the user is attached to the property
 */
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
    // create generic invitation to join a property
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
    res.status(400).json({ error: 'Only the property users can invite others' })
    return
  }

  const invitee = await getUserByEmail(email)

  const invitation = await createInvitation({
    email,
    property_id: property.id,
    user_id: !!invitee ? invitee.id : undefined,
    invited_by: req.user.id,
  })

  if (!invitee) {
    // @TODO: Send email to invitee
    const invitationUrl = createInvitationUrl(invitation, true)

    await sendEmail({
      receiverEmail: email,
      receiverName: '', // @TODO: Is this required?
      subject: 'Jūs esat uzaicināts pievienoties īpašumam',
      html: `Sveicināti!<br><br> ${req.user.first_name} ${req.user.last_name} ir uzaicinājies Jūs pievienoties citiem "${property.name}" kaimiņiem platformā ApartConnect. Izmantojiet šo saiti, lai pievienotos: <a href="${invitationUrl}">${invitationUrl}</a>`,
    })
  }

  res.json({ success: true, data: invitationToJSON(invitation) })
})

/**
 * POST /invitations/accept
 * A registered user accepts an invitation
 */
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

  if (await doesUserBelongToProperty(property, req.user)) {
    await markNotificationAsRead(invitation.id)
    res.status(400).json({ error: 'User is already attached to this property' })
    return
  }

  await attachUserToProperty({
    property_id: property.id,
    user_id: req.user.id,
    role: 'user',
    status: 'active',
  })
  await setInvitationStatus(invitation.id, 'accepted')

  res.json({ success: true, message: 'ok' })
})
