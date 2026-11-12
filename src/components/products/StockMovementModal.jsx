
import { useState, useEffect } from 'react'

import './StockMovementModal.css'

const REASON_SUGGESTIONS = {
  entry: [
    'Achat fournisseur',
    'Retour client',
    "Correction d'inventaire"
  ],
  exit: [
    'Vente',
    'Casse / perte',
    'Retour fournisseur',
    "Correction d'inventaire"
  ]
}

function StockMovementModal({ product, type, onClose, onSave }) {
  const isEntry = type === 'entry'

  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const parsedQuantity = Number(quantity)
  const hasQuantity = quantity !== '' && parsedQuantity > 0

  const newStock = hasQuantity
    ? product.quantity + (isEntry ? parsedQuantity : -parsedQuantity)
    : product.quantity

  const insufficientStock = !isEntry && hasQuantity && newStock < 0

  const canSubmit =
    hasQuantity &&
    Number.isInteger(parsedQuantity) &&
    !insufficientStock &&
    !saving

  // Close with the Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!canSubmit) return

    setError('')
    setSaving(true)

    try {
      await onSave({
        type,
        quantity: parsedQuantity,
        reason: reason.trim()
      })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="movement-overlay">
      <div className="movement-modal">

        <div className="movement-header">
          <div className="movement-header-info">
            <div className={`movement-icon ${type}`}>
              {isEntry ? '📥' : '📤'}
            </div>

            <div>
              <h2>{isEntry ? 'Entrée de stock' : 'Sortie de stock'}</h2>
              <p>
                {product.name} · {product.reference}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="movement-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="movement-stock-info">
          <div>
            <span>Stock actuel</span>
            <strong>{product.quantity}</strong>
          </div>

          <div className="movement-arrow">→</div>

          <div>
            <span>Nouveau stock</span>
            <strong className={insufficientStock ? 'negative' : ''}>
              {newStock}
            </strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="movement-group">
            <label htmlFor="movement-quantity">Quantité</label>
            <input
              id="movement-quantity"
              type="number"
              min="1"
              step="1"
              max={isEntry ? undefined : product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 10"
              autoFocus
              required
            />

            {insufficientStock && (
              <small className="movement-hint error">
                Stock insuffisant : il reste {product.quantity} unité(s).
              </small>
            )}
          </div>

          <div className="movement-group">
            <label htmlFor="movement-reason">Motif (optionnel)</label>
            <input
              id="movement-reason"
              type="text"
              list="movement-reasons"
              maxLength={200}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Achat fournisseur"
            />

            <datalist id="movement-reasons">
              {REASON_SUGGESTIONS[type].map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>

          {error && (
            <p className="movement-error">{error}</p>
          )}

          <div className="movement-actions">
            <button
              type="button"
              className="movement-cancel"
              onClick={onClose}
            >
              Annuler
            </button>

            <button
              type="submit"
              className={`movement-submit ${type}`}
              disabled={!canSubmit}
            >
              {saving
                ? 'Enregistrement...'
                : isEntry
                  ? "Confirmer l'entrée"
                  : 'Confirmer la sortie'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default StockMovementModal
