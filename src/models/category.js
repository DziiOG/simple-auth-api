/**
 * Category Model. Defining Category schema using mongoose
 * @author Whitson Dzimah
 */

module.exports.name = 'CategoryModel'
module.exports.dependencies = ['mongoose']
module.exports.factory = mongoose => {
  'use strict'

  const Schema = mongoose.Schema
  const ObjectId = Schema.Types.ObjectId

  const schema = new Schema(
    {
      name: {
        type: String,
        required: [true, 'Name of Category is required']
      },
      color: {
        type: String,
        required: [true, 'Color is required']
      },
      user: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'User is required']
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
  return mongoose.model('Category', schema)
}
