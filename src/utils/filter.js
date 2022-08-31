// filter by id
export const filterById = (list, id) => list.find(item => item.id === id)

// filter players
export const filterPlayers = (req, allPlayers) => {
    let players = [...allPlayers]

    // filters
    const positions = req.query.pos && req.query.pos.split(',')
    const teams = req.query.teams && req.query.teams.split(',')
    const minPrice = req.query.minPrice || 0
    const maxPrice = req.query.maxPrice || 20
    const minTsb = req.query.minTsb || 0
    const maxTsb = req.query.maxTsb || 100

    if (positions) players = players.filter(player => positions.includes(player.element_type.toString()))
    if (teams) players = players.filter(player => teams.includes(player.team.toString()))
    players = players.filter(player => {
      const price = Number(player.now_cost)
      const tsb = Number(player.selected_by_percent)
      return price >= minPrice &&
        price <= maxPrice &&
        tsb >= minTsb &&
        tsb <= maxTsb
    })
    return players
}