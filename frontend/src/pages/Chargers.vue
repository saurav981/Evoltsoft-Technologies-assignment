<script setup>
import { ref, onMounted, computed } from 'vue'
import { useChargerStore } from '../stores/chargerStore'
import ChargerCard from '../components/ChargerCard.vue'
import EditChargerModal from '../components/modal/EditChargerModal.vue'
import AddChargerModal from '../components/modal/AddChargerModal.vue'

const chargerStore = useChargerStore()
const showAddModal = ref(false)

const statusFilter = ref('All')
const connectorFilter = ref('All')
const minPowerFilter = ref('')
const maxPowerFilter = ref('')

const currentlyEditing = ref(null)
const showDeleteConfirm = ref(false)
const chargerToDelete = ref(null)

const isLoading = ref(true)
const filtersExpanded = ref(true)

onMounted(async () => {
  await chargerStore.fetchChargers()
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

const filteredChargers = computed(() => {
  return chargerStore.chargers.filter((charger) => {
    const statusMatch = statusFilter.value === 'All' || charger.status === statusFilter.value
    const connectorMatch =
      connectorFilter.value === 'All' || charger.connectorType === connectorFilter.value
    const minPowerMatch =
      !minPowerFilter.value || charger.powerOutput >= Number(minPowerFilter.value)
    const maxPowerMatch =
      !maxPowerFilter.value || charger.powerOutput <= Number(maxPowerFilter.value)

    return statusMatch && connectorMatch && minPowerMatch && maxPowerMatch
  })
})

const handleSubmit = async (chargerData) => {
  await chargerStore.createCharger(chargerData)
  showAddModal.value = false
}

const handleEdit = (charger) => {
  currentlyEditing.value = charger
}

const handleSaveEdit = async (updatedCharger) => {
  try {
    await chargerStore.updateCharger(updatedCharger)
    currentlyEditing.value = null
  } catch (error) {
    console.error('Failed to update charger:', error)
  }
}

const handleDeleteClick = (charger) => {
  chargerToDelete.value = charger
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (chargerToDelete.value) {
    await chargerStore.deleteCharger(chargerToDelete.value._id)
    showDeleteConfirm.value = false
    chargerToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  chargerToDelete.value = null
}

const resetFilters = () => {
  statusFilter.value = 'All'
  connectorFilter.value = 'All'
  minPowerFilter.value = ''
  maxPowerFilter.value = ''
}

const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 px-10"
  >
    <Transition name="fade" mode="out-in">
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div class="flex flex-col items-center space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
          ></div>
          <p class="text-gray-600 dark:text-gray-300 animate-pulse">Loading charging stations...</p>
        </div>
      </div>
    </Transition>

    <div class="container mx-auto p-6 max-w-7xl">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0"
      >
        <div class="space-y-2">
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent animate-fade-in-up"
          >
            Charging Stations
          </h1>
          <p class="text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-100">
            Manage your electric vehicle charging infrastructure
          </p>
        </div>

        <button
          @click="showAddModal = true"
          class="group px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg animate-fade-in-up animation-delay-200 flex items-center space-x-2"
        >
          <svg
            class="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span>Add New Station</span>
        </button>
      </div>

      <Transition name="modal" mode="out-in">
        <AddChargerModal v-if="showAddModal" @save="handleSubmit" @close="showAddModal = false" />
      </Transition>

      <div
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 mb-8 overflow-hidden animate-fade-in-up animation-delay-300"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"
              ></div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Smart Filters</h2>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="resetFilters"
                class="text-sm px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              >
                Reset All
              </button>
              <button
                @click="toggleFilters"
                class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <svg
                  class="w-5 h-5 transition-transform duration-300"
                  :class="{ 'rotate-180': !filtersExpanded }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <Transition name="slide-fade" mode="out-in">
            <div
              v-if="filtersExpanded"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div class="group space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <div class="relative">
                  <select
                    v-model="statusFilter"
                    class="custom-select w-full text-sm px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div class="group space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Connector Type</label
                >
                <div class="relative">
                  <select
                    v-model="connectorFilter"
                    class="custom-select w-full text-sm px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  >
                    <option value="All">All Connectors</option>
                    <option value="CCS">CCS</option>
                    <option value="Type 2">Type 2</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                </div>
              </div>

              <div class="group space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Min Power</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-[1.35rem] transform -translate-y-1/2 text-blue-500 font-bold text-lg z-10 transition-all duration-200 group-hover:text-blue-600"
                    >></span
                  >
                  <input
                    v-model.number="minPowerFilter"
                    type="number"
                    min="0"
                    placeholder="Min Power (kW)"
                    class="custom-number-input w-full text-sm pl-8 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div class="group space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Max Power</label
                >
                <div class="relative">
                  <input
                    v-model.number="maxPowerFilter"
                    type="number"
                    min="0"
                    placeholder="Max Power (kW)"
                    class="custom-number-input w-full text-sm pl-4 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  />
                  <span
                    class="absolute right-3 top-[1.35rem] transform -translate-y-1/2 text-blue-500 font-bold text-lg z-10 transition-all duration-200 group-hover:text-blue-600"
                    ><</span
                  >
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <Transition name="modal" mode="out-in">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-3 mb-4">
              <div
                class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">Confirm Deletion</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this charging station? This action cannot be undone.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="cancelDelete"
                class="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Delete Station
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade" mode="out-in">
        <div v-if="filteredChargers.length > 0" class="space-y-6">
          <div class="flex items-center justify-between">
            <p class="text-gray-600 dark:text-gray-400">
              Showing {{ filteredChargers.length }} of {{ chargerStore.chargers.length }} stations
            </p>
          </div>

          <TransitionGroup
            name="stagger"
            tag="div"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ChargerCard
              v-for="(charger, index) in filteredChargers"
              :key="charger._id"
              :charger="charger"
              :style="{ animationDelay: `${index * 100}ms` }"
              class="animate-fade-in-up"
              @edit="handleEdit(charger)"
              @delete="handleDeleteClick(charger)"
            />
          </TransitionGroup>
        </div>

        <div v-else class="text-center py-16">
          <div class="max-w-md mx-auto">
            <div
              class="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-12 h-12 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No stations found
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              No charging stations match your current filters. Try adjusting your search criteria.
            </p>
            <button
              @click="resetFilters"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </Transition>

      <Transition name="modal" mode="out-in">
        <EditChargerModal
          v-if="currentlyEditing"
          :charger="currentlyEditing"
          @save="handleSaveEdit"
          @close="currentlyEditing = null"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Hide number input arrows */
.custom-number-input::-webkit-outer-spin-button,
.custom-number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom-number-input[type='number'] {
  -moz-appearance: textfield;
}

/* Hide select dropdown arrow */
.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}

/* Custom Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

/* Transition Classes */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.stagger-enter-active {
  transition: all 0.6s ease;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.stagger-leave-active {
  transition: all 0.3s ease;
}

.stagger-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.stagger-move {
  transition: transform 0.3s ease;
}

/* Smooth scrolling and focus styles */
* {
  scroll-behavior: smooth;
}

input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
}
</style>
