const productRoutes = require('./routes/productRoutes')
const express = require('express')
const cors = require('cors')
const activityRoutes = require('./routes/activities')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

const connectDB = require('./config/db')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use('/api/products', productRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/auth', authRoutes)

// Test Route
app.get('/', (req, res) => {
  res.send('Stocky Backend is running!')
})

// Start Server
const PORT = process.env.PORT || 5000

async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
