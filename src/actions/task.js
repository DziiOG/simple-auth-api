/* eslint-disable space-before-function-paren */
'use strict'
const BaseActions = require('./base')

/**
 * @author Whitson Dzimah
 * @summary Controller to handle http request for Task repo related functions
 * @name TaskActions
 * @extends BaseActions
 */
module.exports.name = 'TaskActions'
module.exports.dependencies = ['TaskRepository']
module.exports.factory = class extends BaseActions {
  /**
   * @param {object} action The action which will handle the https operations

   */
  constructor(TaskRepository) {
    super(TaskRepository)
    this.name = 'Task'
  }
}
