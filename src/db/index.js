import { Collection } from './collection.js'
import { Database as ArangoDB } from 'arangojs'
// import { EventsCollection } from './collections/events.js'

const collectionNames = [
  'events',
  'fixtures',
  'players',
  'positions',
  'teams'
]

export class Database {
  constructor(config, log) {
    this.config = config
    this.log = log
  }

  async init() {
    try {
      this.db = new ArangoDB({
        url: this.config.arangodb.url,
        databaseName: this.config.arangodb.database,
        auth: {
          username: this.config.arangodb.username,
          password: this.config.arangodb.password
        }
      })
      await this.initCollections()
      this.log.info('ArangoDB database initialized')

    }
    catch (error) {
      this.log.error(error)
      return []
    }
  }

  async initCollections() {
    // this.events = new EventsCollection(this.db, this.log)
    // await this.events.init()

    await Promise.all(collectionNames.map(async collectionName => {
      this[collectionName] = new Collection(this.db, this.log, collectionName)
      await this[collectionName].init()
    }))

  }
}
