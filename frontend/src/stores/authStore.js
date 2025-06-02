import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser, registerUser, logoutUser, checkAuth } from '../services/auth.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const initializeAuth = async () => {
    try {
      const response = await checkAuth()
      if (response?.user) {
        user.value = response.user
        isAuthenticated.value = true
        return true
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    }
    isAuthenticated.value = false
    user.value = null
    return false
  }

  const login = async (email, password) => {
    await loginUser(email, password)
    isAuthenticated.value = true
  }

  const register = async (email, password) => {
    await registerUser(email, password)
  }

  const logout = async () => {
    await logoutUser()
    user.value = null
    isAuthenticated.value = false
  }

  return { user, initializeAuth, isAuthenticated, login, register, logout }
})
