import { Router } from 'express'
import { canUserVoteForInitiative, createInitiative, deleteInitiativeById, doesUserBelongToProperty, getInitiativeById, getPropertyById, getVotesByInitiativeId, initiativeToJSON, isUserPropertyAdmin, updateInitiative } from '../models'
import { routeGuard, sendNewInitiativeNotifications } from '../utils'

export const initiativesRouter = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
initiativesRouter.use(routeGuard)

/**
 * POST /initiatives
 * Create a new initiative
 * Only users that are attached to the property can create initiatives
 * If the initiative is open, notify all users in the property
 */
initiativesRouter.post('/', async (req, res) => {
  const {
    label,
    description,
    type = 'poll',
    status = 'draft',
    requiresSignature = false,
    propertyId,
    expiresAt,
  } = req.body

  if (!label || !description || !propertyId || !expiresAt) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property) {
    res.status(404).json({ error: 'Property not found' })
    return
  }

  const canCreateInitiative = await doesUserBelongToProperty(property, req.user)
  if (!canCreateInitiative) {
    res.status(403).json({ error: 'You are not allowed to create initiatives for this property' })
    return
  }

  const initiative = await createInitiative({
    label,
    description,
    type,
    status,
    requires_signature: requiresSignature,
    expires_at: expiresAt,
    property_id: propertyId,
    created_by: req.user.id,
  })

  if (!initiative) {
    res.status(500).json({ error: 'Failed to create initiative' })
    return
  }

  if (initiative.status === 'open') {
    await sendNewInitiativeNotifications(property, initiative)
  }

  res.json({ success: true, data: initiativeToJSON(initiative) })
})

/**
 * GET /initiatives/:initiativeId
 * Get an initiative by id
 * Only users that are attached to the property can view initiatives
 */
initiativesRouter.get('/:initiativeId', async (req, res) => {
  const initiativeId = parseInt(req.params.initiativeId, 10)
  const initiative = await getInitiativeById(initiativeId)

  if (!initiative) {
    res.status(404).json({ error: 'Initiative not found' })
    return
  }

  const votes = await getVotesByInitiativeId(initiative.id)
  const canVote = await canUserVoteForInitiative(initiative, req.user)
  const isPropertyAdmin = await isUserPropertyAdmin(initiative.property_id, req.user.id)
  const isInitiativeCreator = initiative.created_by === req.user.id

  res.json({
    success: true,
    data: {
      ...initiativeToJSON(initiative),
      canVote,
      canPublish: isPropertyAdmin && initiative.status === 'draft',
      canDelete: (isPropertyAdmin || isInitiativeCreator) && initiative.status === 'draft',
      canEdit: (isPropertyAdmin || isInitiativeCreator) && initiative.status === 'draft',
      totalVotes: votes.length,
    },
  })
})

/**
 * PATCH /initiatives/:initiativeId
 * Update an initiative
 * Only draft initiatives can be updated
 */
initiativesRouter.patch('/:initiativeId', async (req, res) => {
  const initiativeId = parseInt(req.params.initiativeId, 10)
  const initiative = await getInitiativeById(initiativeId)

  if (!initiative) {
    res.status(404).json({ error: 'Initiative not found' })
    return
  }

  if (initiative.status !== 'draft') {
    res.status(400).json({ error: 'Initiative is not draft' })
    return
  }

  const updatedInitiative = await updateInitiative(
    initiativeId,
    {
      label: req.body.label,
      description: req.body.description,
      type: req.body.type,
      status: req.body.status,
      requires_signature: req.body.requiresSignature,
      expires_at: req.body.expiresAt,
    },
  )

  res.json({ success: true, data: updatedInitiative })
})

/**
 * POST /initiatives/:initiativeId/publish
 * Publish an initiative
 * Only the creator of the initiative can publish it
 * Only draft initiatives can be published
 * Notify all users in the property
 */
initiativesRouter.post('/:initiativeId/publish', async (req, res) => {
  const initiativeId = parseInt(req.params.initiativeId, 10)
  const initiative = await getInitiativeById(initiativeId)

  if (!initiative) {
    res.status(404).json({ error: 'Initiative not found' })
    return
  }

  if (initiative.status !== 'draft') {
    res.status(400).json({ error: 'Initiative is not draft' })
    return
  }

  if (initiative.created_by !== req.user.id) {
    res.status(400).json({ error: 'Only the creator can publish the initiative' })
    return
  }

  const property = await getPropertyById(initiative.property_id)
  if (!property) {
    res.status(404).json({ error: 'Property not found' })
    return
  }

  await updateInitiative(initiativeId, { status: 'open' })
  await sendNewInitiativeNotifications(property, initiative)

  res.json({ success: true, message: 'ok' })
})

initiativesRouter.delete('/:initiativeId', async (req, res) => {
  const initiativeId = parseInt(req.params.initiativeId, 10)
  const initiative = await getInitiativeById(initiativeId)

  if (!initiative) {
    res.status(404).json({ error: 'Initiative not found' })
    return
  }

  const isUserAdmin = await isUserPropertyAdmin(initiative.property_id, req.user.id)
  if (!isUserAdmin) {
    res.status(403).json({ error: 'You are not allowed to delete initiatives for this property' })
    return
  }

  const deletedInitiative = await deleteInitiativeById(initiativeId)

  res.json({ success: true, data: deletedInitiative })
})
