import { useState, useEffect, useRef } from 'react'

import { useAuth } from '../context/AuthContext'

import './Header.css'

const ROLE_LABELS = {
  admin: 'Administrateur',
  employee: 'Employé'
}

function Header({ onNavigate }) {
  const { user, logout } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  const displayName = user?.name || 'Utilisateur'
  const initial = displayName.charAt(0).toUpperCase()
  const roleLabel = ROLE_LABELS[user?.role] || 'Utilisateur'

  // Close the menu on outside click or Escape key
  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function handleSettings() {
    setMenuOpen(false)
    onNavigate?.('Settings')
  }

  function handleLogout() {
    setMenuOpen(false)
    logout()
  }

  return (
    <header className="header">

      <div className="header-brand">
        <div className="header-logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
            <path d="m3 8 9 5 9-5" />
            <path d="M12 13v8" />
            <path d="M3 8v9l9 5 9-5V8" />
          </svg>
        </div>

        <h1>Stocky</h1>
      </div>

      <div className="header-actions">

        <div className="header-search">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>

          <input
            type="text"
            placeholder="Rechercher..."
          />
        </div>

        <div className="user-menu" ref={menuRef}>

          <button
            type="button"
            ref={triggerRef}
            className={`user-profile ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className="user-avatar">{initial}</div>
            <span className="user-name">{displayName}</span>

            <svg
              className="user-chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {menuOpen && (
            <div className="user-dropdown" role="menu">

              <div className="user-dropdown-header">
                <div className="user-avatar large">{initial}</div>

                <div className="user-dropdown-info">
                  <strong>{displayName}</strong>

                  {user?.email && (
                    <span className="user-email">{user.email}</span>
                  )}

                  <span className={`role-badge ${user?.role || ''}`}>
                    {roleLabel}
                  </span>
                </div>
              </div>

              <div className="user-dropdown-divider" />

              <button
                type="button"
                role="menuitem"
                className="user-dropdown-item"
                onClick={handleSettings}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
                <span>Paramètres utilisateur</span>
              </button>

              <div className="user-dropdown-divider" />

              <button
                type="button"
                role="menuitem"
                className="user-dropdown-item danger"
                onClick={handleLogout}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                <span>Déconnexion</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  )
}

export default Header