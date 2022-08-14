import superagent from 'superagent'
import { calcPlayerStats } from './calcPlayerStats.js'

import fplCache from '../cache.js'

export const updateData = () => {
  return Promise.all([
    superagent.get('https://fantasy.premierleague.com/api/bootstrap-static/'),
    superagent.get('https://fantasy.premierleague.com/api/fixtures/')
  ])
  .then(([dataResponse, fixturesResponse]) => {
    const data = dataResponse.body
    const fixtures = fixturesResponse.body

    console.info('Saving teams')
    fplCache.set('teams', data.teams)

    console.info('Saving events (gameweeks)')
    fplCache.set('events', data.events)

    console.info('Saving fixtures')
    fplCache.set('fixtures', fixtures)
    data.fixtures = fixtures

    const currentGw = (data.events.find(gw => gw.is_current)).id
    data.currentGw = currentGw
    console.info('Saving current gameweek')
    fplCache.set('currentGw', currentGw)

    return Promise.all(data.elements.map(player => {
      return calcPlayerStats(fplCache, player)
    }))
    .then(playersData => {
      data.elements = playersData
      console.info('Saving players')
      fplCache.set('players', playersData)
      return data
    })
  })
}
