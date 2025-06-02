import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchChargers as fetchChargersService,
  createCharger as createChargerService,
  updateCharger as updateChargerService,
  deleteCharger as deleteChargerService,
} from '../services/chargers.js'
import { useAuthStore } from './authStore'

export const useChargerStore = defineStore('charger', () => {
  const authStore = useAuthStore()
  const chargers = ref([])

  const fetchChargers = async () => {
    try {
      if (!authStore.isAuthenticated) return
      const data = await fetchChargersService()
      chargers.value = data
    } catch (err) {
      console.error('Failed to fetch chargers:', err)
      chargers.value = []
    }
  }

  const createCharger = async (chargerData) => {
    try {
      await createChargerService(chargerData)
      await fetchChargers()
    } catch (err) {
      throw err
    }
  }

  const updateCharger = async (chargerData) => {
    try {
      await updateChargerService(chargerData)
      await fetchChargers()
    } catch (err) {
      throw err
    }
  }

  const deleteCharger = async (id) => {
    try {
      await deleteChargerService(id)
      chargers.value = chargers.value.filter((c) => c._id !== id)
    } catch (err) {
      throw err
    }
  }

  return { chargers, fetchChargers, createCharger, updateCharger, deleteCharger }
})
