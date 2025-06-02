import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL
const API_URL = `${baseURL}/api/auth`

export const registerUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/register`,
    { email, password },
    { withCredentials: true },
  )
  return response.data
}

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true },
  )
  return response.data
}

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
  return response.data
}

export const checkAuth = async () => {
  const response = await axios.get(`${API_URL}/check-auth`, {
    withCredentials: true,
  })
  return response.data
}
