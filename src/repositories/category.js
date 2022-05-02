/* eslint-disable no-useless-constructor */
/* eslint-disable space-before-function-paren */
'use strict'
const BaseRepository = require('./base')

/**
 * @author Whitson Dzimah
 * @description This class extends the BaseRepository class.
 * This is a dependency for the CategoryRepository class.
 */
module.exports.name = 'CategoryRepository'
module.exports.dependencies = ['CategoryModel']
module.exports.factory = class extends BaseRepository {
  /**
   * @param { object } CategoryModel mongodb model which provides the db drive methods.
   */
  constructor(CategoryModel) {
    super(CategoryModel)
  }
}
