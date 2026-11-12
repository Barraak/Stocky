
const Activity = require('../models/Activity')

// Get recent activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)

    res.status(200).json(activities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create an activity
const createActivity = async (product, action, user = '') => {
  return await Activity.create({
    product,
    action,
    user
  })
}

module.exports = {
  getActivities,
  createActivity
}
