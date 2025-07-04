<template>
  <div id="map" class="map-leaflet"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'

const quitoCenter = [-0.1807, -78.4678]
const quitoZoom = 13

const locations = [
  { name: 'Centro Histórico', coords: [-0.2201, -78.5126] },
  { name: 'La Carolina', coords: [-0.1821, -78.4847] },
  { name: 'El Condado', coords: [-0.1167, -78.5033] },
  { name: 'Cumbayá', coords: [-0.1962, -78.4186] },
  { name: 'Quitumbe', coords: [-0.2946, -78.5462] }
]

onMounted(() => {
  const map = L.map('map').setView(quitoCenter, quitoZoom)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Limitar el área visible a Quito
  const quitoBounds = L.latLngBounds(
    L.latLng(-0.32, -78.62), // Suroeste
    L.latLng(-0.05, -78.35)  // Noreste
  )
  map.setMaxBounds(quitoBounds)
  map.on('drag', function() {
    map.panInsideBounds(quitoBounds, { animate: false })
  })

  // Agregar marcadores de ejemplo
  locations.forEach(loc => {
    L.marker(loc.coords).addTo(map)
      .bindPopup(`<strong>${loc.name}</strong>`)
  })
})
</script>

<style scoped>
#map.map-leaflet {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border-radius: 18px;
}
</style> 