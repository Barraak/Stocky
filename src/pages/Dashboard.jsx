import { useState, useEffect } from 'react'

import StatCard from '../components/dashboard/StatCard'
import RecentActivity from '../components/dashboard/RecentActivity'
import LowStockProducts from '../components/dashboard/LowStockProducts'

import apiFetch from '../services/api'

import './Dashboard.css'

function Dashboard() {
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

  // Calculate statistics
  const totalProducts = products.length

  const stockValue = products.reduce((total, product) => {
    return total + Number(product.price) * Number(product.quantity)
  }, 0)

  const lowStockProducts = products.filter((product) => {
    return (
      Number(product.quantity) > 0 &&
      Number(product.quantity) <= Number(product.minimum)
    )
  }).length

  return (
    <div className="dashboard-content">

      {loading && <p>Chargement du Dashboard...</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="stats-grid">

            <StatCard
              title="Total Produits"
              value={totalProducts.toLocaleString('fr-FR')}
              description="Produits enregistrés"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                  <path d="m3 8 9 5 9-5" />
                  <path d="M12 13v8" />
                  <path d="m3 8v9l9 5 9-5V8" />
                </svg>
              }
            />

            <StatCard
              title="Valeur du Stock"
              value={`${stockValue.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} DT`}
              description="Valeur totale du stock"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <rect x="3" y="5" width="18" height="15" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M16 15h2" />
                  <path d="M7 5V3h11" />
                </svg>
              }
            />

            <StatCard
              title="Commandes"
              value="Bientôt"
              description="Module en développement"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                  <path d="M2 3h2l3 12h12l3-9H5" />
                  <path d="M7 15l-1 3h14" />
                </svg>
              }
            />

            <StatCard
              title="Stock Faible"
              value={lowStockProducts.toLocaleString('fr-FR')}
              description="Produits à réapprovisionner"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="m12 3 10 18H2L12 3Z" />
                  <path d="M12 9v5" />
                  <path d="M12 17h.01" />
                </svg>
              }
            />

          </div>

          <div className="dashboard-bottom">
            <RecentActivity />
            <LowStockProducts products={products} />
          </div>
        </>
      )}

    </div>
  )
}

export default Dashboard