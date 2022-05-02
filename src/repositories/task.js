/* eslint-disable no-useless-constructor */
/* eslint-disable space-before-function-paren */
'use strict'
const BaseRepository = require('./base')

/**
 * @author Whitson Dzimah
 * @description This class extends the BaseRepository class.
 * This is a dependency for the TaskRepository class.
 */
module.exports.name = 'TaskRepository'
module.exports.dependencies = ['TaskModel']
module.exports.factory = class extends BaseRepository {
  /**
   * @param { object } TaskModel mongodb model which provides the db drive methods.
   */
  constructor(TaskModel) {
    super(TaskModel)
  }
}
