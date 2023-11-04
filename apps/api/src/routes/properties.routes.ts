import { Router } from 'express'
import { ResolutionStatus, ResolutionType, attachUserToProperty, createProperty, createResolution, detachUserFromProperty, doesUserBelongToProperty, getAllUserProperties, getPropertyById, getResolutionsByPropertyId, isUserAttachedToProperty, propertyToJSON, resolutionToJSON } from '../models'
import { routeGuard } from '../utils'

export const propertiesRouter = Router()

/**
 * All routes in this file are protected by the routeGuard middleware
 */
propertiesRouter.use(routeGuard)

/**
 * POST /properties
 * Creates a new property
 */
propertiesRouter.post('/', async (req, res) => {
  const {
    name,
    address,
    city,
    zip,
    country,
  } = req.body

  if (!name || !address || !city || !zip || !country) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  await createProperty({ name, address, city, zip, country, admin_id: req.user.id })

  res.json({ success: true, message: 'ok' })
})

/**
 * GET /properties
 * Lists all properties for the logged in user
 */
propertiesRouter.get('/', async (req, res) => {
  const properties = await getAllUserProperties(req.user.id)

  res.json({ success: true, data: properties.map(propertyToJSON) })
})

/**
 * GET /properties/:propertyId
 * Gets a property by id
 * Only the property admin or users attached to the property can view it
 */
propertiesRouter.get('/:propertyId', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10)

  if (!propertyId) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  const canView = await doesUserBelongToProperty(property, req.user)
  if (!canView) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  res.json({ success: true, data: propertyToJSON(property) })
})

/**
 * POST /properties/:propertyId/attach-user
 * Attaches a user to a property
 * Only the property admin can attach users
 */
propertiesRouter.post('/:propertyId/attach-user', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10)
  const userId = parseInt(req.body.userId, 10)

  if (!propertyId || !userId) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property || property.admin_id != req.user.id) {
    res.status(400).json({ error: 'You cannot attach users to this property' })
    return
  }

  const isAlreadyAttached = await isUserAttachedToProperty(userId, propertyId)
  if (isAlreadyAttached) {
    res.status(400).json({ error: 'User already attached to property' })
    return
  }

  await attachUserToProperty(userId, propertyId)

  res.json({ success: true, message: 'ok' })
})

/**
 * POST /properties/:propertyId/detach-user
 * Detaches a user from a property
 * Only the property admin can detach users
 */
propertiesRouter.post('/:propertyId/detach-user', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10)
  const userId = parseInt(req.body.userId, 10)

  if (!propertyId || !userId) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property || property.admin_id !== req.user.id) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  const isAlreadyAttached = await isUserAttachedToProperty(userId, propertyId)
  if (!isAlreadyAttached) {
    res.status(400).json({ error: 'User not attached to property' })
    return
  }

  await detachUserFromProperty(userId, propertyId)

  res.json({ success: true, message: 'ok' })
})

propertiesRouter.post('/:propertyId/resolutions', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10)
  const {
    label,
    description,
    status = ResolutionStatus.DRAFT,
    type = ResolutionType.INFO,
  } = req.body

  await createResolution({
    label,
    description,
    status,
    type,
    property_id: propertyId,
    created_by: req.user.id,
  })

  res.json({ success: true, message: 'ok' })
})

/**
 * GET /properties/:propertyId/resolutions
 * Lists all resolutions for a property
 */
propertiesRouter.get('/:propertyId/resolutions', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10)

  if (!propertyId) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  const canView = await isUserAttachedToProperty(req.user.id, propertyId)
  if (!canView && property.admin_id !== req.user.id) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  const resolutions = await getResolutionsByPropertyId(propertyId)

  res.json({ successs: true, data: resolutions.map(resolutionToJSON) })
})

// propertiesRouter.get('/:propertyId/users', async (req, res) => {
//   const propertyId = parseInt(req.params.propertyId, 10)

//   if (!propertyId) {
//     res.status(400).json({ error: 'Missing required fields' })
//     return
//   }

//   const property = await getPropertyById(propertyId)
//   if (!property) {
//     res.status(400).json({ error: 'Invalid property' })
//     return
//   }

//   const canView = await isUserAttachedToProperty(req.user.id, propertyId)
//   if (!canView && property.admin_id !== req.user.id) {
//     res.status(400).json({ error: 'Invalid property' })
//     return
//   }

//   const users = await getUserProperties(propertyId)

//   res.json({ success: true, data: users.map(userToJSON) })
// })
