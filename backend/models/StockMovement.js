
const mongoose = require('mongoose')

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },

    // Snapshot of the product, so the history stays readable
    // even if the product is renamed or deleted later
    productName: {
      type: String,
      required: true
    },

    productReference: {
      type: String,
      default: ''
    },

    type: {
      type: String,
      enum: ['entry', 'exit'],
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    quantityBefore: {
      type: Number,
      required: true,
      min: 0
    },

    quantityAfter: {
      type: Number,
      required: true,
      min: 0
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ''
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    userName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

stockMovementSchema.index({ createdAt: -1 })

module.exports = mongoose.model('StockMovement', stockMovementSchema)
