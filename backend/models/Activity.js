
const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true
    },

    action: {
      type: String,
      required: true,
      enum: [
        'Ajout de produit',
        'Modification de produit',
        'Suppression de produit',
        'Entrée de stock',
        'Sortie de stock'
      ]
    },

    user: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: 'Terminé'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Activity', activitySchema)
