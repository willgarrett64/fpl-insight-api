import cors from 'cors'
import http from 'http'
import Express from 'express'

// const app = express()
// const port = process.env.PORT || 3001

// import { updateData } from './sync/updateData.js'
// import db from './db/db'

// const getDataTest = async (req, res) => {
//   const players = fplCache.get('players')
//   res.send(players)
// }

// app.get('/', (req, res) => {
//   getDataTest(req, res)
// })

// app.listen(port, async () => {
//   const data = await updateData(fplCache)
//   fplCache.set('allData', data)
//   console.log(`FPL Insight API listening on ${port}`)
// })

export class API {
  constructor(config, db, log) {
    this.config = config
    this.db = db
    this.log = log
    this.app = Express()
    this.server = http.createServer(this.app)
  }

  async init() {
    this.initMiddlware()
    this.initControllers()

    this.server.listen(this.config.server.port, () => {
      this.log.info(`FPL Insight API listening on port ${this.config.server.port}`)
    })
  }

  initMiddlware() {
    this.app.disable('x-powered-by')
    this.app.use(Express.json())
    this.app.use(cors({ origin: this.config.api.cors.origin || '*' }))
    this.app.use(this.logRequest.bind(this))
  }

  initControllers() {
    // const controllers = [
    //   new IndexController(this),
    //   new MetricsController(this),
    //   new IntegrationController(this)
    // ]

    // controllers.forEach((controller) => {
    //   this.log.info(`Initializing ${controller.constructor.name}`)
    //   controller.init()
    // })
  }

  //
  // Middleware
  //
  logRequest(req, res, next) {
    const { headers, httpVersion, method, socket, url } = req
    const { remoteAddress, remoteFamily } = socket

    this.log.debug(`${method} ${url}`, {
      httpVersion,
      method,
      url,
      remoteAddress,
      remoteFamily,
      userAgent: headers['user-agent']
    })

    next()
  }

  parseBearerToken(req, res, next) {
    const authHeader = req.headers.authorization

    try {
      if (authHeader) {
        const parts = authHeader.split(' ')
        const type = parts[0].toLowerCase()
        const token = parts[1]

        // Ensure the token isn't empty or undefined
        if (!token) return this.unauthorized(req, res)

        // Only support bearer tokens
        if (type !== 'bearer') return this.unauthorized(req, res)

        req.bearerToken = token
        return next()
      }
      return this.unauthorized(req, res)
    }
    catch (error) {
      this.log.error(error)
      return this.internalServerError(error, req, res, next)
    }

  }

  //
  // Error handlers
  //
  badRequest(req, res, msg) {
    res.status(400).json({
      error: 'bad request',
      path: req.path,
      ...msg
    })
  }

  unauthorized(req, res, msg) {
    res.status(401).json({
      error: 'unauthorized',
      path: req.path,
      ...msg
    })
  }

  forbidden(req, res, msg) {
    res.status(403).json({
      error: 'forbidden',
      path: req.path,
      ...msg
    })
  }

  notFound(req, res, msg) {
    res.status(404).json({
      error: 'not found',
      path: req.path,
      ...msg
    })
  }

  unprocessableEntity(req, res, msg) {
    res.status(422).json({
      error: 'unprocessable entity',
      path: req.path,
      ...msg
    })
  }

  tooManyRequests(req, res, msg) {
    res.status(429).json({
      error: 'too many requests',
      path: req.path,
      ...msg
    })
  }

  internalServerError(error, req, res, next) {
    res.status(500).json({
      error: 'internal server error',
      path: req.path
    })
  }

  notImplmented(req, res, msg) {
    res.status(501).json({
      error: 'not implemented',
      path: req.path,
      ...msg
    })
  }

  serviceUnavailable(req, res, msg) {
    res.status(503).json({
      error: 'service unavailable',
      path: req.path,
      ...msg
    })
  }
}
