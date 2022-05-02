/**
 * Task Validations. Defining task validations schema using celebrate
 * @author Whitson Dzimah
 */
module.exports.name = 'TaskValidations'
module.exports.dependencies = ['celebrate', 'miscHelper']
module.exports.factory = (_celebrate, helper) => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const { COMPLETED, IN_PROGRESS, PENDING } = helper.Status

  const post = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      user: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      dueDate: Joi.string().required(),
      status: Joi.string().valid(COMPLETED, PENDING, IN_PROGRESS),
      priority: Joi.string().valid(1, 2, 3, 4, 5),
      frequency: Joi.string().valid('never', 'daily', 'weekly', 'monthly', 'customize')
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      user: Joi.string(),
      description: Joi.string(),
      category: Joi.string(),
      dueDate: Joi.string(),
      status: Joi.string().valid(COMPLETED, PENDING, IN_PROGRESS),
      priority: Joi.string().valid(1, 2, 3, 4, 5),
      frequency: Joi.string().valid('never', 'daily', 'weekly', 'monthly', 'customize')
    })
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      name: Joi.string(),
      description: Joi.string(),
      user: Joi.string(),
      category: Joi.string(),
      dueDate: Joi.string(),
      status: Joi.string().valid(COMPLETED, PENDING, IN_PROGRESS),
      priority: Joi.string().valid(1, 2, 3, 4, 5),
      frequency: Joi.string().valid('never', 'daily', 'weekly', 'monthly', 'customize')
    })
  })
  return {
    post,
    patch,
    querySearch
  }
}
