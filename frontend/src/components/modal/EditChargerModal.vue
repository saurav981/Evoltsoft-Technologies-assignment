<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  charger: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save', 'close'])

const editedCharger = ref({ ...props.charger })

const errors = ref({
  name: false,
  lat: false,
  lng: false,
  powerOutput: false,
})

const isFormValid = computed(() => {
  return (
    editedCharger.value.name.trim() !== '' &&
    editedCharger.value.location.lat !== null &&
    editedCharger.value.location.lat !== '' &&
    editedCharger.value.location.lng !== null &&
    editedCharger.value.location.lng !== '' &&
    editedCharger.value.powerOutput !== null &&
    editedCharger.value.powerOutput !== '' &&
    editedCharger.value.powerOutput > 0
  )
})

const validateField = (field) => {
  if (field === 'name') {
    errors.value.name = editedCharger.value.name.trim() === ''
  } else if (field === 'lat') {
    errors.value.lat =
      editedCharger.value.location.lat === null || editedCharger.value.location.lat === ''
  } else if (field === 'lng') {
    errors.value.lng =
      editedCharger.value.location.lng === null || editedCharger.value.location.lng === ''
  } else if (field === 'powerOutput') {
    errors.value.powerOutput =
      editedCharger.value.powerOutput === null ||
      editedCharger.value.powerOutput === '' ||
      editedCharger.value.powerOutput <= 0
  }
}

const handleSubmit = () => {
  validateField('name')
  validateField('lat')
  validateField('lng')
  validateField('powerOutput')

  if (!isFormValid.value) {
    return
  }

  emit('save', editedCharger.value)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
  >
    <div
      class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 dark:border-gray-700/50 animate-slideUp"
    >
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-2xl font-light text-gray-900 dark:text-white tracking-tight">
            Edit Charger
          </h3>
          <button
            @click="handleClose"
            class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg
              class="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <div class="group">
            <label
              class="block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
              :class="
                errors.name ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
              "
            >
              Station Name *
            </label>
            <input
              v-model="editedCharger.name"
              type="text"
              class="w-full px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
              :class="
                errors.name
                  ? 'bg-red-50 dark:bg-red-900/20 focus:ring-red-500/30 dark:focus:ring-red-400/30 focus:bg-red-50 dark:focus:bg-red-900/30'
                  : 'bg-gray-50 dark:bg-gray-800 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-gray-700'
              "
              placeholder="Enter station name"
              @blur="validateField('name')"
              @input="errors.name = false"
              required
            />
            <div v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
              Station name is required
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="group">
              <label
                class="block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                :class="
                  errors.lat ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                "
              >
                Latitude *
              </label>
              <input
                v-model.number="editedCharger.location.lat"
                type="number"
                step="0.000001"
                class="w-full px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                :class="
                  errors.lat
                    ? 'bg-red-50 dark:bg-red-900/20 focus:ring-red-500/30 dark:focus:ring-red-400/30 focus:bg-red-50 dark:focus:bg-red-900/30'
                    : 'bg-gray-50 dark:bg-gray-800 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-gray-700'
                "
                placeholder="0.000000"
                @blur="validateField('lat')"
                @input="errors.lat = false"
                required
              />
              <div v-if="errors.lat" class="mt-1 text-sm text-red-600 dark:text-red-400">
                Latitude is required
              </div>
            </div>
            <div class="group">
              <label
                class="block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                :class="
                  errors.lng ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                "
              >
                Longitude *
              </label>
              <input
                v-model.number="editedCharger.location.lng"
                type="number"
                step="0.000001"
                class="w-full px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                :class="
                  errors.lng
                    ? 'bg-red-50 dark:bg-red-900/20 focus:ring-red-500/30 dark:focus:ring-red-400/30 focus:bg-red-50 dark:focus:bg-red-900/30'
                    : 'bg-gray-50 dark:bg-gray-800 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-gray-700'
                "
                placeholder="0.000000"
                @blur="validateField('lng')"
                @input="errors.lng = false"
                required
              />
              <div v-if="errors.lng" class="mt-1 text-sm text-red-600 dark:text-red-400">
                Longitude is required
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="group">
              <label
                class="block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                :class="
                  errors.powerOutput
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                "
              >
                Power Output *
              </label>
              <div class="relative">
                <input
                  v-model.number="editedCharger.powerOutput"
                  type="number"
                  class="w-full px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-10 text-gray-900 dark:text-white"
                  :class="
                    errors.powerOutput
                      ? 'bg-red-50 dark:bg-red-900/20 focus:ring-red-500/30 dark:focus:ring-red-400/30 focus:bg-red-50 dark:focus:bg-red-900/30'
                      : 'bg-gray-50 dark:bg-gray-800 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-gray-700'
                  "
                  placeholder="50"
                  min="1"
                  @blur="validateField('powerOutput')"
                  @input="errors.powerOutput = false"
                  required
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400"
                  >kW</span
                >
              </div>
              <div v-if="errors.powerOutput" class="mt-1 text-sm text-red-600 dark:text-red-400">
                Power output is required and must be greater than 0
              </div>
            </div>
            <div class="group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
              >
                Connector
              </label>
              <select
                v-model="editedCharger.connectorType"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 appearance-none cursor-pointer text-gray-900 dark:text-white"
              >
                <option value="CCS">CCS</option>
                <option value="Type 2">Type 2</option>
                <option value="CHAdeMO">CHAdeMO</option>
              </select>
            </div>
          </div>

          <div class="group">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
            >
              Status
            </label>
            <div class="flex gap-3">
              <label class="flex items-center cursor-pointer group/radio">
                <input type="radio" v-model="editedCharger.status" value="Active" class="sr-only" />
                <div
                  class="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-3 relative transition-all duration-200 group-hover/radio:border-green-400"
                  :class="editedCharger.status === 'Active' ? 'border-green-500 bg-green-500' : ''"
                >
                  <div
                    v-if="editedCharger.status === 'Active'"
                    class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  ></div>
                </div>
                <span
                  class="text-sm font-medium"
                  :class="
                    editedCharger.status === 'Active'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  "
                  >Active</span
                >
              </label>
              <label class="flex items-center cursor-pointer group/radio">
                <input
                  type="radio"
                  v-model="editedCharger.status"
                  value="Inactive"
                  class="sr-only"
                />
                <div
                  class="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-3 relative transition-all duration-200 group-hover/radio:border-red-400"
                  :class="editedCharger.status === 'Inactive' ? 'border-red-500 bg-red-500' : ''"
                >
                  <div
                    v-if="editedCharger.status === 'Inactive'"
                    class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  ></div>
                </div>
                <span
                  class="text-sm font-medium"
                  :class="
                    editedCharger.status === 'Inactive'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  "
                  >Inactive</span
                >
              </label>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button
            @click="handleClose"
            type="button"
            class="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 font-medium hover:scale-[0.98] active:scale-95"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            type="button"
            :disabled="!isFormValid"
            class="flex-1 px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-[0.98] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
            :class="
              isFormValid
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            "
          >
            > Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
}

/* Hide number input spinners */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
