
import { useState } from 'react'

import { useAuth } from './context/AuthContext'
import Login from './pages/Login'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'

import './App.css'

function App() {
  const { user, isAuthenticated } = useAuth()

  const [activePage, setActivePage] = useState('Dashboard')

  // Show Login if user is not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  function renderPage() {
    if (activePage === 'Dashboard') {
      return <Dashboard />
    }

    if (activePage === 'Products') {
      return <Products />
    }

    return <h2>Cette page sera bientôt disponible.</h2>
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-content">
        <Header />
        {renderPage()}
      </main>
    </div>
  )
}

export default App
