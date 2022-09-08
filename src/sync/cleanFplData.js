import fplCache from '../cache.js'

// map array of data objects to new array where objects only keep the keys passed in
export const cleanseData = (data, keys) => {
  return data.map(el => {
    const newEl = {}
    keys.forEach(key => newEl[key] = el[key])
    return newEl
  })
}

// extract team name (e.g. Arsenal) and short name (e.g. ARS) from team ID
const getTeamName = (teamId, teams) => {
  const team = teams.find(team => teamId === team.id)
  return {
    name: team.name,
    short_name: team.short_name
  }
}


const eventKeys = ["id", "name", "deadline_time", "average_entry_score", "finished", "data_checked", "deadline_time_epoch", "highest_score", "is_previous", "is_current", "is_next", "chip_plays", "most_selected", "most_transferred_in", "top_element", "top_element_info", "most_captained", "most_vice_captained"]
export const events = events => cleanseData(events, eventKeys)



const fixtureKeys = ["event", "finished", "finished_provisional", "id", "kickoff_time", "minutes", "provisional_start_time", "started", "team_a", "team_a_score", "team_h", "team_h_score", "stats", "team_h_difficulty", "team_a_difficulty"]
export const fixtures = (fixtures, teams) => {
  const cleanFixtures = cleanseData(fixtures, fixtureKeys)
  cleanFixtures.forEach(f => {
    const team_h = getTeamName(f.team_h, teams)
    const team_a = getTeamName(f.team_a, teams)
    f.team_h_name = team_h.name
    f.team_h_short_name = team_h.short_name
    f.team_a_name = team_a.name
    f.team_a_short_name = team_a.short_name
  })
  return cleanFixtures
}


const positionKeys = ["id", "plural_name", "plural_name_short", "singular_name", "singular_name_short", "squad_select", "squad_min_play", "squad_max_play", "element_count"]
export const positions = positions => cleanseData(positions, positionKeys)


const teamKeys = ["id", "name", "short_name", "strength", "strength_overall_home", "strength_overall_away", "strength_attack_home", "strength_attack_away", "strength_defence_home", "strength_defence_away"]
export const teams = teams => cleanseData(teams, teamKeys)


