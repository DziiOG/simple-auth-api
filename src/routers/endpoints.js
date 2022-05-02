/**
 * @summary
 * This modules represents the endpoints construct for admin related API request.
 * All middleware required for each endpoint methods are registered here
 * @author Whitson Dzimah
 */

module.exports.name = 'endpoints'
module.exports.dependencies = ['UserRoutes', 'CategoryRoutes', 'TaskRoutes']
module.exports.factory = (UserRoutes, CategoryRoutes, TaskRoutes) => {
  /**
   * @param { string } route definition
   * @param { Array<'post' || 'get'|| 'patch'|| 'put' || 'delete' >} methods allowed on a route
   * @param { bool } guard toggle for authentication
   * @param { { post: Array<Function>, get: Array<Function>, patch: Array<Function>, put: Array<Function>, delete: Array<Function> } } middleware request handlers
   */

  return [...UserRoutes, ...CategoryRoutes, ...TaskRoutes]
}
