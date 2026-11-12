
const express = require('express')
const router = express.Router()

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

// All routes require authentication
router.use(protect)

// Admin + Employee
router.get('/', authorize('admin', 'employee'), getProducts)
router.post('/', authorize('admin', 'employee'), createProduct)
router.put('/:id', authorize('admin', 'employee'), updateProduct)

// Admin only
router.delete('/:id', authorize('admin'), deleteProduct)

module.exports = router
