/**
 * @summary
 * This is the configuration file for the application environment variables
 * @author Whitson Dzimah
 */
module.exports.name = 'envs'
module.exports.dependencies = false
module.exports.factory = () => {
  'use strict'
  /**
   * @param {string} env, a string representing the environment of application
   * @returns an object having configuration settings for the application
   */
  const getEnvs = env => {
    return {
      dbUrl: process.env[`${env}_DB_CONNECTION`],
      dbName: process.env[`${env}_COLLECTION_NAME`],
      redisHost: process.env[`${env}_REDIS_HOST`],
      redisPort: process.env[`${env}_REDIS_PORT`],
      redisPass: process.env.REDIS_PASS,
      secret: process.env.SECRET,
      expiresIn: process.env.EXPIRES_IN,
      gClientId: process.env.GOOGLE_CLIENT_ID,
      gClientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }

  return getEnvs
}
