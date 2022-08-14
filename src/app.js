import express from 'express'
const app = express()
const port = process.env.PORT || 3001

// import db from './db/db'

// import superagent from 'superagent'
import { updateData } from './sync/updateData.js'

import fplRouter from './api/fpl/index.js'
// import usersRouter from './api/users/index.js'

app.use('/fpl', (req, res) => {
  fplRouter(req, res)
  // usersRouter(req, res)
})

app.listen(port, async () => {
  await updateData()
  console.log(`FPL Insight API listening on ${port}`)
})