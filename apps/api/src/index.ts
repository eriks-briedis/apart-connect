import express from 'express'
import { knexInstance } from './db/knexfile'
import { authRouter, initiativesRouter, invitationsRouter, notificationsRouter, votesRouter } from './routes'
import { propertiesRouter } from './routes/properties.routes'
import { usersRouter } from './routes/users.routes'
import cors = require('cors')

const app = express()
const port = process.env.PORT || 5005
app.use(express.json())
app.use(cors({
  origin: '*',
}))

// if (process.env.NODE_ENV !== 'production') {
  knexInstance.migrate.latest()
// }

// Routes
app.use('/auth', authRouter)
app.use('/properties', propertiesRouter)
app.use('/users', usersRouter)
app.use('/vote', votesRouter)
app.use('/invitations', invitationsRouter)
app.use('/notifications', notificationsRouter)
app.use('/initiatives', initiativesRouter)
app.use('/votes', votesRouter)

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to ApartConnect API!' })
})

// Start the server
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
