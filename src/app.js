import express from 'express'
const app = express()
const port = process.env.PORT || 3001

import fplCache from './cache.js'

import superagent from 'superagent'
import { updateData } from './sync/updateData.js'
// import db from './db/db'

import fplRouter from './api/fpl/index.js'

app.use('/fpl', (req, res) => {
  fplRouter(req, res)
})

app.listen(port, async () => {
  const data = await updateData(fplCache)
  fplCache.set('allData', data)
  console.log(`FPL Insight API listening on ${port}`)
})