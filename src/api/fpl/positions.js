import fplCache from '../../cache.js'

// get positions
export const getPositions = () => async (req, res) => {
  const positions = await fplCache.get('positions')
  res.send(positions)
}