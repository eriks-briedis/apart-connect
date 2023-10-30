import cors from 'cors'
import express from 'express'


const app = express()
const port = 5005

app.use(cors({ origin: 'http://localhost:5005' }))

app.get('/', (_, response) => {
  console.log('Request received!!!')
  response.json({ data: ['gloorgl'] })
})

app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
