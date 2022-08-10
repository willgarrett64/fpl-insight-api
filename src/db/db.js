//connect to SQLite database
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database("./db/fpl-insight.db", function (err) {
  if (err) {
    return console.error(err)
  } else {
    console.log("Connected to the sqlite-db.")
  }
})

module.exports = db
