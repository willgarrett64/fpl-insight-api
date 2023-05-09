import { Collection } from '../collection.js'

export class FixturesCollection extends Collection {
  constructor(db, log) {
    super(db, log, 'fixtures')
  }
}