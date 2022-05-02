/**
 * User Validations. Defining order validations schema using celebrate
 * @author Whitson Dzimah
 */
module.exports.name = 'UserValidations'
module.exports.dependencies = ['celebrate', 'miscHelper']
module.exports.factory = (_celebrate, helpers) => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const { ACTIVE, INACTIVE } = helpers.Status
  const post = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      lastName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .required()
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      lastName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      avatar: Joi.string()
        .trim()
        .regex(/^[\w,\s-]+\.[jpg, png, jpeg]{3}$/),
      status: Joi.string().valid(ACTIVE, INACTIVE)
    })
  })

  const login = celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().required()
    })
  })

  const socialLogin = celebrate({
    body: Joi.object().keys({
      code: Joi.string().required(),
      type: Joi.string().required().valid('google', 'facebook', 'linkedin')
    })
  })

  const paramsQuery = celebrate({
    params: Joi.object()
      .keys({
        token: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2 })
      })
      .xor('token', 'email')
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      roles: Joi.string(),
      email: Joi.string(),
      users: Joi.string(),
      name: Joi.string(),
      firstName: Joi.string(),
      phoneNumber: Joi.string(),
      lastName: Joi.string(),
      range: Joi.object().keys({
        key: Joi.string()
      }),
      rangeLowerBound: Joi.number(),
      rangeUpperBound: Joi.number(),
      status: Joi.string().valid(ACTIVE, INACTIVE),
      date: Joi.object().keys({
        key: Joi.string()
      }),
      constant: {
        status: Joi.string().valid(ACTIVE, INACTIVE),
        isLandOwner: Joi.boolean(),
        roles: Joi.array().items(Joi.string()),
        createdAt: Joi.number(),
        gender: Joi.string()
      },
      beginDateSearch: Joi.date(),
      endDateSearch: Joi.date(),
      // add params to be used for search
      searchTerm: Joi.string(),
      pageNo: Joi.number(),
      size: Joi.number(),
      keyCombinations: Joi.object()
    })
  })

  const passwordResetRequest = celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required()
    })
  })

  const verifyToken = celebrate({
    query: Joi.object().keys({
      token: Joi.string().required()
    })
  })

  const resetPassword = celebrate({
    body: Joi.object().keys({
      id: Joi.string().required(),
      password: Joi.string().min(8).required()
    })
  })

  const changePassword = celebrate({
    body: Joi.object().keys({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().min(8).required()
    })
  })

  const changeEmailRequest = celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(8).required()
    })
  })

  return {
    post,
    patch,
    login,
    socialLogin,
    paramsQuery,
    querySearch,
    passwordResetRequest,
    verifyToken,
    resetPassword,
    changePassword,
    changeEmailRequest
  }
}
