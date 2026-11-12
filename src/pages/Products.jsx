
import { useState, useEffect } from 'react'

import ProductHeader from '../components/products/ProductHeader'
import ProductToolbar from '../components/products/ProductToolbar'
import ProductTable from '../components/products/ProductTable'
import ProductForm from '../components/products/ProductForm'
import DeleteProductModal from '../components/products/DeleteProductModal'

import apiFetch from '../services/api'

import './Products.css'

function getProductStatus(quantity, minimum) {
  if (quantity === 0) return 'Rupture'
  if (quantity <= minimum) return 'Stock faible'
  return 'Disponible'
}

function normalizeProduct(product) {
  return {
    ...product,
    id: product._id,
    price: Number(product.price),
    quantity: Number(product.quantity),
    minimum: Number(product.minimum)
  }
}

function Products() {
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  // GET: Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await apiFetch('/products')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erreur de chargement')
        }

        setProducts(data.map(normalizeProduct))
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === '' || product.category === categoryFilter

    const statusMap = {
      available: 'Disponible',
      low: 'Stock faible',
      out: 'Rupture'
    }

    const productStatus = getProductStatus(
      product.quantity,
      product.minimum
    )

    const matchesStock =
      stockFilter === '' || productStatus === statusMap[stockFilter]

    return matchesSearch && matchesCategory && matchesStock
  })

  // POST / PUT: Save product
  async function handleSave(productData) {
    try {
      setError('')

      const isEditing = Boolean(selectedProduct)

      const url = isEditing
        ? `/products/${selectedProduct._id}`
        : '/products'

      const method = isEditing ? 'PUT' : 'POST'

      const payload = {
        name: productData.name,
        reference: productData.reference,
        category: productData.category,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
        minimum: Number(productData.minimum)
      }

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la sauvegarde')
      }

      const savedProduct = normalizeProduct(data)

      if (isEditing) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === savedProduct.id
              ? savedProduct
              : product
          )
        )
      } else {
        setProducts((currentProducts) => [
          ...currentProducts,
          savedProduct
        ])
      }

      setSelectedProduct(null)
      setShowForm(false)
    } catch (error) {
      setError(error.message)
    }
  }

  // Edit product
  function handleEdit(product) {
    setSelectedProduct(product)
    setShowForm(true)
  }

  // Open delete modal
  function handleDelete(product) {
    setProductToDelete(product)
  }

  // DELETE: Remove product
  async function handleConfirmDelete() {
    try {
      setError('')

      const response = await apiFetch(
        `/products/${productToDelete._id}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression')
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productToDelete._id
        )
      )

      setProductToDelete(null)
    } catch (error) {
      setError(error.message)
    }
  }

  // Reset filters
  function handleResetFilters() {
    setSearchTerm('')
    setCategoryFilter('')
    setStockFilter('')
  }

  return (
    <div className="products-content">

      <ProductHeader
        onAddClick={() => setShowForm(true)}
      />

      <ProductToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        stockFilter={stockFilter}
        onStockChange={setStockFilter}
        onResetFilters={handleResetFilters}
      />

      {loading && <p>Chargement des produits...</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && (
        <ProductTable
          products={filteredProducts}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {productToDelete && (
        <DeleteProductModal
          productName={productToDelete.name}
          onCancel={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showForm && (
        <ProductForm
          onClose={() => {
            setShowForm(false)
            setSelectedProduct(null)
          }}
          onSave={handleSave}
          product={selectedProduct}
        />
      )}

    </div>
  )
}

export default Products
