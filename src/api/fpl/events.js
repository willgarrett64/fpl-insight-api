import fplCache from '../../cache.js'
import { getPageResults } from '../../utils/pagination.js'

// get event by id
export const getEvent = () => async (req, res) => {
  const events = await fplCache.get('events')
  const id = Number(req.params.id)
  const event = events.find(event => event.id === id)
  res.send(event)
}

// get events
export const getEvents = () => async (req, res) => {
  let events = await fplCache.get('events')
  // options
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 38
  res.send(getPageResults(events, page, limit))
}
