import axios from "axios"

// Use the environment variable or fallback to the render.com URL
const API_URL = process.env.REACT_APP_API_URL || "https://capsulebackend-1.onrender.com"

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
})

// Add request interceptor for debugging
api.interceptors.request.use((request) => {
  console.log("Starting Request:", request)
  return request
})

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response)
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// Set auth token for requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
  } else {
    delete api.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
  }
}

export default api

