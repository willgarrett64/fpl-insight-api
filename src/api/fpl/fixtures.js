import fplCache from '../../cache.js'
import { getPageResults } from '../../utils/pagination.js'

// get fixture by id
export const getFixture = () => async (req, res) => {
  const allFixtures = await fplCache.get('fixtures')
  const id = Number(req.params.id)
  const fixture = allFixtures.find(fixture => fixture.id === id)
  res.send(fixture)
}

// get fixtures
export const getFixtures = () => async (req, res) => {
  const allFixtures = await fplCache.get('fixtures')
  // options
  const page = req.query.page || 1
  const limit = req.query.limit || 40
  res.send(getPageResults(allFixtures), page, limit)
}