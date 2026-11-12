const Product = require('../models/Product')
const StockMovement = require('../models/StockMovement')
const { createActivity } = require('./activityController')

// Fields a client may send. The quantity is NOT in the update list:
// after creation, it only changes through stock movements.
const UPDATE_FIELDS = ['name', 'reference', 'category', 'price', 'minimum']
const CREATE_FIELDS = [...UPDATE_FIELDS, 'quantity']

// Keep only the allowed fields that were actually sent
function pickFields(source, fields) {
  const result = {}

  for (const field of fields) {
    if (source[field] !== undefined) {
      result[field] = source[field]
    }
  }

  return result
}

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(
      pickFields(req.body, CREATE_FIELDS)
    )

    // Record the starting quantity as the first stock movement
    if (product.quantity > 0) {
      try {
        await StockMovement.create({
          product: product._id,
          productName: product.name,
          productReference: product.reference,
          type: 'entry',
          quantity: product.quantity,
          quantityBefore: 0,
          quantityAfter: product.quantity,
          reason: 'Stock initial',
          user: req.user._id,
          userName: req.user.name
        })
      } catch (error) {
        console.error('Initial stock movement failed:', error.message)
      }
    }

    await createActivity(product.name, 'Ajout de produit', req.user?.name)

    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
// Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      pickFields(req.body, UPDATE_FIELDS),
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await createActivity(product.name, 'Modification de produit', req.user?.name)

    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await createActivity(product.name, 'Suppression de produit', req.user?.name)

    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
}