
import axios from 'axios'

// Create a new axios instance with custom config
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api', // Replace with your actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for cookies/sessions if used
})

// Request interceptor for adding auth token if stored separately (e.g. localStorage)
// Note: If using HTTP-only cookies, this might not be needed
api.interceptors.request.use((config) => {
    // const token = localStorage.getItem('adminToken')
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    // }
    return config
}, (error) => {
    return Promise.reject(error)
})

// Response interceptor for handling common errors (like 401 Unauthorized)
api.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Redirect to login or handle session expiration
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
            // window.location.href = '/auth/login'
            console.warn("Unauthorized access, redirecting to login...")
        }
    }
    return Promise.reject(error)
})

export default api
