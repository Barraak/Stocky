const Product = require('../models/Product')
const { createActivity } = require('./activityController')
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
    const product = await Product.create(req.body)

    await createActivity(product.name, 'Ajout de produit')

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
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await createActivity(product.name, 'Modification de produit')

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

    await createActivity(product.name, 'Suppression de produit')

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