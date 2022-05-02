/**
 * @summary
 * Handle the creation of a connection between redis server and the application server
 * @author Whitson Dzimah
 */

module.exports.name = 'redisCluster'
module.exports.dependencies = ['redis', 'logger', 'envs']
module.exports.factory = (redis, logger, getEnvs) => {
  // Get application configuration based on environment
  const appConfig = getEnvs(process.env.NODE_ENV.replace())

  /**
   * This function creates a connection to a redis cluster
   * or normal redis instance based on the environment
   */
  const getRedisClusterClient = async () => {
    try {
      let client = null

      client = redis.createClient()

      // Provide password for redis server
      client.on('error', err => {
        throw err
      })
      await client.connect()
      logger.debug(`Connected to redis on ${appConfig.redisHost}`)
      return client
    } catch (error) {
      logger.getLogger().error(error)
      return Promise.reject(error)
    }
  }

  return getRedisClusterClient
}
