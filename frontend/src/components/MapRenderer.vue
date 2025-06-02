<script setup>
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  chargers: {
    type: Array,
    required: true,
    default: () => [],
  },
})

let map = null
let chargerLayers = []

const chargerIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const initMap = () => {
  if (!map) {
    map = L.map('map').setView([0, 0], 2)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)
  }
}

const createChargerPopup = (charger) => {
  return `
    <div class="p-3 w-64">
      <h3 class="font-bold text-lg text-gray-800 mb-2">${charger.name}</h3>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">Status:</span>
          <span class="${charger.status === 'Active' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}">
            ${charger.status}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Power:</span>
          <span class="font-medium">${charger.powerOutput}kW</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Connector:</span>
          <span class="font-medium">${charger.connectorType}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Latitude:</span>
          <span class="font-mono">${charger.location.lat.toFixed(6)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Longitude:</span>
          <span class="font-mono">${charger.location.lng.toFixed(6)}</span>
        </div>
      </div>
    </div>
  `
}

const updateChargersOnMap = () => {
  chargerLayers.forEach((layer) => map.removeLayer(layer))
  chargerLayers = []

  if (props.chargers.length === 0) return

  const chargerGroup = L.featureGroup()

  props.chargers.forEach((charger) => {
    if (charger.location?.lat && charger.location?.lng) {
      const marker = L.marker([charger.location.lat, charger.location.lng], {
        icon: chargerIcon,
        title: charger.name,
        riseOnHover: true,
      })

      marker.bindPopup(createChargerPopup(charger), {
        className: 'custom-popup',
        maxWidth: 300,
      })

      chargerGroup.addLayer(marker)
    }
  })

  chargerLayers.push(chargerGroup)
  map.addLayer(chargerGroup)

  if (props.chargers.length > 0) {
    map.fitBounds(chargerGroup.getBounds().pad(0.2))
  }
}

onMounted(() => {
  initMap()
  updateChargersOnMap()
})

watch(() => props.chargers, updateChargersOnMap, { deep: true })
</script>

<template>
  <div id="map" class="h-[500px] w-full rounded-lg shadow-md z-0"></div>
</template>

<style>
/* Custom popup styling */
.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}

.custom-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.5;
}

.custom-popup .leaflet-popup-tip {
  width: 12px;
  height: 12px;
}
</style>
