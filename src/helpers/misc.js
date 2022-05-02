/* eslint-disable space-before-function-paren */
/**
 *  Miscellaneous Helper functions available to ease work
 * @author Whitson Dzimah <workwithwhitson@gmail.com>
 */

module.exports.name = 'miscHelper'
module.exports.dependencies = ['path', 'lodash', 'jw-paginate', 'node-fetch']
module.exports.factory = (path, lodash, paginate, fetch) => {
  // resolve app root path
  const appRoot = path.resolve('src')

  // constants
  const Status = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    RESET: 'RESET',
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS'
  }

  const ajax = async (url, authorization, body, method = 'GET') =>
    await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: authorization,
        'Content-Type': 'application/json'
      },
      body
    }).then(res => res.json())

  const ajax2 = async (url, headers, body, method = 'GET') =>
    await fetch(url, { method, headers, body }).then(res => res.json())

  const updateAjax = async (url, authorization, body, method = 'PATCH') => {
    return await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: authorization,
        'Content-Type': 'application/json',
        _method: 'PATCH'
      },
      body
    }).then(res => res.json())
  }
  return {
    appRoot,
    lodash,
    Status,
    paginate,
    ajax,
    ajax2,
    updateAjax
  }
}
