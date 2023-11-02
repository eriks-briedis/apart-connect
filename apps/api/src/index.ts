// import cors from 'cors'
import { knexInstance } from './db/knexfile';
import { propertiesRouter } from './routes/properties.routes';
import { usersRouter } from './routes/users.routes';
import express from 'express';
import { Users } from './models';

const app = express()
const port = 5005
app.use(express.json())
knexInstance.migrate.latest()

app.use('/properties', propertiesRouter)
app.use('/users', usersRouter)


app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
