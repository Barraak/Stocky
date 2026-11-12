
const express = require('express')
const router = express.Router()

const {
  createMovement,
  getMovements
} = require('../controllers/stockMovementController')

const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

// All routes require authentication
router.use(protect)

// Admin + Employee
router.get('/', authorize('admin', 'employee'), getMovements)
router.post('/', authorize('admin', 'employee'), createMovement)

module.exports = router
