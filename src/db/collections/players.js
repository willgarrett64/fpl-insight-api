import { Collection } from '../collection.js'

export class PlayersCollection extends Collection {
  constructor(db, log) {
    super(db, log, 'players')
  }
}