/**
 * Task Model. Defining Task schema using mongoose
 * @author Whitson Dzimah
 */

module.exports.name = 'TaskModel'
module.exports.dependencies = ['mongoose', 'mongoose-autopopulate', 'miscHelper']
module.exports.factory = (mongoose, autopopulate, helpers) => {
  'use strict'

  const Schema = mongoose.Schema
  const ObjectId = Schema.Types.ObjectId
  const { COMPLETED, IN_PROGRESS, PENDING } = helpers.Status

  const schema = new Schema(
    {
      name: {
        type: String,
        required: [true, 'Name of Task is required']
      },
      user: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'User is required']
      },
      description: {
        type: String,
        required: [true, 'Task description is required']
      },
      category: {
        type: ObjectId,
        ref: 'Category',
        autopopulate: true,
        required: [true, 'Category is required']
      },
      dueDate: {
        type: Date,
        required: [true, 'Due date is required']
      },
      status: {
        type: String,
        enum: [COMPLETED, PENDING, IN_PROGRESS],
        default: PENDING
      },
      priority: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 5
      },
      frequency: {
        type: String,
        enum: ['never', 'daily', 'weekly', 'monthly', 'customize'],
        default: 'once'
      }
    },
    {
      versionKey: false,
      timestamps: true,
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
    }
  )
  schema.plugin(autopopulate)
  return mongoose.model('Task', schema)
}
