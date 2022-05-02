/**
 * This is the starting point of the application where all other parts
 * are bootstrapped together
 */

// Initialize environment variables
require('dotenv').config()

// Setup hilary DI
const scope = require('hilary').scope('CFFmsApi')

scope.bootstrap(
  [
    scope.makeRegistrationTask(require('./bootstrap')),
    scope.makeRegistrationTask(require('./endpoints')),
    scope.makeRegistrationTask(require('./routers')),
    scope.makeRegistrationTask(require('./helpers')),
    scope.makeRegistrationTask(require('./libs')),
    scope.makeRegistrationTask(require('./configs')),
    scope.makeRegistrationTask(require('./middleware')),
    scope.makeRegistrationTask(require('./controllers')),
    scope.makeRegistrationTask(require('./actions')),
    scope.makeRegistrationTask(require('./repositories')),
    scope.makeRegistrationTask(require('./models')),
    scope.makeRegistrationTask(require('./validators'))
  ],
  function (err, scp) {
    if (err) {
      console.log(err)
      return
    }

    // Run application
    scp.resolve('bootstrap')
  }
)
