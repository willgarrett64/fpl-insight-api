//connect to SQLite database
import sqlite from 'sqlite3'
sqlite.verbose()
const db = new sqlite.Database(
  './fpl-insight.db',
  function (err) {
    if (err) {
      return console.error(err)
    } else {
      console.log('Connected to the fpl insight db')
    }
  }
)

export default db
