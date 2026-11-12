
import { useState } from 'react'
import './ProductForm.css'

function ProductForm({ onClose, onSave, product }) {
    const [formData, setFormData] = useState({
    name: product?.name || '',
    reference: product?.reference || '',
    category: product?.category || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    minimum: product?.minimum || ''
    })

  function handleChange(e) {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="product-form-overlay">
      <div className="product-form">

        <div className="product-form-header">
          <div>
            <h2>{product ? 'Modifier un produit' : 'Ajouter un produit'}</h2>

            <p>
            {product
                ? 'Modifiez les informations du produit.'
                : 'Remplissez les informations du produit.'}
            </p>
          </div>

          <button type="button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Nom du produit</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Clavier Logitech"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Référence</label>
              <input
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="PRD-005"
                required
              />
            </div>

            <div className="form-group">
              <label>Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Choisir</option>
                <option value="Informatique">Informatique</option>
                <option value="Accessoires">Accessoires</option>
                <option value="Audio">Audio</option>
                <option value="Écrans">Écrans</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prix (DT)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantité</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Seuil minimum de stock</label>
            <input
              type="number"
              name="minimum"
              value={formData.minimum}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="product-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>

            <button type="submit" className="save-btn">
              Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ProductForm
