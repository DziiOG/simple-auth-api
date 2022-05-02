/**
 * @summary
 * This modules represents the router modules which defines
 * all the routes (endpoints) in this application
 * @author Whitson Dzimah
 */

module.exports.name = 'CategoryRoutes'
module.exports.dependencies = ['CategoryController', 'CategoryValidations', 'MiscValidations']
module.exports.factory = (CategoryController, CategoryValidations, MiscValidations) => {
  return [
    {
      route: 'categories',
      methods: ['post', 'get'],
      guard: true,
      middleware: {
        post: [CategoryValidations.post, CategoryController.insert],
        get: [CategoryValidations.querySearch, CategoryController.get]
      }
    },

    {
      route: 'categories/:id',
      methods: ['patch', 'get', 'delete'],
      guard: true,
      middleware: {
        patch: [MiscValidations.id, CategoryValidations.patch, CategoryController.update],
        get: [MiscValidations.id, CategoryController.getById],
        delete: [MiscValidations.id, CategoryController.delete]
      }
    }
  ]
}
