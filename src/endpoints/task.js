/**
 * @summary
 * This modules represents the router modules which defines
 * all the routes (endpoints) in this application
 * @author Whitson Dzimah
 */

module.exports.name = 'TaskRoutes'
module.exports.dependencies = ['TaskController', 'TaskValidations', 'MiscValidations']
module.exports.factory = (TaskController, TaskValidations, MiscValidations) => {
  return [
    {
      route: 'tasks',
      methods: ['post', 'get'],
      guard: true,
      middleware: {
        post: [TaskValidations.post, TaskController.insert],
        get: [TaskValidations.querySearch, TaskController.get]
      }
    },

    {
      route: 'tasks/:id',
      methods: ['patch', 'get', 'delete'],
      guard: true,
      middleware: {
        patch: [MiscValidations.id, TaskValidations.patch, TaskController.update],
        get: [MiscValidations.id, TaskController.getById],
        delete: [MiscValidations.id, TaskController.delete]
      }
    }
  ]
}
