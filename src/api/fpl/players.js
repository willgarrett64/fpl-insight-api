import fplCache from '../../cache.js'
import { getPageResults } from '../../utils/pagination.js'

// get player by id
export const getPlayer = () => async (req, res) => {
  const allPlayers = await fplCache.get('players')
  const id = Number(req.params.id)
  const player = allPlayers.find(player => player.id === id)
  res.send(player)
}

// get players
export const getPlayers = () => async (req, res) => {
  const allPlayers = await fplCache.get('players')
  // options
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 40
  res.send(getPageResults(allPlayers, page, limit))
}