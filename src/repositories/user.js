/* eslint-disable no-useless-constructor */
/* eslint-disable space-before-function-paren */
'use strict'
const BaseRepository = require('./base')

/**
 * @author Whitson Dzimah
 * @description This class extends the BaseRepository class.
 * This is a dependency for the UserRepository class.
 */
module.exports.name = 'UserRepository'
module.exports.dependencies = ['UserModel']
module.exports.factory = class extends BaseRepository {
  /**
   * @param { object } UserModel mongodb model which provides the db drive methods.
   */
  constructor(UserModel) {
    super(UserModel)
  }
}
