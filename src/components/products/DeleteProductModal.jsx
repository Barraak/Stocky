
import './DeleteProductModal.css'

function DeleteProductModal({ productName, onCancel, onConfirm }) {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-icon">
          🗑️
        </div>

        <h3>Supprimer le produit</h3>

        <p>
          Voulez-vous vraiment supprimer <strong>{productName}</strong> ?
        </p>

        <div className="delete-modal-actions">
          <button
            className="cancel-delete-btn"
            onClick={onCancel}
          >
            Annuler
          </button>

          <button
            className="confirm-delete-btn"
            onClick={onConfirm}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteProductModal
