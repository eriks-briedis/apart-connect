import { Router } from 'express'
import { routeGuard } from '../utils'
import { createInitiative, initiativeToJSON } from '../models/initiative'

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
