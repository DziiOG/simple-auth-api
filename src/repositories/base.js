/* eslint-disable space-before-function-paren */
'use strict'
const log4js = require('log4js')
const logger = require('../configs/logger').factory(log4js)
const { t } = require('typy')
const path = require('path')
const lodash = require('lodash')
const paginate = require('jw-paginate')
const fetch = require('node-fetch')
const miscHelper = require('../helpers/misc').factory(path, lodash, paginate, fetch)

/**
 * @author Whitson Dzimah
 * @summary This class provides an interface to the model methods perform
 * CRUD related functionalities
 * @description This is a base repository class which provides basic
 * method that interface with the model methods for CRUD functionalities.
 * This class must be extended by other repository sub class.
 * This class assumes all data coming are sterilized and validated properly.
 */
class BaseRepository {
  /**
   * @param { object } model The model which operations will be
   * performed on and also provides interface to the mongoose methods.
   * @param {{ debug: Function }} logger - Logger object
   */
  constructor(model) {
    this.model = model
    this.logger = logger
    this.getById = this.getById.bind(this)
    this.getOne = this.getOne.bind(this)
    this.get = this.get.bind(this)
    this.insert = this.insert.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.aggregate = this.aggregate.bind(this)
    this.searchQuery = this.searchQuery.bind(this)
    this.helper = miscHelper
  }

  /**
   * @param { string } method Unknown method called
   */
  __call(method) {
    this.log(new Error(`'${method}()' is missing!`))
  }

  /**
   * @param { object } error Error object
   */
  log(error) {
    return this.logger.getLogger().error(error)
  }

  /**
   * @description Insert a new record to a collection (model)
   *
   * @param { object } payload  The data to be inserted
   * @return { Promise<object>}} The new record inserted
   */
  async insert(payload) {
    try {
      return await this.model.create(payload)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description Fetch a specific record from a collection (model)
   * using it's unique identifier
   * @param { string } id The unique identifier of the record been queried
   * @return { Promise<object> } The matching record
   */
  async getById(id) {
    try {
      return await this.model.findById(id)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description Fetch only one record from a collection (model) which matches the query object
   * @param { object } query The query object to filter the records
   * @return { Promise<object> } One matching record
   */
  async getOne(query) {
    try {
      return await this.model.findOne(query)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description Fetch some records in a collection (model)
   * which matches the query object(if any), or all records
   * @param {*} query The query object to filter the records - optional
   * @return { Promise<Array<object>> } All or some matching records in the collection
   */
  async get(...query) {
    try {
      if (query.length && query[0]['$sort']) {
        const sort = query[0]['$sort']
        delete query[0]['$sort']
        const limit = query[0]['$limit']
        if (limit) {
          delete query[0]['$limit']
          return await this.model
            .find(...query)
            .sort(sort)
            .limit(limit)
        }
        return await this.model.find(...query).sort(sort)
      }
      return await this.model.find(...query)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  /**
   * @description Update a record in a collection (model)
   * using it's unique identifier
   *
   * @param { string } id The unique identifier of the record been updated
   * @param { object } data The updated data to replace the specified record field(s)
   * @return { Promise<object> } The updated record
   */
  async update(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description Delete a specific record from a collection (model)
   * using it's unique identifier
   *
   * @param { string } id he unique identifier of the record been updated
   * @return { Promise<object> } The deleted record
   */
  async delete(id) {
    try {
      return await this.model.findByIdAndRemove(id)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description Delete only one record from a collection (model)
   * that fulfills the query params
   *
   * @param {*} query the query to filter which of the record will be deleted
   * @return { Promise<object> } The deleted record
   */
  async deleteOne(...query) {
    try {
      return await this.model.findOneAndRemove(...query)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description Preforms mongoose aggregate operation to a collection (model),
   * which fetches records with their referencing collection (model)
   *
   * @param { Array<object> } query The query object to filter the records - required
   * @return { Promise<Array<object>> } The matching records in the collection
   */
  async aggregate(query) {
    try {
      return await this.model.aggregate(query)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description performs a search on mongo data
   *
   * @param { Array<object> } query The query object to filter the records - required
   * @param { Array<object> } options The query object to options the records limits and skips
   * @return { Promise<Array<object>> } The matching records in the collection
   */
  async searchQuery(query = {}, constantQuery = {}, options) {
    try {
      const MINIMUM_TIME_STAMP = -8640000000000000
      const { $sort, noSorting, ...rest } = constantQuery
      const sort = $sort && !noSorting ? $sort : !noSorting ? { createdAt: -1 } : undefined
      const newQuery = { ...rest }
      delete query.constant
      const { size, pageNo } = options
      if (size === 0 || pageNo === 0) throw new Error('Invalid Option parameter value')
      // buildQuery Search
      const keys = Object.keys(query)
      if (keys.length) {
        // check if there are dates
        if (this.helper.contains(keys, ['beginDateSearch', 'endDateSearch'])) {
          const date = query.date && query.date.key
          if (!date) throw new Error('Must specify date key')

          // build Query using range
          newQuery[date] = {
            $gte: query.beginDateSearch
              ? new Date(query.beginDateSearch)
              : '' || new Date(MINIMUM_TIME_STAMP),
            $lte: query.endDateSearch ? new Date(query.endDateSearch) : '' || new Date()
          }
        }
        // delete the rest
        delete query.beginDateSearch
        delete query.endDateSearch
        delete query.date

        if (this.helper.contains(keys, ['rangeLowerBound', 'rangeUpperBound'])) {
          const range = query.range && query.range.key
          if (!range) throw new Error('Must specify range key')

          // build Query using range
          newQuery[range] = {
            $gte: query.rangeLowerBound ? query.rangeLowerBound : Number.NEGATIVE_INFINITY,
            $lte: query.rangeUpperBound ? query.rangeUpperBound : Number.POSITIVE_INFINITY
          }
        }

        // delete the rest
        delete query.rangeLowerBound
        delete query.rangeUpperBound
        delete query.range
      }

      // build the query
      let buildQuery = sort
        ? await this.model.find(newQuery).sort(sort)
        : await this.model.find(newQuery)

      // now search
      const process = key =>
        buildQuery.filter(doc => {
          const columnData = t(doc, key)
            .safeObject.replace(/[^A-Z0-9]/gi, '')
            .toLowerCase()
          return !!columnData.match(
            new RegExp(query[key].replace(/[^A-Z0-9]/gi, '').toLowerCase(), 'i')
          )
        })

      // check
      const buildSearchResults = () => {
        for (const key in query) {
          if (key) {
            buildQuery = process(key)
          }
        }
      }

      buildSearchResults()

      // paginate the data
      const pageData = this.helper.paginate(buildQuery.length, pageNo, size)

      // return data
      return { data: buildQuery.slice(pageData.startIndex, pageData.endIndex + 1), pageData }
    } catch (error) {
      return await Promise.reject(error)
    }
  }
}

module.exports = BaseRepository
