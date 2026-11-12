
const mongoose = require('mongoose')

const Product = require('../models/Product')
const StockMovement = require('../models/StockMovement')
const { createActivity } = require('./activityController')

const MOVEMENT_TYPES = ['entry', 'exit']

// Create a stock movement (entry or exit)
const createMovement = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body
    const qty = Number(quantity)

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: 'Produit invalide'
      })
    }

    if (!MOVEMENT_TYPES.includes(type)) {
      return res.status(400).json({
        message: 'Type de mouvement invalide'
      })
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        message: 'La quantité doit être un entier supérieur à 0'
      })
    }

    const delta = type === 'entry' ? qty : -qty

    // Atomic update: for an exit, the product only matches
    // if there is enough stock, so the quantity can never go negative
    const filter = { _id: productId }

    if (type === 'exit') {
      filter.quantity = { $gte: qty }
    }

    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { quantity: delta } },
      { new: true }
    )

    if (!product) {
      const exists = await Product.exists({ _id: productId })

      if (!exists) {
        return res.status(404).json({
          message: 'Produit introuvable'
        })
      }

      return res.status(400).json({
        message: 'Stock insuffisant pour cette sortie'
      })
    }

    let movement

    try {
      movement = await StockMovement.create({
        product: product._id,
        productName: product.name,
        productReference: product.reference,
        type,
        quantity: qty,
        quantityBefore: product.quantity - delta,
        quantityAfter: product.quantity,
        reason: String(reason || '').trim().slice(0, 200),
        user: req.user._id,
        userName: req.user.name
      })
    } catch (error) {
      // Undo the quantity change if the movement could not be saved
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: -delta }
      })

      throw error
    }

    // The movement is saved: a failing activity log must not break the response
    try {
      await createActivity(
        product.name,
        type === 'entry' ? 'Entrée de stock' : 'Sortie de stock',
        req.user.name
      )
    } catch (error) {
      console.error('Activity log failed:', error.message)
    }

    res.status(201).json({ movement, product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get movements (latest first), with optional filters:
// ?type=entry|exit &product=<id> &from=<ISO date> &to=<ISO date> &limit=<n>
const getMovements = async (req, res) => {
  try {
    const { type, product, from, to } = req.query

    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200)

    const filter = {}

    if (type) {
      if (!MOVEMENT_TYPES.includes(type)) {
        return res.status(400).json({
          message: 'Type de mouvement invalide'
        })
      }

      filter.type = type
    }

    if (product) {
      if (!mongoose.isValidObjectId(product)) {
        return res.status(400).json({
          message: 'Produit invalide'
        })
      }

      filter.product = product
    }

    if (from || to) {
      filter.createdAt = {}

      if (from) {
        const fromDate = new Date(from)

        if (Number.isNaN(fromDate.getTime())) {
          return res.status(400).json({
            message: 'Date de début invalide'
          })
        }

        filter.createdAt.$gte = fromDate
      }

      if (to) {
        const toDate = new Date(to)

        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({
            message: 'Date de fin invalide'
          })
        }

        filter.createdAt.$lte = toDate
      }
    }

    const movements = await StockMovement.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)

    res.status(200).json(movements)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createMovement,
  getMovements
}
