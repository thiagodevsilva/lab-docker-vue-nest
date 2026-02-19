import axios from 'axios'

function getApiUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (typeof window === 'undefined') return 'http://api.local'
  const h = window.location.hostname
  if (h.startsWith('app.')) return `${window.location.protocol}//api.${h.slice(4)}`
  if (h === 'localhost' || h === '127.0.0.1') return 'http://api.local'
  return `${window.location.protocol}//api.${h}`
}
const apiUrl = getApiUrl()

const client = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config.url?.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.replace('/login')
    }
    return Promise.reject(err)
  }
)

export default client
