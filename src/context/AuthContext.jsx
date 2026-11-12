
import { createContext, useContext, useEffect, useState } from 'react'

import apiFetch, { AUTH_EXPIRED_EVENT } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token')
  })

  const [sessionExpired, setSessionExpired] = useState(false)

  // Log the user out automatically when the API says the token is invalid
  useEffect(() => {
    function handleSessionExpired() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      setToken(null)
      setUser(null)
      setSessionExpired(true)
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired)

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [])

  // Login
  async function login(email, password) {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    setToken(data.token)
    setUser(data.user)
    setSessionExpired(false)

    return data.user
  }

  // Logout
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    sessionExpired,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider')
  }

  return context
}
