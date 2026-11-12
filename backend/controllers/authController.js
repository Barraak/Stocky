
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Create employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Tous les champs sont obligatoires'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Cet email est déjà utilisé'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'employee'
    })

    res.status(201).json({
      message: 'Employé créé avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe obligatoires'
      })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Configuration JWT manquante'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await User.findOne({
      email: normalizedEmail
    })

    if (!user) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  createEmployee,
  login
}
