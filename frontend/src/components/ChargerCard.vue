<script setup>
import { Edit, Trash, MapPin, Zap, Plug, Activity } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const emit = defineEmits(['edit', 'delete'])
const isHovered = ref(false)

const handleEdit = () => {
  emit('edit')
}

const handleDelete = () => {
  emit('delete')
}

const statusConfig = computed(() => {
  const config = {
    Active: {
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-200 dark:border-emerald-700',
      glowColor: 'shadow-emerald-500/5',
      icon: Activity,
    },
    Inactive: {
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-700',
      glowColor: 'shadow-red-500/5',
      icon: Activity,
    },
  }
  return config[props.charger?.status] || config.Inactive
})

const connectorConfig = computed(() => {
  const config = {
    CCS: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    'Type 2': {
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    CHAdeMO: {
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  }
  return config[props.charger?.connectorType] || config['CCS']
})

const powerLevel = computed(() => {
  const power = props.charger?.powerOutput || 0
  if (power >= 150)
    return {
      level: 'Ultra Fast',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-100 dark:bg-violet-900/30',
    }
  if (power >= 50)
    return {
      level: 'Fast',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    }
  return {
    level: 'Standard',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
  }
})

const props = defineProps({
  charger: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transform-gpu"
    :class="[statusConfig.glowColor, isHovered ? 'shadow-2xl' : 'shadow-lg']"
  >
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-400/10 dark:via-indigo-400/10 dark:to-purple-400/10"
      ></div>
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl transform translate-x-16 -translate-y-16"
      ></div>
    </div>

    <div class="relative p-6 space-y-4">
      <div class="flex items-start justify-between">
        <div class="space-y-1 flex-1">
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
          >
            {{ charger.name }}
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin class="w-4 h-4" />
            <span class="font-medium"
              >{{ charger.location.lat.toFixed(4) }}, {{ charger.location.lng.toFixed(4) }}</span
            >
          </div>
        </div>

        <div
          class="flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300 group-hover:scale-110"
          :class="[statusConfig.bgColor, statusConfig.textColor, statusConfig.borderColor]"
        >
          <component :is="statusConfig.icon" class="w-3.5 h-3.5" />
          <span class="text-xs font-semibold">{{ charger.status }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <div
              class="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
              :class="powerLevel.bg"
            >
              <Zap class="w-4 h-4" :class="powerLevel.color" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Power Output</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ charger.powerOutput
                }}<span class="text-sm font-medium text-gray-500">{{ ` kW` }}</span>
              </p>
            </div>
          </div>
          <div
            class="px-2 py-1 rounded-md text-xs font-medium"
            :class="[powerLevel.bg, powerLevel.color]"
          >
            {{ powerLevel.level }}
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <div
              class="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
              :class="connectorConfig.bg"
            >
              <Plug class="w-4 h-4" :class="connectorConfig.color" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Connector</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ charger.connectorType }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2 pt-2">
        <button
          @click="handleEdit"
          class="group/btn p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Edit charger"
        >
          <Edit class="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-12" />
        </button>
        <button
          @click="handleDelete"
          class="group/btn p-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Delete charger"
        >
          <Trash
            class="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12"
          />
        </button>
      </div>
    </div>

    <div
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    >
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-xl"
      ></div>
    </div>

    <div
      class="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"
    ></div>
  </div>
</template>

<style scoped>
/* Custom animations for smooth performance */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Hardware acceleration for smooth transforms */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Smooth focus states */
button:focus-visible {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
}

/* Optimized hover states */
@media (hover: hover) {
  .group:hover .group-hover\:scale-110 {
    will-change: transform;
  }
}

/* Performance optimizations */
* {
  will-change: auto;
}

.group:hover * {
  will-change: transform, opacity, color;
}
</style>
