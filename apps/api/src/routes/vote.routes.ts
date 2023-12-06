import { Router } from 'express'
import { createVote, doesUserBelongToProperty, getInitiativeById, getPropertyById } from '../models'
import { routeGuard } from '../utils'

export const votesRouter = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
votesRouter.use(routeGuard)

/**
 * POST /votes
 * Creates a new vote
 * Only users belonging to the property can vote
 * Only valid vote types for the resolution can be used
 */
votesRouter.post('/', async (req, res) => {
  const {
    initiativeId,
    vote,
  } = req.body

  if (!initiativeId || vote === undefined || vote === null) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const initiative = await getInitiativeById(initiativeId)
  if (!initiative) {
    res.status(404).json({ error: 'Initiative not found' })
    return
  }

  const property = await getPropertyById(initiative.property_id)
  if (!property) {
    res.status(404).json({ error: 'Property not found' })
    return
  }

  const canVote = await doesUserBelongToProperty(property, req.user)

  if (!canVote) {
    res.status(400).json({ error: 'You cannot vote on this resolution' })
    return
  }

  if (initiative.status !== 'open') {
    res.status(400).json({ error: 'Initiative is not open' })
    return
  }

  await createVote({
    initiative_id: initiativeId,
    user_id: req.user.id,
    value: vote,
  })

  res.json({ success: true, message: 'ok' })
})
