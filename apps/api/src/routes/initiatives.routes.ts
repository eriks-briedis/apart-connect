import { Router } from 'express'
import { routeGuard } from '../utils'
import { canUserVoteForInitiative, createInitiative, getInitiativeById, getVotesByInitiativeId, initiativeToJSON, updateInitiative } from '../models'

export const initiativesRouter = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
initiativesRouter.use(routeGuard)

initiativesRouter.post('/', async (req, res) => {
  const {
    label,
    description,
    type = 'poll',
    status = 'draft',
    requiresSignature = false,
    propertyId,
  } = req.body

  if (!label || !description || !propertyId) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const initiative = await createInitiative({
    label,
    description,
    type,
    status,
    requires_signature: requiresSignature,
    property_id: propertyId,
    created_by: req.user.id,
  })

  if (!initiative) {
    res.status(500).json({ error: 'Failed to create initiative' })
    return
  }

  res.json({ success: true, data: initiativeToJSON(initiative) })
})

initiativesRouter.get('/:initiativeId', async (req, res) => {
  const initiativeId = parseInt(req.params.initiativeId, 10)
  const initiative = await getInitiativeById(initiativeId)

  if (!initiative) {
    res.status(404).json({ error: 'Initiative not found' })
    return
  }

  const votes = await getVotesByInitiativeId(initiative.id)
  const canVote = await canUserVoteForInitiative(initiative, req.user)

  res.json({
    success: true,
    data: {
      ...initiativeToJSON(initiative),
      canVote,
      totalVotes: votes.length,
    },
  })
})

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

  await updateInitiative(initiativeId, { status: 'open' })

  res.json({ success: true, message: 'ok' })
})
