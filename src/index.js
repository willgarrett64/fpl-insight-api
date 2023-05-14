import { API } from './api/index.js'
import config from './config.js'
import { Database } from './db/index.js'
import { Sync } from './sync/index.js'
import { Log, LogLevelFromString, StdioAdaptor } from '@edge/log'

// Initialize logging
const adaptors = [new StdioAdaptor()]
const log = new Log(adaptors, LogLevelFromString(config.logging.level))

const main = async () => {
  const version = process.env.npm_package_version
  log.info(`Initialising FPL Insight API v${version}`)

  const db = new Database(config, log.extend('database'))
  await db.init()

  const sync = new Sync(config, db, log.extend('sync'))
  sync.init()

  const api = new API(config, db, log.extend('api'))
  await api.init()
}

process
  .on('unhandledRejection', reason => log.error('Unhandled Rejection', { reason }))
  .on('uncaughtException', err => log.error('Uncaught Exception:', err))
  .on('exit', code => log.info(`Exiting with code ${code}`))

main()
  .catch((error) => {
    log.error('Error', error)
    process.exit(1)
  })
