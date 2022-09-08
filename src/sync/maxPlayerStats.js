const keys = ['dreamteam_count', 'ep_next', 'ep_this', 'event_points', 'form', 'now_cost', 'points_per_game', 'selected_by_percent', 'total_points', 'transfers_in', 'transfers_in_event', 'transfers_out', 'transfers_out_event', 'minutes', 'goals_scored', 'assists', 'clean_sheets', 'goals_conceded', 'own_goals', 'penalties_saved', 'penalties_missed', 'yellow_cards', 'red_cards', 'saves', 'bonus', 'bps', 'influence', 'creativity', 'threat', 'ict_index', 'points_per_million', 'points_per_mins_played', 'avg_points_home', 'avg_points_away', 'avg_points_fdr_1', 'avg_points_fdr_2', 'avg_points_fdr_3', 'avg_points_fdr_4', 'avg_points_fdr_5']

export const getMaxStats = (allPlayers) => {
  const maxStats = {}
  keys.forEach(key => {
    maxStats[key] = Math.max(...allPlayers.map(p => {
      if (p[key] === 'n/a') return 0
      else return Number(p[key])
    }))
  })
  return maxStats
}