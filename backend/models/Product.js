
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    minimum: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product
