
require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const connectDB = require('./config/db')
const User = require('./models/User')

async function createAdmin() {
  try {
    await connectDB()

    const existingAdmin = await User.findOne({
      role: 'admin'
    })

    if (existingAdmin) {
      console.log('Un compte Admin existe déjà.')
      return
    }

    const name = process.env.ADMIN_NAME
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!name || !email || !password) {
      throw new Error('Informations Admin manquantes dans .env')
    }

    if (password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères.')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'admin'
    })

    console.log('Premier compte Admin créé avec succès.')

  } catch (error) {
    console.error('Erreur:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

createAdmin()
