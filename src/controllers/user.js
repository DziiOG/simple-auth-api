/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Whitson Dzimah
 * @summary Controller to handle http request for order model related functions
 * @name UserController
 * @extends BaseController
 */
module.exports.name = 'UserController'
module.exports.dependencies = ['UserActions']
module.exports.factory = class extends BaseController {
  /**
   * @param {object} UserActions The actions which will handle the operations to be
   * performed in this controller

   */
  constructor(UserActions) {
    super(UserActions)
    this.name = 'User'
    this.logout = this.logout.bind(this)
    this.preInsert = this.preInsert.bind(this)
    this.login = this.login.bind(this)
    this.socialLogin = this.socialLogin.bind(this)
    this.cachedUser = this.cachedUser.bind(this)
  }

  async cachedUser(req, res) {
    try {
      this.response.successWithData(res, req.user)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Authenticates a user using social logins
   * @param {Object} req request object
   * @param {Object} res response object
   */
  async socialLogin(req, res) {
    try {
      const data = await this.actions.socialLogin(req.body.type, req.body.code)
      this.response.successWithData(res, data)
    } catch (error) {
      this.log(error)
      this.response.error(res, error.message || error)
    }
  }
  /**
   * @summary Authenticates a user
   * @param {Object} req request object
   * @param {Object} res response object
   */
  async login(req, res) {
    try {
      const data = await this.actions.login(req.body.email, req.body.password)
      this.response.successWithData(res, data)
    } catch (error) {
      this.log(error)
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary
   * Perform primary checks before creating user
   * ALso may modify user data along the middleware pipeline
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next function
   */
  async preInsert(req, res, next) {
    try {
      // throw error if email already exist
      const result = await this.actions.getOne({ email: req.body.email })
      if (result) throw new Error('A user with this email already exist')

      // set user status as ACTIVE for now
      req.body.status = this.helper.Status.ACTIVE
      next()
    } catch (error) {
      this.log(error)
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @description Deletes cached user token from redis and logs the user out
   * @param {Object} req request object
   * @param {Object} res response object
   */
  async logout(req, res) {
    try {
      await this.actions.logout(req.token)
      this.response.success(res, 'User logged out successfully')
    } catch (error) {
      this.log(error)
      this.response.error(res, error.message || error)
    }
  }
}
