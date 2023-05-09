import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors())
const port = process.env.PORT || 3001

import db from './db'

// import superagent from 'superagent'
import { updateData } from './sync/updateData.js'

import fplRouter from './api/fpl/index.js'
// import usersRouter from './api/users/index.js'

let dataCached = false

app.use('/fpl', (req, res) => {
  if (!dataCached) {
    res.send('Server initializing - please try again later')
    return
  }
  fplRouter(req, res)
})

app.listen(port, async () => {
  await updateData()
  dataCached = true
  console.log(`FPL Insight API listening on ${port}`)
})
