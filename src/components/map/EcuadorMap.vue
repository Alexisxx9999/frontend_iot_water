<template>
  <div class="ecuador-map">
    <l-map
      style="height: 400px; width: 100%;"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
    >
      <l-tile-layer
        :url="tileUrl"
        :attribution="attribution"
      />
      <l-marker
        v-for="meter in meters"
        :key="meter.id"
        :lat-lng="meter.coordinates"
      >
        <l-popup>
          <div>
            <strong>Medidor:</strong> {{ meter.serialNumber }}<br />
            <strong>Estado:</strong> {{ getStatusLabel(meter.status) }}<br />
            <strong>Parroquia:</strong> {{ getParishName(meter.parishId) }}
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue3-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/map';
import { computed } from 'vue';

export default {
  name: 'EcuadorMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  setup() {
    const mapStore = useMapStore();
    const meters = computed(() => mapStore.getMeters);
    const parishes = computed(() => mapStore.getParishes);

    // Centro aproximado de Ecuador
    const center = [-1.8312, -78.1834];
    const zoom = 7;
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const getParishName = (parishId) => {
      const parish = parishes.value.find(p => p.id === parishId);
      return parish ? parish.name : 'N/A';
    };
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

    return {
      center,
      zoom,
      tileUrl,
      attribution,
      meters,
      getParishName,
      getStatusLabel
    };
  }
};
</script>

<style scoped>
.ecuador-map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.leaflet-container {
  width: 100% !important;
  height: 400px !important;
  border-radius: 8px;
}
</style> 