const express = require('express')
const router = express.Router()

const {
  getActivities
} = require('../controllers/activityController')

const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

// Admin + Employee
router.get(
  '/',
  protect,
  authorize('admin', 'employee'),
  getActivities
)

module.exports = router