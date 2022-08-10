const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const superagent = require('superagent')
// const db = require('./db/db')

const getDataTest = async (req, res) => {
  const response = await superagent.get('https://fantasy.premierleague.com/api/bootstrap-static/')
  res.send(response.body)
}

app.get('/', (req, res) => {
  getDataTest(req, res)
})

app.listen(port, () => {
  console.log(`FPL Insight API listening on ${port}`)
})