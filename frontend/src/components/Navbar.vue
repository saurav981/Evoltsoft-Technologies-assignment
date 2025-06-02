<script setup>
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { useRouter } from 'vue-router'
import { LogOut, Sun, Moon, Menu, X, Zap } from 'lucide-vue-next'
import { ref } from 'vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const logout = async () => {
  await authStore.logout()
  router.push('/login')
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav
    class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/20 dark:border-slate-700/30 transition-all duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <router-link
          to="/"
          class="group flex items-center gap-3 text-xl font-semibold text-slate-900 dark:text-white transition-all duration-300 hover:scale-105"
          @click="closeMobileMenu"
        >
          <div class="relative">
            <Zap
              class="w-6 h-6 text-emerald-500 transition-all duration-300 group-hover:text-emerald-400 group-hover:rotate-12"
            />
            <div
              class="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <span
            class="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
          >
            EV Chargers
          </span>
        </router-link>

        <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-1">
          <router-link
            to="/chargers"
            class="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 group"
            @click="closeMobileMenu"
          >
            Chargers
            <div
              class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"
            ></div>
          </router-link>

          <router-link
            to="/map"
            class="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 group"
            @click="closeMobileMenu"
          >
            Map
            <div
              class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"
            ></div>
          </router-link>
        </div>

        <div class="hidden md:flex items-center space-x-3">
          <button
            @click="themeStore.toggleTheme"
            class="relative p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:scale-110 group"
            aria-label="Toggle theme"
          >
            <Sun
              v-if="themeStore.isDark"
              class="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:rotate-180"
            />
            <Moon
              v-else
              class="w-4 h-4 text-slate-600 transition-transform duration-300 group-hover:-rotate-12"
            />
            <div
              class="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </button>

          <button
            v-if="authStore.isAuthenticated"
            @click="logout"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-all duration-300 group"
          >
            <LogOut class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            <span>Logout</span>
          </button>
        </div>

        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:scale-110"
          aria-label="Toggle menu"
        >
          <Menu
            v-if="!isMobileMenuOpen"
            class="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform duration-300"
          />
          <X
            v-else
            class="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform duration-300 rotate-90"
          />
        </button>
      </div>
    </div>

    <div
      :class="[
        'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
      ]"
    >
      <div
        class="px-4 py-3 space-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/20 dark:border-slate-700/30"
      >
        <router-link
          to="/chargers"
          class="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300 transform hover:translate-x-1"
          @click="closeMobileMenu"
        >
          Chargers
        </router-link>

        <router-link
          to="/map"
          class="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300 transform hover:translate-x-1"
          @click="closeMobileMenu"
        >
          Map
        </router-link>

        <div class="flex items-center justify-between px-4 py-3">
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Theme</span>
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
          >
            <Sun v-if="themeStore.isDark" class="w-4 h-4 text-amber-500" />
            <Moon v-else class="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <button
          v-if="authStore.isAuthenticated"
          @click="logout"
          class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 transform hover:translate-x-1"
        >
          <LogOut class="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>
