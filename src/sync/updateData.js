import superagent from 'superagent'
import { calcPlayerStats } from './calcPlayerStats.js'
import * as cleanFpl from './cleanFplData.js'

import fplCache from '../cache.js'

export const updateData = async () => {
  const [dataResponse, fixturesResponse] = await Promise.all([
    superagent.get('https://fantasy.premierleague.com/api/bootstrap-static/'),
    superagent.get('https://fantasy.premierleague.com/api/fixtures/')
  ])
  const data = dataResponse.body
  const fixtures = fixturesResponse.body

  console.info('Team data cached')
  fplCache.set('teams', cleanFpl.teams(data.teams))

  console.info('Position data cached')
  fplCache.set('positions', cleanFpl.positions(data.element_types))

  fplCache.set('events', cleanFpl.events(data.events))
  console.info('Event (gameweeks) data cached')

  fplCache.set('fixtures', cleanFpl.fixtures(fixtures, data.teams))
  console.info('Fixture data cached')

  const currentGw = (data.events.find(gw => gw.is_current)).id
  fplCache.set('currentGw', currentGw)
  console.info('Current gameweek data cached')

  const playersData = await Promise.all(data.elements.map(player => {
    return calcPlayerStats(player)
  }))
  fplCache.set('players', playersData)
  console.info('Player data cached')
}
