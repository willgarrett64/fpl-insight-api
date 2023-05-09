import { Collection } from '../collection.js'

export class PositionsCollection extends Collection {
  constructor(db, log) {
    super(db, log, 'positions')
  }
}