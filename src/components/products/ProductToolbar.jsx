
import './ProductToolbar.css'

function ProductToolbar({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
  onResetFilters
}) {
  return (
    <div className="product-toolbar">

      <div className="product-search">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="product-filters">

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          <option value="Informatique">Informatique</option>
          <option value="Accessoires">Accessoires</option>
          <option value="Audio">Audio</option>
          <option value="Écrans">Écrans</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => onStockChange(e.target.value)}
        >
          <option value="">Tous les stocks</option>
          <option value="available">Disponible</option>
          <option value="low">Stock faible</option>
          <option value="out">Rupture de stock</option>
        </select>

        <button
          className="reset-filters-btn"
          onClick={onResetFilters}
        >
          Réinitialiser
        </button>

      </div>

    </div>
  )
}

export default ProductToolbar
