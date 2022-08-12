import express from 'express'
import { getPlayer, getPlayers } from './players.js'

const fplRouter = express.Router()

// fixtures
fplRouter.get('/fixtures', getFixtures())
fplRouter.get('/fixtures/:id', getFixture())

// players (premier league players)
fplRouter.get('/players', getPlayers())
fplRouter.get('/player/:id', getPlayer())

// squads (user created fpl squads)
// fplRouter.get('/squad/:id', getSquad())

// teams (premier league teams)
fplRouter.get('/teams', getTeams())
fplRouter.get('/team/:id', getTeam())

export default fplRouter