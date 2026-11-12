
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Fired when the API rejects the token (expired or invalid)
export const AUTH_EXPIRED_EVENT = 'auth:expired'

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    ...options.headers
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  // A 401 with a saved token means the session is over:
  // tell the app so it can log the user out.
  // (A wrong password on the login form is not an expired session.)
  if (
    response.status === 401 &&
    token &&
    endpoint !== '/auth/login'
  ) {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
  }

  return response
}

export default apiFetch
