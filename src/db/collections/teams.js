import { Collection } from '../collection.js'

export class TeamsCollection extends Collection {
  constructor(db, log) {
    super(db, log, 'teams')
  }
}