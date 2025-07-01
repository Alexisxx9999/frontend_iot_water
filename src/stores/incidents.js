import { ref } from 'vue';
import * as api from '@/services/incidents.service.js';

export function useIncidentsStore() {
  const incidents = ref([]);
  const incident = ref(null);
  const loading = ref(false);

  async function loadIncidents(params) {
    loading.value = true;
    incidents.value = await api.fetchIncidents(params);
    loading.value = false;
  }

  async function loadIncident(id) {
    loading.value = true;
    incident.value = await api.fetchIncidentById(id);
    loading.value = false;
  }

  async function createIncident(data) {
    return await api.createIncident(data);
  }

  async function updateIncident(id, data) {
    return await api.updateIncident(id, data);
  }

  async function deleteIncident(id) {
    return await api.deleteIncident(id);
  }

  async function assignTechnician(id, technicianId) {
    return await api.assignTechnician(id, technicianId);
  }

  async function addLogEntry(id, entry) {
    return await api.addLogEntry(id, entry);
  }

  return {
    incidents,
    incident,
    loading,
    loadIncidents,
    loadIncident,
    createIncident,
    updateIncident,
    deleteIncident,
    assignTechnician,
    addLogEntry
  };
}
