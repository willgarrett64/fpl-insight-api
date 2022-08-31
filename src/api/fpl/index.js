import express from 'express'
import { getEvent, getEvents } from './events.js'
import { getFixture, getFixtures, getFixturesByEvent, getFixturesByTeam } from './fixtures.js'
import { getPlayer, getPlayers } from './players.js'
import { getPositions } from './positions.js'
import { getTeam, getTeams } from './teams.js'

const fplRouter = express.Router()

// events
fplRouter.get('/event/:id', getEvent())
fplRouter.get('/events', getEvents())

// fixtures
fplRouter.get('/fixture/:id', getFixture())
fplRouter.get('/fixtures', getFixtures())
fplRouter.get('/fixtures/event/:event', getFixturesByEvent())
fplRouter.get('/fixtures/team/:team', getFixturesByTeam())

// players (premier league players)
fplRouter.get('/player/:id', getPlayer())
fplRouter.get('/players', getPlayers())

// positions (element types)
fplRouter.get('/positions', getPositions())

// squads (user created fpl squads)
// fplRouter.get('/squad/:id', getSquad())

// teams (premier league teams)
fplRouter.get('/team/:id', getTeam())
fplRouter.get('/teams', getTeams())

export default fplRouter