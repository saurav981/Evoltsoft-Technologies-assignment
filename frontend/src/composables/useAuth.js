import { useAuthStore } from '../stores/authStore.js'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const checkAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push('/login')
    }
  }

  return { checkAuth }
}
