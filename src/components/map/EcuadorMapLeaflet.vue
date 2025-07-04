<template>
<<<<<<< HEAD
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
=======
  <div ref="mapContainer" class="ecuador-leaflet-map"></div>
</template>
<script>
import { onMounted, ref, computed } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/map';
const markerIcons = {
  active: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  inactive: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  maintenance: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  fault: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  disconnected: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};
export default {
  name: 'EcuadorMapLeaflet',
  setup() {
    const mapContainer = ref(null);
    const mapStore = useMapStore();
    const meters = computed(() => mapStore.getMeters);
    onMounted(() => {
      const map = L.map(mapContainer.value).setView([-1.8312, -78.1834], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      meters.value.forEach(meter => {
        if (!meter.coordinates || meter.coordinates.length !== 2) return;
        const icon = markerIcons[meter.status] || markerIcons.active;
        const marker = L.marker(meter.coordinates, { icon }).addTo(map);
        marker.bindPopup(`
          <strong>Medidor:</strong> ${meter.serialNumber}<br/>
          <strong>Estado:</strong> ${meter.status}<br/>
        `);
      });
    });
    return { mapContainer };
  }
};
</script>
<style scoped>
.ecuador-leaflet-map { width: 100%; height: 400px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
</style> 