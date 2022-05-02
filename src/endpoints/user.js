/**
 * @summary
 * This modules represents the endpoints construct for user related API request.
 * All middleware required for each endpoint methods are registered here
 * @author Whitson Dzimah
 */

module.exports.name = 'UserRoutes'
module.exports.dependencies = ['UserController', 'UserValidations']
module.exports.factory = (UserController, UserValidations) => {
  /**
   * @param { string } route definition
   * @param { Array<'post' || 'get'|| 'patch'|| 'put' || 'delete' >} methods allowed on a route
   * @param { bool } guard toggle for authentication
   * @param { { post: Array<Function>, get: Array<Function>, patch: Array<Function>, put: Array<Function>, delete: Array<Function> } } middleware request handlers
   */

  return [
    {
      route: 'signup',
      methods: ['post'],
      middleware: {
        post: [UserValidations.post, UserController.preInsert, UserController.insert]
      }
    },
    {
      route: 'login',
      methods: ['post'],
      middleware: {
        post: [UserValidations.login, UserController.login]
      }
    },
    {
      route: 'social-login',
      methods: ['post'],
      middleware: {
        post: [UserValidations.socialLogin, UserController.socialLogin]
      }
    },
    {
      route: 'cached-user/:token',
      methods: ['get'],
      middleware: {
        get: [UserValidations.paramsQuery, UserController.cachedUser]
      }
    },
    {
      route: 'users/profile',
      guard: true,
      methods: ['get'],
      middleware: {
        get: [UserController.cachedUser]
      }
    },
    {
      route: 'logout',
      guard: true,
      methods: ['post'],
      middleware: {
        post: [UserController.logout]
      }
    }
  ]
}
