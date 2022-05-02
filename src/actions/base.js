/* eslint-disable new-cap */
/* eslint-disable space-before-function-paren */
'use strict'

// Primary dependencies
const EventEmitter = require('eventemitter3')
const mongoose = require('mongoose')
const lodash = require('lodash')
const path = require('path')
const log4js = require('log4js')
const redis = require('redis')
const paginate = require('jw-paginate')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

// Secondary dependencies
const miscHelper = require('../helpers/misc').factory(path, lodash, paginate, fetch)
const logger = require('../configs/logger').factory(log4js)
const getEnvs = require('../configs/envs').factory()
const redisCluster = require('../libs/redis').factory(redis, logger, getEnvs)
const response = require('../libs/response').factory()

const authenticate = require('../middleware/authenticate').factory(
  jwt,
  redisCluster,
  getEnvs,
  response,
  logger
)

// // Instances

/**
 * @author Whitson Dzimah <whitson.dzimah@completefarmer.com>
 * @summary This class performs actions that are called by the controller classes, interacting with the repository classes.
 * @description This base action contains various basic actions methods that are performed across all controllers
 * @extends EventEmitter adds event listen and emitting methods to the the controller
 */
class BaseActions extends EventEmitter {
  /**
   * @param {object} repo The repository instance which will handle the operations to be
   * performed in this controller
   * @param {object} mongoose mongo database module
   * @param {object} helper - helper object
   * @param {object} logger - Logger object
   * @param {object} response - Response handler object
   */
  constructor(repo) {
    super()
    this.repo = repo
    this.name = 'Base'
    this.envs = getEnvs
    this.logger = logger
    this.listening = false // toggle event listener agent
    this.mongoose = mongoose
    this.helper = miscHelper
    this.authenticate = authenticate
    this.log = this.log.bind(this)
    this.get = this.get.bind(this)
    this.redisCluster = redisCluster
    this.insert = this.insert.bind(this)
    this.getOne = this.getOne.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.search = this.search.bind(this)
    this.getById = this.getById.bind(this)
    this.objectId = this.objectId.bind(this)
    this.prepareRedis = this.prepareRedis.bind(this)
    this.exposeDocument = this.exposeDocument.bind(this)
    this.cacheDataInRedis = this.cacheDataInRedis.bind(this)
    this.preSearchingInitialization = this.preSearchingInitialization.bind(this)
  }

  /**
   * @param { string } method Unknown method called
   */
  __call(method) {
    this.log(new Error(`'${method}()' is missing!`))
  }

  /**
   * @param { string } id string id
   * @returns {object} casted mongoose id object
   */
  objectId(id) {
    return this.mongoose.Types.ObjectId(id)
  }

  /**
   * @param { object } error Error object
   * @returns {Function}
   */
  log(error) {
    return this.logger.getLogger().error(error)
  }
  /**
   * @summary Handle http request to create a new record
   *
   * @fires BaseActions#insert This method
   * fires an event when the controller is listening for
   * any event, to perform extract action(s) that is needed
   * after creating a new record
   * @returns { Promise<Function> }
   */
  async insert(payload) {
    try {
      const doc = await this.repo.insert(payload)
      return doc
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary Handle http request to fetch records
   *
   * @returns {Promise<Function>}
   */
  async get(payload) {
    try {
      const doc = await this.repo.get(payload)
      return doc
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary Handle http request to fetch a record by it identifier
   *
   * @param { { params: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   */
  async getById(id) {
    try {
      const doc = await this.repo.getById(this.objectId(id))
      return doc
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary Handle http request to fetch one record which matches the query params
   *
   * @param { { query: {} } } req The express request object
   * @param { object }        res The express response object
   * @returns {Promise<Function>}
   */
  async getOne(payload) {
    try {
      const doc = await this.repo.getOne(payload)
      return doc
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary Handle http request to update a record
   *
   * @param { { params: { id: string }, body: {} } } req The express request object
   * @param { object }                                res The express response object
   * @fires BaseActions#update This method
   * fires an event when the controller is listening for
   * any event, to perform extract action(s) that is needed
   * after a record has been updated
   * @returns {Promise<Function>}
   */
  async update(id, payload) {
    try {
      const doc = await this.repo.update(this.objectId(id), payload)
      if (this.listening) {
        this.emit('update', payload, doc)
      }
      return doc
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary Handle http request to delete a record
   * @param { { params: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   * @emits event:delete
   * @returns {Promise<Function>}
   */
  async delete(id) {
    try {
      const doc = await this.repo.delete(this.objectId(id))
      return doc
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Initializes redis and gets cached data if there is one
   * @params {any} key
   *  @returns {any} cached data
   */
  async prepareRedis(key) {
    try {
      const Client = await this.redisCluster()
      const { promisify } = this.util
      const getAsync = promisify(Client.get).bind(Client)
      const responseData = await getAsync(key)
      const cachedData = responseData ? JSON.parse(responseData) : responseData
      return cachedData
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * caches data in redis given a key, duration, data
   * @params {any} data to be cached
   * @params {any} key to identify data in redis
   * @params {Number} duration to store data in redis
   *  @returns {void}
   */
  async cacheDataInRedis(data, key, duration = 300) {
    try {
      const Client = await this.redisCluster()
      Client.setex(key, duration, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @summary exposes mongoDoc to be modifiable
   * @param { object | array } doc Document
   * @returns { object | array }
   */
  exposeDocument(doc) {
    return JSON.parse(JSON.stringify(doc))
  }

  /**
   * prepare payload for searching
   * @params {Object} query object
   *  @returns {Object} Payload
   */
  preSearchingInitialization(query) {
    const size = query.size
    const pageNo = query.pageNo
    if (query.size) {
      delete query.size
    }
    if (query.pageNo) {
      delete query.pageNo
    }
    return { size: size, pageNo: pageNo, query }
  }

  /**
   * Action to perform search on a given collection
   * @params {Object} query object
   *  @returns {Object} Payload
   */
  async search(query) {
    try {
      const { size, pageNo, query: newQuery } = this.preSearchingInitialization(query)
      query = newQuery
      const res = await this.repo.searchQuery(query || {}, query.constant || {}, {
        size: size || 5,
        pageNo: pageNo || 1
      })
      return res
    } catch (error) {
      // this.log(error)
      return Promise.reject(error)
    }
  }
}

module.exports = BaseActions
