/* eslint-disable space-before-function-paren */
'use strict'
const BaseActions = require('./base')

/**
 * @author Whitson Dzimah
 * @summary Controller to handle http request for category repo related functions
 * @name CategoryController
 * @extends BaseActions
 */
module.exports.name = 'CategoryActions'
module.exports.dependencies = ['CategoryRepository']
module.exports.factory = class extends BaseActions {
  /**
   * @param {object} action The action which will handle the https operations
   */
  constructor(CategoryRepository) {
    super(CategoryRepository)
    this.name = 'Category'
  }
}
