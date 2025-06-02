import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL
const API_URL = `${baseURL}/api/chargers`

export const fetchChargers = async () => {
  const response = await axios.get(API_URL, { withCredentials: true })
  return response.data
}

export const createCharger = async (chargerData) => {
  const response = await axios.post(API_URL, chargerData, { withCredentials: true })
  return response.data
}

export const updateCharger = async (chargerData) => {
  const response = await axios.put(`${API_URL}/${chargerData._id}`, chargerData, {
    withCredentials: true,
  })
  return response.data
}

export const deleteCharger = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true })
  return response.data
}
