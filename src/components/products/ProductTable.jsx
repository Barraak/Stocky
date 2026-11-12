
import './ProductTable.css'
function getProductStatus(quantity, minimum) {
  if (quantity === 0) {
    return 'Rupture'
  }

  if (quantity <= minimum) {
    return 'Stock faible'
  }

  return 'Disponible'
}
function ProductTable({ products, onDelete, onEdit }) {   
  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Référence</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => {
              const status = getProductStatus(
                product.quantity,
                product.minimum
              )

              return (
                <tr key={product.id}>
                <td className="product-name">{product.name}</td>
                <td>{product.reference}</td>
                <td>{product.category}</td>
                <td>{product.price} DT</td>
                <td>{product.quantity}</td>
                <td>
                  <span
                    className={`status-badge ${
                      status === 'Disponible'
                        ? 'status-available'
                        : status === 'Stock faible'
                          ? 'status-low'
                          : 'status-out'
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="product-actions">
                  <button
                    title="Modifier"
                    onClick={() => onEdit(product)}
                  >
                    ✏️
                  </button>

                  <button
                    title="Supprimer"
                    onClick={() => onDelete(product)}
                  >
                    🗑️
                  </button>
                </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="7" className="empty-state">
                <div>
                  <span>🔍</span>
                  <h3>Aucun produit trouvé</h3>
                  <p>
                    Aucun produit ne correspond à votre recherche.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  )
}

export default ProductTable
