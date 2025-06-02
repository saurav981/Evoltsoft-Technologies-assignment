<script setup>
import { useChargerStore } from '../stores/chargerStore'
import MapRenderer from '../components/MapRenderer.vue'
import { useAuth } from '../composables/useAuth'
import { onMounted } from 'vue'

const { checkAuth } = useAuth()
const chargerStore = useChargerStore()

onMounted(async () => {
  checkAuth()
  await chargerStore.fetchChargers()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 px-6">
    <h1
      class="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent animate-fade-in-up mb-3"
    >
      Charger Map View
    </h1>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <MapRenderer :chargers="chargerStore.chargers" />
    </div>
  </div>
</template>
