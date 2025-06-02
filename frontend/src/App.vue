<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { onMounted, ref } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const isLoading = ref(true)
const authChecked = ref(false)

onMounted(async () => {
  themeStore.initTheme()

  try {
    const isAuthenticated = await authStore.initializeAuth()

    if (!isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
      await router.push('/login')
    }
  } catch (error) {
    console.error('Authentication initialization failed:', error)
    if (router.currentRoute.value.meta.requiresAuth) {
      await router.push('/login')
    }
  } finally {
    authChecked.value = true
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
    <div
      class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
    ></div>
  </div>

  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <Navbar />
    <main class="mx-auto">
      <RouterView />
    </main>
  </div>
</template>
