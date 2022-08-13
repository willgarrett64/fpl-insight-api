import fplCache from '../../cache.js'
import { getPageResults } from '../../utils/pagination.js'

// get team by id
export const getTeam = () => async (req, res) => {
  const allTeams = await fplCache.get('teams')
  const id = Number(req.params.id)
  const team = allTeams.find(team => team.id === id)
  res.send(team)
}

// get teams
export const getTeams = () => async (req, res) => {
  const allTeams = await fplCache.get('teams')
  // options
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  res.send(getPageResults(allTeams, page, limit))
}