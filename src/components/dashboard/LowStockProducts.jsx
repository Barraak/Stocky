import './LowStockProducts.css'

// Receives the products from the Dashboard (no extra API call)
function LowStockProducts({ products = [] }) {
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

        {lowStockProducts.length === 0 && (
          <p>Aucun produit en stock faible.</p>
        )}

        {lowStockProducts.map((product) => (
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