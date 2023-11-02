import express from 'express'
import { knexInstance } from './db/knexfile'
import { authRouter } from './routes'
import { propertiesRouter } from './routes/properties.routes'
import { usersRouter } from './routes/users.routes'

const app = express()
const port = process.env.PORT || 5005
app.use(express.json())
// Run migrations on startup
knexInstance.migrate.latest()

// Routes
app.use('/auth', authRouter)
app.use('/properties', propertiesRouter)
app.use('/users', usersRouter)

// Start the server
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
