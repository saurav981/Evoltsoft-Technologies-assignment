import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Chargers from '../pages/Chargers.vue'
import MapView from '../pages/MapView.vue'
import { useAuthStore } from '../stores/authStore.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/chargers', component: Chargers, meta: { requiresAuth: true } },
    { path: '/map', component: MapView, meta: { requiresAuth: true } },
    { path: '/', redirect: '/chargers' },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.initializeAuth()
    if (!isAuthenticated) {
      return '/login'
    }
  }
})

export default router
