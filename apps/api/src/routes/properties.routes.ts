import { Router } from 'express';
import { Properties } from '../models/property.table';

export const propertiesRouter = Router();

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

  await Properties().insert({
    name,
    address,
    city,
    zip,
    country,
    created_at: new Date(),
    updated_at: new Date(),
  })

  res.json({ success: true, message: 'ok' })
})

propertiesRouter.get('/', async (_, res) => {
  console.log('GET /properties')
  const properties = await Properties().select()

  res.json({ data: properties})
})
