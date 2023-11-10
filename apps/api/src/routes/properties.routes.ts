import { Router } from 'express'
import { attachUserToProperty, createProperty, deleteProperty, detachUserFromProperty, doesUserBelongToProperty, getAllPropertyUsers, getAllUserProperties, getInitiativesByPropertyId, getPropertyById, getUserById, initiativeToJSON, isUserPropertyAdmin, propertyToJSON, updateProperty, userToJSON } from '../models'
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
    numberOfUnits,
  } = req.body

  if (!name || !address || !city || !zip || !country) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await createProperty({
    name,
    address,
    city,
    zip,
    country,
    number_of_units: numberOfUnits,
  })

  if (!property) {
    res.status(500).json({ error: 'Failed to create property' })
    return
  }

  await attachUserToProperty({
    property_id: property.id,
    user_id: req.user.id,
    role: 'property_admin',
    status: 'active',
  })

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
 * PATCH /properties/:propertyId
 * Updates a property
 * Only the property admin can update it
 */
propertiesRouter.patch('/:propertyId', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10)
  const {
    name,
    address,
    city,
    zip,
    country,
    numberOfUnits,
  } = req.body

  if (!propertyId || !name || !address || !city || !zip || !country) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  const property = await getPropertyById(propertyId)
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  const canEdit = await doesUserBelongToProperty(property, req.user)
  if (!property || !canEdit) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  await updateProperty(
    propertyId,
    {
      name,
      address,
      city,
      zip,
      country,
      number_of_units: numberOfUnits,
    },
  )

  res.json({ success: true, message: 'ok' })
})

propertiesRouter.delete('/:propertyId', async (req, res) => {
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

  const canDelete = await doesUserBelongToProperty(property, req.user)
  if (!property || !canDelete) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  await deleteProperty(propertyId)

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
  if (!property) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  const canDelete = await isUserPropertyAdmin(propertyId, req.user.id)
  if (!canDelete) {
    res.status(400).json({ error: 'Invalid property' })
    return
  }

  const user = await getUserById(userId)
  if (!user) {
    res.status(400).json({ error: 'Invalid user' })
    return
  }

  const isAlreadyAttached = await doesUserBelongToProperty(property, user)
  if (!isAlreadyAttached) {
    res.status(400).json({ error: 'User not attached to property' })
    return
  }

  await detachUserFromProperty(userId, propertyId)

  res.json({ success: true, message: 'ok' })
})

/**
 * GET /properties/:propertyId/initiatives
 * Lists all initiatives for a property
 */
propertiesRouter.get('/:propertyId/initiatives', async (req, res) => {
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

  const initiatives = await getInitiativesByPropertyId(propertyId)

  res.json({ success: true, data: initiatives.map(initiativeToJSON) })
})

propertiesRouter.get('/:propertyId/users', async (req, res) => {
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

  const users = await getAllPropertyUsers(propertyId)

  res.json({ success: true, data: users.map(userToJSON) })
})
