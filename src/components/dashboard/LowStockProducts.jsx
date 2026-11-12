
import { useState, useEffect } from 'react'

import apiFetch from '../../services/api'

import './LowStockProducts.css'

function LowStockProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch products from MongoDB
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await apiFetch('/products')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erreur de chargement')
        }

        setProducts(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter low stock products
  const lowStockProducts = products.filter((product) => {
    return (
      Number(product.quantity) > 0 &&
      Number(product.quantity) <= Number(product.minimum)
    )
  })

  return (
    <div className="low-stock">

      <div className="low-stock-header">
        <h3>Produits en stock faible</h3>
        <span>Voir tout</span>
      </div>

      <div className="low-stock-list">

        {loading && (
          <p>Chargement des produits...</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        {!loading && !error && lowStockProducts.length === 0 && (
          <p>Aucun produit en stock faible.</p>
        )}

        {!loading && !error && lowStockProducts.map((product) => (
          <div className="low-stock-item" key={product._id}>

            <div className="product-info">
              <h4>{product.name}</h4>
              <p>{product.category}</p>
            </div>

            <div className="product-quantity">
              <strong>{product.quantity}</strong>
              <span>
                Min: {product.minimum}
              </span>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default LowStockProducts
