import { Router } from 'express'
import { ResolutionStatus, VoteType, createVote, doesUserBelongToProperty, getPropertyById, getResolutionById, isValidVoteTypeForResolution } from '../models'
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
    resolutionId,
    value,
    type = VoteType.SIMPLE,
  } = req.body

  if (!resolutionId || !value) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const resolution = await getResolutionById(resolutionId)
  const property = await getPropertyById(resolution.property_id)
  const canVote = await doesUserBelongToProperty(property, req.user)

  if (!canVote) {
    res.status(400).json({ error: 'You cannot vote on this resolution' })
    return
  }

  if (resolution.status !== ResolutionStatus.OPEN) {
    res.status(400).json({ error: 'Resolution is not open' })
    return
  }

  if (!isValidVoteTypeForResolution(resolution, type)) {
    res.status(400).json({ error: 'Invalid vote type for resolution' })
    return
  }

  await createVote({
    resolution_id: resolutionId,
    user_id: req.user.id,
    value,
    type,
  })

  res.json({ success: true, message: 'ok' })
})
