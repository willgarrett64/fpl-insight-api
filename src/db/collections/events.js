import { Collection } from '../collection.js'

export class EventsCollection extends Collection {
  constructor(db, log) {
    super(db, log, 'events')
  }
}