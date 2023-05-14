import superagent from 'superagent'

export class Sync {
  constructor(config, db, log) {
    this.config = config
    this.db = db
    this.log = log
  }

  async init() {
    await this.getGeneralData()

    this.positions()
    this.teams()
  }

  formatKey(data) {
    return { _key: data.id.toString(), ...data }
  }

  async getGeneralData() {
    const resposne = await superagent.get('https://fantasy.premierleague.com/api/bootstrap-static/')
    this.generalData = resposne.body
  }

  async positions() {
    await this.db.positions.insertMany(this.generalData.element_types.map(this.formatKey))
    this.log.info('Positions synced')
  }

  async teams() {
    await this.db.teams.insertMany(this.generalData.teams.map(this.formatKey))
    this.log.info('Teams synced')
  }
}