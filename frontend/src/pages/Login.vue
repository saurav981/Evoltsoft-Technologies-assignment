<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, User, Sparkles } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const formTitle = computed(() => (isLogin.value ? 'Log in' : 'Create Account'))
const submitText = computed(() => (isLogin.value ? 'Sign In' : 'Get Started'))
const toggleText = computed(() =>
  isLogin.value ? 'New here? Create an account' : 'Already have an account? Sign in',
)

const handleSubmit = async () => {
  if (isLoading.value) return

  error.value = ''
  isLoading.value = true

  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }
    router.push('/chargers')
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}
</script>

<template>
  <div
    class="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950"
  >
    <div class="absolute inset-0 opacity-30">
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5"
      ></div>
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(99, 102, 241, 0.1) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        "
      ></div>
    </div>

    <div
      class="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full blur-xl opacity-20 animate-bounce"
    ></div>
    <div
      class="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 animate-pulse"
    ></div>
    <div
      class="absolute top-1/2 right-8 w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-lg opacity-20 animate-bounce delay-1000"
    ></div>

    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="group relative">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          ></div>

          <div
            class="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div class="relative px-8 pt-8 pb-6">
              <div class="flex justify-center mb-6">
                <div class="relative group">
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                  ></div>
                  <div
                    class="relative bg-gradient-to-r from-blue-500 to-emerald-500 p-3 rounded-full"
                  >
                    <Zap class="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <h1
                class="text-3xl font-bold text-center bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-800 dark:from-white dark:via-blue-200 dark:to-emerald-200 bg-clip-text text-transparent mb-2"
              >
                {{ formTitle }}
              </h1>

              <p class="text-center text-slate-600 dark:text-slate-400 text-sm">
                {{
                  isLogin
                    ? 'Sign in to access your EV charging dashboard'
                    : 'Join the future of electric vehicle charging'
                }}
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="px-8 pb-8 space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      class="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <input
                    v-model="email"
                    type="email"
                    required
                    class="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      class="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full pl-10 pr-12 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-500 transition-colors duration-200"
                  >
                    <Eye v-if="!showPassword" class="h-5 w-5 text-slate-400" />
                    <EyeOff v-else class="h-5 w-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div
                v-if="error"
                class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl animate-shake"
              >
                <p class="text-red-600 dark:text-red-400 text-sm font-medium text-center">
                  {{ error }}
                </p>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <span class="flex items-center justify-center gap-2">
                  <span v-if="!isLoading">{{ submitText }}</span>
                  <span v-else>Processing...</span>

                  <ArrowRight
                    v-if="!isLoading"
                    class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                  <div
                    v-else
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  ></div>
                </span>

                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"
                ></div>
              </button>

              <div class="text-center pt-4">
                <button
                  type="button"
                  @click="toggleAuthMode"
                  class="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 group"
                >
                  {{ toggleText }}
                  <span
                    class="inline-block transition-transform duration-200 group-hover:translate-x-1 ml-1"
                    >→</span
                  >
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-3 gap-4 opacity-60">
          <div class="text-center">
            <div
              class="w-8 h-8 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
            >
              <Zap class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Fast Charging</p>
          </div>
          <div class="text-center">
            <div
              class="w-8 h-8 mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"
            >
              <User class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Secure Account</p>
          </div>
          <div class="text-center">
            <div
              class="w-8 h-8 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
            >
              <Sparkles class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Smart Features</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
