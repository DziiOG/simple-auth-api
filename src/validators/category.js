/**
 * Category Validations. Defining category validations schema using celebrate
 * @author Whitson Dzimah
 */
module.exports.name = 'CategoryValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      color: Joi.string().required(),
      user: Joi.string().required()
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      color: Joi.string(),
      user: Joi.string()
    })
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      name: Joi.string(),
      color: Joi.string(),
      user: Joi.string()
    })
  })
  return {
    post,
    patch,
    querySearch
  }
}
