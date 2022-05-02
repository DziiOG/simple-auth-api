/* eslint-disable space-before-function-paren */
'use strict'

const log4js = require('log4js')
const EventEmitter = require('eventemitter3')

// Primary dependencies
const mongoose = require('mongoose')
const logger = require('../configs/logger').factory(log4js)
const path = require('path')
const lodash = require('lodash')
const fetch = require('node-fetch')
const paginate = require('jw-paginate')

// Secondary dependencies
const response = require('../libs/response').factory()

const miscHelper = require('../helpers/misc').factory(path, lodash, paginate, fetch)

/**
 * @author Whitson Dzimah <workwithwhitson@gmail.com>
 * @summary This class handles the http requests.
 * @description This is a base controller class which provides basic API endpoints methods
 * for handling http requests.This class must be extended by other controller sub class.
 * @extends EventEmitter adds event listen and emitting methods to the the controller
 */
class BaseController extends EventEmitter {
  /**
   * @param {object} actions The repository instance which will handle the operations to be
   * performed in this controller
   * @param {object} mongoose mongo database module
   * @param {object} helper - helper object
   * @param {object} logger - Logger object
   * @param {object} response - Response handler object
   */
  constructor(actions) {
    super()
    this.name = 'Base'
    this.listening = false // toggle event listener agent
    this.actions = actions
    this.logger = logger
    this.response = response
    this.helper = miscHelper
    this.mongoose = mongoose
    this.get = this.get.bind(this)
    this.log = this.log.bind(this)
    this.objectId = this.objectId.bind(this)
    this.insert = this.insert.bind(this)
    this.getOne = this.getOne.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.getById = this.getById.bind(this)
  }

  /**
   * @param { string } method Unknown method called
   */
  __call(method) {
    this.log(new Error(`'${method}()' is missing!`))
  }

  /**
   * @param { object } error Error object
   * @return {Function}
   */
  log(error) {
    return this.logger.getLogger().error(error)
  }
  /**
   * @param { string } id string id
   * @return {object} casted mongoose id object
   */
  objectId(id) {
    new this.mongoose.Types.ObjectId(id)
  }

  /**
   * @summary Handle http request to create a new record
   *
   * @param { { body: {} } } req  The express request object
   * @param { object }       res  The express response object
   * @fires BaseController#insert This method
   * fires an event when the controller is listening for
   * any event, to perform extract action(s) that is needed
   * after creating a new record
   * @return { Promise<Function> }
   */
  async insert(req, res) {
    try {
      const doc = await this.actions.insert(req.body)
      this.response.successWithData(res, doc, `${this.name} created successfully!`, 201)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Handle http request to fetch records
   *
   * @param { { query: {} } } req The express request object
   * @param { object }        res The express response object
   * @return {Promise<Function>}
   */
  async get(req, res) {
    try {
      const doc = await this.actions.get(req.query)
      this.response.successWithData(res, doc)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Handle http request to fetch a record by it identifier
   *
   * @param { { params: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   */
  async getById(req, res) {
    try {
      const doc = await this.actions.getById(req.params.id)
      this.response.successWithData(res, doc)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Handle http request to fetch one record which matches the query params
   *
   * @param { { query: {} } } req The express request object
   * @param { object }        res The express response object
   * @return {Promise<Function>}
   */
  async getOne(req, res) {
    try {
      const doc = await this.actions.getOne(req.query)
      this.response.successWithData(res, doc)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Handle http request to update a record
   *
   * @param { { params: { id: string }, body: {} } } req The express request object
   * @param { object }                                res The express response object
   * @fires BaseController#update This method
   * fires an event when the controller is listening for
   * any event, to perform extract action(s) that is needed
   * after a record has been updated
   * @return {Promise<Function>}
   */
  async update(req, res) {
    try {
      const doc = await this.actions.update(req.params.id, req.body)
      this.response.successWithData(res, doc, `${this.name} updated successfully!`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Handle http request to delete a record
   * @param { { params: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   * @emits event:delete
   * @return {Promise<Function>}
   */
  async delete(req, res) {
    try {
      const doc = await this.actions.delete(req.params.id)
      this.response.successWithData(res, doc, `${this.name} deleted successfully!`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }
}

module.exports = BaseController
