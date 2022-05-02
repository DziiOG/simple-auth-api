/* eslint-disable space-before-function-paren */
'use strict'
const BaseActions = require('./base')

/**
 * @author Whitson Dzimah <chinedu.okpala@completefarmer.com>
 * @summary Actions methods for user model related
 * @name UserActions
 * @extends BaseActions
 */
module.exports.name = 'UserActions'
module.exports.dependencies = ['UserRepository', 'SocialAuth']
module.exports.factory = class extends BaseActions {
  /**
   * @param {object} action The action which will handle the https operations

   */
  constructor(UserRepository, SocialAuth) {
    super(UserRepository)
    this.name = 'User'
    this.SocialAuth = SocialAuth
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
    this.socialLogin = this.socialLogin.bind(this)
  }

  /**
   * @summary login using google, might make room for other logins as well
   * @param type type of social login
   * @param code code
   */
  async socialLogin(type, code) {
    try {
      let email = null
      // determine which social type the user is login with
      const socialType = {
        google: await this.SocialAuth.getGoogleUserEmail(code)
      }
      email = socialType[type]

      // check to see if email exist
      const user = await this.repo.getOne({ email })
      // eslint-disable-next-line prefer-promise-reject-errors
      if (!user) return Promise.reject({ error: 1, email })

      // check to see if account is activated
      if (user.status === this.helper.Status.INACTIVE) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ error: 2, email })
      }
      // Generate authentication token for user
      const data = await user.generateAuthToken()
      // cache user in redis and return
      await this.authenticate.cacheUser(data.authToken, data.user)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary logs a user into the application by accepting user email and password and then caching a successful authenticated user into redis
   * @param email email of the user
   * @param password password of the user
   */
  async login(email, password) {
    try {
      // check to see if email exist
      const user = await this.repo.getOne({ email: email })
      if (!user) throw new Error('Incorrect email or password')

      // check to see if password match
      const isMatch = await user.comparePassword(password)
      if (!isMatch) throw new Error('Incorrect email or password')

      // check to see if account is activated
      if (user.status === this.helper.Status.INACTIVE) {
        throw new Error('Account inactive, please activate')
      }

      // Generate authentication token for user
      const data = await user.generateAuthToken()

      // cache user in redis and return
      await this.authenticate.cacheUser(data.authToken, data.user)

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary removes cached user token or token
   * @param token token of user to be removed
   */
  async logout(token) {
    try {
      return await this.authenticate.removeCachedUser(String(token))
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
