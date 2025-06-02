<script setup>
import { ref, onMounted } from 'vue'

const darkMode = ref(false)

const toggleTheme = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  localStorage.setItem('darkMode', darkMode.value)
}

onMounted(() => {
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  document.documentElement.classList.toggle('dark', darkMode.value)
})
</script>

<template>
  <button @click="toggleTheme" class="p-2 rounded-full">
    <span v-if="darkMode">🌞</span>
    <span v-else>🌙</span>
  </button>
</template>
