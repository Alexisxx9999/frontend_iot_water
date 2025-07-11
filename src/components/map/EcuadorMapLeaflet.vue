<template>
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
    const loading = ref(false);
    const loadData = async () => {
      loading.value = true;
      try {
        console.log('Cargando datos...');
        await Promise.all([
          mapStore.fetchZonalAdministrations(),
          mapStore.fetchParishes(),
          mapStore.fetchMeters(),
          mapStore.fetchConsumptionSummary(),
          mapStore.fetchConsumptionHistory(),
          mapStore.fetchChartData()
        ]);
        console.log('Datos cargados correctamente');
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        loading.value = false;
        console.log('loading.value =', loading.value);
      }
    };
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
    return { mapContainer, loading, loadData };
  }
};
</script>
<style scoped>
.ecuador-leaflet-map { width: 100%; height: 400px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
</style> 