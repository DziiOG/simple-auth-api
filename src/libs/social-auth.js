/**
 * GOOGLE LOGIN
 * @author Whitson Dzimah
 */
module.exports.name = 'SocialAuth'
module.exports.dependencies = ['query-string', 'envs', 'miscHelper']
module.exports.factory = (queryString, envs, helpers) => {
  // Get application configuration based on environment
  const { gClientId, gClientSecret, authService } = envs(process.env.NODE_ENV)

  const headers = { 'Content-Type': 'application/json' }

  const getGoogleUserEmail = async code => {
    try {
      const oauth2Url = 'https://oauth2.googleapis.com/token'
      const googleapisUrl = 'https://www.googleapis.com/oauth2/v2/userinfo'

      const body = JSON.stringify({
        client_id: gClientId,
        client_secret: gClientSecret,
        redirect_uri: `${authService}/auth/google`,
        grant_type: 'authorization_code',
        code
      })

      const userAuth = await helpers.ajax2(oauth2Url, headers, body, 'POST')
      if (userAuth.error) throw new Error('Unexpected error, try again')
      headers.Authorization = `Bearer ${userAuth.access_token}`
      const userInfo = await helpers.ajax2(googleapisUrl, headers)
      if (userInfo.error) {
        throw new Error('Unexpected error, try again')
      }
      return userInfo.email
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { getGoogleUserEmail }
}
