import { Router } from 'express'
import { Properties, createProperty } from '../models'
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

propertiesRouter.get('/', async (_, res) => {
  console.log('GET /properties')
  const properties = await Properties().select()

  res.json({ data: properties })
})
