
const express = require('express')
const router = express.Router()

const {
  login,
  createEmployee
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

// Public route
router.post('/login', login)

// Admin only
router.post(
  '/employees',
  protect,
  authorize('admin'),
  createEmployee
)

module.exports = router
