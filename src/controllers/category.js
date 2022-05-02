/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Whitson Dzimah
 * @summary Controller to handle http request for  related functions
 * @name CategoryController
 * @extends BaseController
 */
module.exports.name = 'CategoryController'
module.exports.dependencies = ['CategoryActions']
module.exports.factory = class extends BaseController {
  /**
   * @param {object} CategoryRepository The repository which will handle the operations to be
   * performed in this controller

   */
  constructor(CategoryActions) {
    super(CategoryActions)
    this.name = 'Category'
  }
}
