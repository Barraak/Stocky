
import { useState, useEffect } from 'react'

import apiFetch from '../services/api'

import './Movements.css'

const LIMIT = 200

function formatDate(date) {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function Movements() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // GET: Fetch movements (type and dates are filtered by the API)
  useEffect(() => {
    let ignore = false

    async function fetchMovements() {
      try {
        const params = new URLSearchParams({ limit: String(LIMIT) })

        if (typeFilter) {
          params.set('type', typeFilter)
        }

        if (fromDate) {
          params.set(
            'from',
            new Date(`${fromDate}T00:00:00`).toISOString()
          )
        }

        if (toDate) {
          params.set(
            'to',
            new Date(`${toDate}T23:59:59.999`).toISOString()
          )
        }

        const response = await apiFetch(
          `/stock-movements?${params.toString()}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erreur de chargement')
        }

        if (!ignore) {
          setMovements(data)
          setError('')
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchMovements()

    // Ignore the response if the filters changed in the meantime
    return () => {
      ignore = true
    }
  }, [typeFilter, fromDate, toDate])

  // Search by product, reference, reason or user
  const filteredMovements = movements.filter((movement) => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) return true

    return (
      movement.productName.toLowerCase().includes(term) ||
      movement.productReference.toLowerCase().includes(term) ||
      movement.reason.toLowerCase().includes(term) ||
      movement.userName.toLowerCase().includes(term)
    )
  })

  const totalEntries = filteredMovements
    .filter((movement) => movement.type === 'entry')
    .reduce((total, movement) => total + movement.quantity, 0)

  const totalExits = filteredMovements
    .filter((movement) => movement.type === 'exit')
    .reduce((total, movement) => total + movement.quantity, 0)

  // Reset filters
  function handleResetFilters() {
    setSearchTerm('')
    setTypeFilter('')
    setFromDate('')
    setToDate('')
  }

  return (
    <div className="movements-content">

      <div className="movements-header">
        <h2>Mouvements de stock</h2>
        <p>Historique des entrées et des sorties de stock.</p>
      </div>

      <div className="movements-toolbar">

        <div className="movements-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Rechercher (produit, motif, utilisateur)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="movements-filters">

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="entry">Entrées</option>
            <option value="exit">Sorties</option>
          </select>

          <label className="movements-date">
            <span>Du</span>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>

          <label className="movements-date">
            <span>Au</span>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>

          <button
            type="button"
            className="movements-reset"
            onClick={handleResetFilters}
          >
            Réinitialiser
          </button>

        </div>

      </div>

      {loading && <p>Chargement des mouvements...</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="movements-summary">
            <div>
              <span>Mouvements</span>
              <strong>{filteredMovements.length}</strong>
            </div>

            <div>
              <span>Total entrées</span>
              <strong className="entry">+{totalEntries}</strong>
            </div>

            <div>
              <span>Total sorties</span>
              <strong className="exit">-{totalExits}</strong>
            </div>
          </div>

          <div className="movements-table-container">
            <table className="movements-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Produit</th>
                  <th>Type</th>
                  <th>Quantité</th>
                  <th>Stock</th>
                  <th>Motif</th>
                  <th>Utilisateur</th>
                </tr>
              </thead>

              <tbody>
                {filteredMovements.length > 0 ? (
                  filteredMovements.map((movement) => (
                    <tr key={movement._id}>
                      <td>{formatDate(movement.createdAt)}</td>

                      <td>
                        <div className="movements-product">
                          <strong>{movement.productName}</strong>
                          <small>{movement.productReference}</small>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`movement-badge ${movement.type}`}
                        >
                          {movement.type === 'entry' ? 'Entrée' : 'Sortie'}
                        </span>
                      </td>

                      <td
                        className={`movements-quantity ${movement.type}`}
                      >
                        {movement.type === 'entry' ? '+' : '-'}
                        {movement.quantity}
                      </td>

                      <td>
                        {movement.quantityBefore} → {movement.quantityAfter}
                      </td>

                      <td>{movement.reason || '—'}</td>
                      <td>{movement.userName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="movements-empty">
                      <div>
                        <span>🔄</span>
                        <h3>Aucun mouvement trouvé</h3>
                        <p>
                          Utilisez les boutons 📥 et 📤 dans la page
                          Produits pour enregistrer un mouvement.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {movements.length >= LIMIT && (
            <p className="movements-note">
              Affichage des {LIMIT} mouvements les plus récents.
              Utilisez les filtres pour affiner.
            </p>
          )}
        </>
      )}

    </div>
  )
}

export default Movements
