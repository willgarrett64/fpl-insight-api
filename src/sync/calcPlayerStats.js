import fplCache from '../cache.js'
import superagent from 'superagent'
import { statsLastGames } from './statsLastGames.js'

const playerKeys = ["dreamteam_count", "element_type", "ep_next", "ep_this", "event_points", "first_name", "form", "id", "in_dreamteam", "news", "news_added", "now_cost", "photo", "points_per_game", "second_name", "selected_by_percent", "status", "team", "total_points", "transfers_in", "transfers_in_event", "transfers_out", "transfers_out_event", "web_name", "minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "own_goals", "penalties_saved", "penalties_missed", "yellow_cards", "red_cards", "saves", "bonus", "bps", "influence", "creativity", "threat", "ict_index", "influence_rank", "influence_rank_type", "creativity_rank", "creativity_rank_type", "threat_rank", "threat_rank_type", "ict_index_rank", "ict_index_rank_type", "corners_and_indirect_freekicks_order", "corners_and_indirect_freekicks_text", "direct_freekicks_order", "direct_freekicks_text", "penalties_order", "penalties_text"]
const fixtureKeys = ["id", "team_h", "team_a", "event", "finished", "minutes", "kickoff_time", "event_name", "is_home", "difficulty"]
const historyKeys = ["fixture", "opponent_team", "total_points", "was_home", "kickoff_time", "team_h_score", "team_a_score", "round", "minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "own_goals", "penalties_saved", "penalties_missed", "yellow_cards", "red_cards", "saves", "bonus", "bps", "influence", "creativity", "threat", "ict_index", "value", "transfers_balance", "selected", "transfers_in", "transfers_out"]


// Take existing player stats from 'element-summary/id/' endpoint and add to it.
export const calcPlayerStats = async (player) => {
  const teams = fplCache.get('teams')
  const allFixtures = fplCache.get('fixtures')

  let response = null
  while (!response) {
    try {
      const newPlayer = {}
      playerKeys.forEach(key => newPlayer[key] = player[key])

      // add position
      switch (player.element_type) {
        case 1:
          newPlayer.position = 'GKP'
          newPlayer.full_position = 'Goalkeeper'
          break
        case 2:
          newPlayer.position = 'DEF'
          newPlayer.full_position = 'Defender'
          break
        case 3:
          newPlayer.position = 'MID'
          newPlayer.full_position = 'Midfielder'
          break
        case 4:
          newPlayer.position = 'FWD'
          newPlayer.full_position = 'Forward'
          break
      }

      // now_cost is 10x the actual value
      newPlayer.now_cost = (player.now_cost / 10).toFixed(1)

      const getTeamName = (teamId) => {
        const team = teams.find(team => teamId === team.id)
        return {
          team_name: team.name,
          team_short_name: team.short_name
        }
      }

      // Find the player's team based on team ID. Add both full team name (i.e. Arsenal) and short name (i.e. ARS) to the playerStats object.
      const playerTeam = getTeamName(player.team)
      newPlayer.team_name = playerTeam.team_name
      newPlayer.team_short_name = playerTeam.team_short_name

      // add fixtures (future) and history (past)
      response = await superagent.get(`https://fantasy.premierleague.com/api/element-summary/${player.id}/`)
      const fixtures = response.body.fixtures.map(fixture => {
        const f = {}
        fixtureKeys.forEach(key => f[key] = fixture[key])
        const fixture_team_h = getTeamName(fixture.team_h)
        f.team_h_name = fixture_team_h.team_name
        f.team_h_short_name = fixture_team_h.team_short_name
        const fixture_team_a = getTeamName(fixture.team_a)
        f.team_a_name = fixture_team_a.team_name
        f.team_a_short_name = fixture_team_a.team_short_name

        return f
      })

      const history = response.body.history.map(fixture => {
        const h = {}
        historyKeys.forEach(key => h[key] = fixture[key])
        const opponent_team = getTeamName(fixture.opponent_team)
        if (fixture.was_home) {
          h.team_a_name = opponent_team.team_name
          h.team_a_short_name = opponent_team.team_short_name
          h.team_h_name = playerTeam.team_name
          h.team_h_short_name = playerTeam.team_short_name
        }
        else {
          h.team_h_name = opponent_team.team_name
          h.team_h_short_name = opponent_team.team_short_name
          h.team_a_name = playerTeam.team_name
          h.team_a_short_name = playerTeam.team_short_name
        }

        h.value = fixture.value / 10 // value is 10x the actual value

        return h
      })

      newPlayer.fixtures = { fixtures, history }


      // Add points per million and points per (100) mins played.
      newPlayer.points_per_million = (10 * player.total_points / player.now_cost).toFixed(2)

      if (player.minutes) newPlayer.points_per_mins_played = (100 * player.total_points / player.minutes).toFixed(2)
      else newPlayer.points_per_mins_played = 'n/a'

      // Access past fixtures
      const pastGames = newPlayer.fixtures.history

      // Fixture difficulty rating (fdr) isn't available in the player's fixture stats, so we have the full fixtures array (of every fixture in the game) to find the fdr.
      pastGames.forEach(game => {
        const fixtureDetails = allFixtures.find(fixture => game.fixture === fixture.id)
        if (game.was_home) game.difficulty = fixtureDetails.team_h_difficulty
        else game.difficulty = fixtureDetails.team_a_difficulty
      })

      // Calculate average points for home/away games
      // Sort games by home and away, but only when player made appearance (mins > 0)
      const home = []
      const away = []
      pastGames.forEach(game => {
        if (game.minutes) {
          if (game.was_home) {home.push(game.total_points)}
          else {away.push(game.total_points)}
        }
      })

      // Calculate average points scored per home and away game (played).
      const avgPoints = arr => {
        const res = arr.reduce((a, b) => a + b, 0) / arr.length.toFixed(2)
        if (res) return res.toFixed(2)
        else return 'n/a'
      }

      newPlayer.avg_points_home = avgPoints(home)
      newPlayer.avg_points_away = avgPoints(away)

      // Calculate average points for each fixture difficult rating (FDR)
      const fdr = [[], [], [], [], []]
      pastGames.forEach(game => {
        if (game.minutes) {
          fdr[game.difficulty - 1].push(game.total_points)
        }
      })
      newPlayer.avg_points_fdr_1 = avgPoints(fdr[0])
      newPlayer.avg_points_fdr_2 = avgPoints(fdr[1])
      newPlayer.avg_points_fdr_3 = avgPoints(fdr[2])
      newPlayer.avg_points_fdr_4 = avgPoints(fdr[3])
      newPlayer.avg_points_fdr_5 = avgPoints(fdr[4])

      return newPlayer
    }
    catch (error) {
      console.error(`Failed to get player ${player.id} - ${player.web_name}. Re-attempting.`)
    }
  }
}
