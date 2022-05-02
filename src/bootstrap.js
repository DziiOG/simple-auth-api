/**
 * Module to bootstrap the application and include necessary components
 */

module.exports.name = 'bootstrap'
module.exports.dependencies = [
  'express',
  'cors',
  'helmet',
  'morgan',
  'body-parser',
  'express-handlebars',
  'celebrate',
  'logger',
  'miscHelper',
  'hbsHelpers',
  'routers',
  'db'
]
module.exports.factory = (
  express,
  cors,
  helmet,
  morgan,
  bodyParser,
  hbs,
  celebrate,
  logger,
  helper,
  hbsHelpers,
  routers,
  db
) => {
  'use strict'

  // database configuration
  const { dbConfig } = db

  // error handler
  const { errors } = celebrate

  // application server
  const app = express()
  const port = process.env.PORT || 3000

  // register necessary middleware
  app.use(cors())
  app.options('*', cors())

  // setting up helmet in the express application to provide secure http headers
  app.use(helmet())

  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
  app.use(bodyParser.json({ limit: '100mb', extended: true }))
  app.use(express.urlencoded({ extended: true }))

  // creates morgan logs information in the console
  if (app.get('env') === 'DEV') {
    app.use(morgan('combined'))
  }

  // resolve root folder path
  const { appRoot } = helper

  // register views
  app.use(express.static(`${appRoot}/public`))
  const { create } = hbs
  const hbsConfig = create({
    defaultLayout: 'layouts',
    extname: '.hbs',
    layoutsDir: `${appRoot}/views/`,
    helpers: hbsHelpers
  })

  // Register `hbs.engine` with the Express app.
  app.engine('handlebars', hbsConfig.engine)
  app.set('view engine', 'handlebars')
  app.set('views', './src/views')

  // server error middleware
  app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
      response.serverError(res, 'Invalid data')
    } else {
      next()
    }
  })

  // register routes middleware
  app.use('/api/v1', routers)
  app.get('/', (req, res) => res.redirect('/api/v1/api-docs'))

  // register celebrate validation middleware
  app.use(errors())
  // connect to the database and if successful, start the server

  dbConfig(() => {
    app.listen(port, () => {
      logger.debug(`Express server listening on port ${port}`)
      logger.debug(`You should be able to connect to the api on http://localhost:${port}`)
    })
  })

  return app
}
