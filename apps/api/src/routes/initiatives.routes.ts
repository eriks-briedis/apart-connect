import { Router } from 'express'
import { routeGuard } from '../utils'
import { createInitiative, getInitiativeById, initiativeToJSON } from '../models'

export const initiativesRoute = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
initiativesRoute.use(routeGuard)

initiativesRoute.post('/', async (req, res) => {
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

  res.json({ success: true, data: initiativeToJSON(initiative) })
})

initiativesRoute.get('/:initiativeId', async (req, res) => {
  const initiativeId = parseInt(req.params.initiativeId, 10)
  const initiative = await getInitiativeById(initiativeId)

  res.json({ success: true, data: initiativeToJSON(initiative) })
})
