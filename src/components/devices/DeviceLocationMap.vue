<template>
  <div ref="mapContainer" class="device-location-map"></div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  name: 'DeviceLocationMap',
  props: {
    coordinates: {
      type: Array,
      required: true
    },
    serialNumber: String,
    status: String,
    parishName: String,
    model: String,
    manufacturer: String
  },
  setup(props) {
    const mapContainer = ref(null);
    let map = null;
    let marker = null;

    const getStatusLabel = (status) => {
      const statusLabels = {
        active: 'Activo',
        inactive: 'Inactivo',
        maintenance: 'En Mantenimiento',
        fault: 'En Falla',
        disconnected: 'Desconectado'
      };
      return statusLabels[status] || 'Desconocido';
    };

    const createMap = () => {
      if (map) {
        map.remove();
      }
      map = L.map(mapContainer.value).setView(props.coordinates, 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      const icon = markerIcons[props.status] || markerIcons.active;
      marker = L.marker(props.coordinates, { icon }).addTo(map);
      marker.bindPopup(`
        <strong>Medidor:</strong> ${props.serialNumber}<br/>
        <strong>Estado:</strong> ${getStatusLabel(props.status)}<br/>
        <strong>Parroquia:</strong> ${props.parishName || ''}<br/>
        <strong>Modelo:</strong> ${props.model || ''}<br/>
        <strong>Fabricante:</strong> ${props.manufacturer || ''}
      `);
    };

    onMounted(() => {
      if (props.coordinates && props.coordinates.length === 2) {
        createMap();
      }
    });

    watch(() => props.coordinates, (newCoords) => {
      if (newCoords && newCoords.length === 2) {
        createMap();
      }
    });

    return {
      mapContainer
    };
  }
};
</script>

<style scoped>
.device-location-map {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
}
</style> 