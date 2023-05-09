import dotenv from 'dotenv'

dotenv.config()

export default {
  api: {
    cors: {
      origin: process.env.CORS_ORIGIN || '*'
    }
  },
  arangodb: {
    url: process.env.ARANGODB_URL || 'arangodb://127.0.0.1:8530',
    database: process.env.ARANGODB_DATABASE || 'fpl-insight',
    username: process.env.ARANGODB_USERNAME || 'root',
    password: process.env.ARANGODB_PASSWORD || 'root'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  server: {
    port: process.env.HTTP_PORT || 3000
  },
}