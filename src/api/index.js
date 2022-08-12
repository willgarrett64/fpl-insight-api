import express from 'express'
const app = express()
const port = process.env.PORT || 3001

import { updateData } from './sync/updateData.js'
// import db from './db/db'

const getDataTest = async (req, res) => {
  const players = fplCache.get('players')
  res.send(players)
}

app.get('/', (req, res) => {
  getDataTest(req, res)
})

app.listen(port, async () => {
  const data = await updateData(fplCache)
  fplCache.set('allData', data)
  console.log(`FPL Insight API listening on ${port}`)
})