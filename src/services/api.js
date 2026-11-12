
const API_URL = 'http://localhost:5000/api'

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

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })
}

export default apiFetch
