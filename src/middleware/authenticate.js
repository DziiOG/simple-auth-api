/**
 * Functional Module for user authentication and redis connections
 * @author Whitson Dzimah
 */
module.exports.name = 'authenticate'
module.exports.dependencies = ['jsonwebtoken', 'redisCluster', 'envs', 'response', 'logger']
module.exports.factory = (jwt, getRedisClusterClient, getEnvs, response, logger) => {
  // Get application configuration based on environment
  const envs = getEnvs(process.env.NODE_ENV)

  /**
   * Removes a user from redis cache
   * @param {String} authToken
   */
  const removeCachedUser = async authToken => {
    try {
      const Client = await getRedisClusterClient()
      return await Client.del(authToken)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Verifies a jwt token based
   * @param {string} token, the owner of this authentication token
   */
  const verifyToken = async token => {
    try {
      return await jwt.verify(token, envs.secret)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decoded = await jwt.verify(token, envs.secret, { ignoreExpiration: true })
        // Remove token from cache
        if (decoded._id) {
          await removeCachedUser(token)
        }
      }
      return 0 // invalid token
    }
  }

  /**
   * Reads authentication token from header and checks
   * if any user has been authenticated with such token
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  const auth = async (req, res, next) => {
    try {
      const Client = await getRedisClusterClient()
      const authorization = req.headers.authorization
      if (authorization) {
        const authArray = authorization.split(' ')
        if (authArray[0] === 'Bearer') {
          const isVerified = await verifyToken(authArray[1])
          if (isVerified) {
            const authArray = authorization.split(' ')
            const user = await Client.get(String(authArray[1]))
            if (!user) return response.unauthorized(res)
            req.user = JSON.parse(user)
            delete req.user.password
            delete req.user.__v
            req.token = authArray[1]
            return next()
          } else return response.unauthorized(res)
        } else if (authArray[0] === 'x-bot-auth') {
          const { botEmail, botPass } = envs
          const buff = new Buffer.from(authArray[1], 'base64')
          const data = buff.toString('ascii')
          const array = data.split(':')
          if (array[0] === botEmail && array[1] === botPass) {
            req.bot = { email: array[0], password: array[1], role: array[2] }
            return next()
          } else {
            return response.unauthorized(res)
          }
        } else {
          return response.unauthorized(res)
        }
      } else {
        return response.unauthorized(res)
      }
    } catch (error) {
      logger.getLogger().error(error)
      return response.serverError(res)
    }
  }

  /**
   * Removes a user from redis cache
   * @param {String} authToken
   */
  const setCachedUser = async (authToken, user) => {
    try {
      const Client = await getRedisClusterClient()
      return await Client.set(String(authToken), JSON.stringify(user))
    } catch (error) {
      return Promise.reject(error)
    }
  }
  /**
   * Generates an token based on user _id
   * @param {object} payload, the user id object of this token
   */
  const generateToken = (_id, time) => {
    return jwt
      .sign({ _id: _id }, envs.secret, {
        expiresIn: time || envs.expiresIn
      })
      .toString()
  }

  /**
   * Caches an unauthenticated user in redis
   * @param { Object } authUser, the user to be cached
   */
  const cacheUser = async (authToken, user) => {
    try {
      const Client = await getRedisClusterClient()
      return await Client.set(String(authToken), JSON.stringify(user))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { auth, removeCachedUser, generateToken, verifyToken, setCachedUser, cacheUser }
}
