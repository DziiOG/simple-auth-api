/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Whitson Dzimah
 * @summary Controller to handle http request for  related functions
 * @name TaskController
 * @extends BaseController
 */
module.exports.name = 'TaskController'
module.exports.dependencies = ['TaskActions']
module.exports.factory = class extends BaseController {
  /**
   * @param {object} TaskRepository The repository which will handle the operations to be
   * performed in this controller

   */
  constructor(TaskActions) {
    super(TaskActions)
    this.name = 'Task'
  }
}
