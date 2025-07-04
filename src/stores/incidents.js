import { ref } from 'vue';
import * as api from '@/services/incidents.service.js';
import { defineStore } from 'pinia';

export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    incidents: [],
    loading: false,
  }),
  actions: {
    addIncident(incident) {
      this.incidents.unshift({
        ...incident,
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'Abierto',
        reportedBy: 'Usuario Demo',
      });
    },
    updateIncident(updated) {
      const idx = this.incidents.findIndex(i => i.id === updated.id);
      if (idx !== -1) this.incidents[idx] = { ...this.incidents[idx], ...updated };
    },
    deleteIncident(id) {
      this.incidents = this.incidents.filter(i => i.id !== id);
    },
    setIncidents(list) {
      this.incidents = list;
    },
    clearIncidents() {
      this.incidents = [];
    },
  },
});


