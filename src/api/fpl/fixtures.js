import fplCache from '../../cache.js'
import { getPageResults } from '../../utils/pagination.js'

// get fixture by id
export const getFixture = () => async (req, res) => {
  const fixtures = await fplCache.get('fixtures')
  const id = Number(req.params.id)
  const fixture = fixtures.find(fixture => fixture.id === id)
  res.send(fixture)
}

// get fixtures
export const getFixtures = () => async (req, res) => {
  let fixtures = await fplCache.get('fixtures')

  // options
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  res.send(getPageResults(fixtures, page, limit))
}

// get fixtures by event (gameweek)
export const getFixturesByEvent = () => async (req, res) => {
  let fixtures = await fplCache.get('fixtures')

  // filter by event (gameweek)
  const event = Number(req.params.event)
  fixtures = fixtures.filter(fixture => fixture.event === event)

  // options
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  res.send(getPageResults(fixtures, page, limit))
}

// get fixtures by team
export const getFixturesByTeam = () => async (req, res) => {
  let fixtures = await fplCache.get('fixtures')

  // filter by team
  const team = Number(req.params.team)
  fixtures = fixtures.filter(fixture => fixture.team_a === team || fixture.team_b === team)

  // options
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 38
  res.send(getPageResults(fixtures, page, limit))
}
