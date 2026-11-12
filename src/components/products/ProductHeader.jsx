
import './ProductHeader.css'

function ProductHeader({ onAddClick }) {
  return (
    <div className="product-header">
      <div className="product-header-info">
        <h2>Gestion des produits</h2>
        <p>Gérez et suivez tous vos produits.</p>
      </div>

      <button
        className="add-product-btn"
        onClick={onAddClick}
      >
        <span>+</span>
        Ajouter un produit
      </button>
    </div>
  )
}

export default ProductHeader
