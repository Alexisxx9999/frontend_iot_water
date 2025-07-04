<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <button @click="$router.go(-1)" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ incident?.title || 'Cargando...' }}</h1>
              <p class="mt-1 text-sm text-gray-500">Prioridad: <span :class="getPriorityBadgeClass(incident?.priority)">{{ getPriorityLabel(incident?.priority) }}</span></p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="openEditIncidentModal" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
            <button @click="openDeleteIncidentModal" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <span class="text-gray-600">Cargando incidente...</span>
      </div>
      <div v-else-if="incident" class="space-y-6">
        <!-- Información General -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Incidente</h3>
            <dl class="space-y-3">
              <div><dt class="text-sm font-medium text-gray-500">Título</dt><dd class="text-sm text-gray-900">{{ incident.title }}</dd></div>
              <div><dt class="text-sm font-medium text-gray-500">Descripción</dt><dd class="text-sm text-gray-900">{{ incident.description }}</dd></div>
              <div><dt class="text-sm font-medium text-gray-500">Prioridad</dt><dd class="text-sm text-gray-900"><span :class="getPriorityBadgeClass(incident.priority)">{{ getPriorityLabel(incident.priority) }}</span></dd></div>
              <div><dt class="text-sm font-medium text-gray-500">Departamento Afectado</dt><dd class="text-sm text-gray-900">{{ getDepartmentName(incident.departmentId) }}</dd></div>
              <div><dt class="text-sm font-medium text-gray-500">Reportado Por</dt><dd class="text-sm text-gray-900">{{ getUserName(incident.reportedBy) }}</dd></div>
              <div><dt class="text-sm font-medium text-gray-500">Fecha</dt><dd class="text-sm text-gray-900">{{ formatDate(incident.date) }}</dd></div>
              <div><dt class="text-sm font-medium text-gray-500">Estado</dt><dd class="text-sm text-gray-900">{{ incident.status }}</dd></div>
              <div><dt class="text-sm font-medium text-gray-500">Dispositivo Afectado</dt><dd class="text-sm text-gray-900">{{ incident.affectedDeviceId }}</dd></div>
            </dl>
          </div>
          <!-- Acciones de Estado y Prioridad -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Actualizar Estado / Prioridad</h3>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="incident.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option v-for="status in incidentStatuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select v-model="incident.priority" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option v-for="priority in priorities" :key="priority.key" :value="priority.key">{{ priority.label }}</option>
              </select>
            </div>
            <button @click="updateIncident" class="px-4 py-2 bg-blue-600 text-white rounded-md">Actualizar</button>
          </div>
        </div>
        <!-- Bitácora del Caso -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Bitácora del Incidente</h3>
          <ul class="space-y-4">
            <li v-for="entry in incidentLog" :key="entry.id" class="border-l-4 pl-4" :class="entry.type === 'comentario' ? 'border-blue-400' : 'border-green-400'">
              <div class="flex justify-between items-center">
                <span class="font-semibold">{{ getUserName(entry.userId) }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(entry.date) }}</span>
              </div>
              <div class="text-sm text-gray-700 mt-1">{{ entry.content }}</div>
              <div v-if="entry.files && entry.files.length" class="mt-2">
                <span class="text-xs text-gray-500">Adjuntos:</span>
                <ul class="list-disc ml-6">
                  <li v-for="file in entry.files" :key="file.name">
                    <a :href="file.url" target="_blank" class="text-blue-600 underline">{{ file.name }}</a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <!-- Formulario para nueva entrada -->
          <form @submit.prevent="addLogEntry" class="mt-6">
            <textarea v-model="newLogEntry" class="w-full border rounded p-2 mb-2" rows="2" placeholder="Agregar comentario o actualización..."></textarea>
            <input type="file" multiple @change="handleFileUpload" class="mb-2" />
            <div v-if="selectedFiles.length" class="mb-2 flex flex-wrap gap-2">
              <span v-for="(file, idx) in selectedFiles" :key="idx" class="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                {{ file.name }}
                <button type="button" @click="removeSelectedFile(idx)" class="ml-2 text-red-500 hover:underline">Quitar</button>
              </span>
            </div>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md">Agregar Entrada</button>
          </form>
        </div>
        <!-- Panel de Notificaciones -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Notificaciones</h3>
          <div class="flex flex-col md:flex-row gap-4">
            <button @click="notify('usuario')" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md">Notificar Usuario</button>
            <button @click="notify('tecnico')" class="px-4 py-2 bg-green-100 text-green-700 rounded-md">Notificar Técnico</button>
            <button @click="notify('supervisor')" class="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md">Notificar Supervisor</button>
          </div>
        </div>
        <!-- Modals -->
        <IncidentModal
          :isOpen="showEditIncidentModal"
          isEditing
          :incident="incident"
          :priorities="priorities"
          :departments="departments"
          :incidentTypes="incidentTypes"
          :technicalTeam="technicalTeam"
          @close="showEditIncidentModal = false"
          @saved="handleIncidentSaved"
        />
        <DeleteIncidentModal
          :isOpen="showDeleteIncidentModal"
          :incident="incident"
          @close="showDeleteIncidentModal = false"
          @deleted="handleIncidentDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import IncidentModal from '@/components/incidents/IncidentModal.vue';
import DeleteIncidentModal from '@/components/incidents/DeleteIncidentModal.vue';
const loading = ref(false);
const incident = ref({}); // Cargar desde API
const incidentLog = ref([]); // Cargar desde API
const newLogEntry = ref('');
const selectedFiles = ref([]);
const showEditIncidentModal = ref(false);
const showDeleteIncidentModal = ref(false);
const departments = ref([]); // Cargar desde API
const incidentTypes = ref([]); // Cargar desde API
const technicalTeam = ref([]); // Cargar desde API
const incidentStatuses = ['Abierto', 'En Proceso', 'Resuelto', 'Cerrado'];
const priorities = [
  { key: 'critico', label: 'Crítico', badgeClass: 'bg-red-100 text-red-700' },
  { key: 'alto', label: 'Alto', badgeClass: 'bg-orange-100 text-orange-700' },
  { key: 'medio', label: 'Medio', badgeClass: 'bg-yellow-100 text-yellow-700' },
  { key: 'bajo', label: 'Bajo', badgeClass: 'bg-green-100 text-green-700' },
];
onMounted(() => {
  // Simulación de carga de datos desde backend
  departments.value = [
    { id: 'd1', name: 'Operaciones' },
    { id: 'd2', name: 'Soporte' },
    { id: 'd3', name: 'TI' }
  ];
  incidentTypes.value = ['Fuga', 'Corte', 'Mantenimiento', 'Otro'];
  technicalTeam.value = [
    { id: 't1', name: 'Juan Pérez', specialty: 'Electricista', status: 'Disponible' },
    { id: 't2', name: 'Ana López', specialty: 'Plomero', status: 'Ocupado' },
    { id: 't3', name: 'Carlos Ruiz', specialty: 'TI', status: 'Disponible' }
  ];
  // Aquí deberías cargar el incidente y la bitácora desde tu backend
});
function getPriorityBadgeClass(priority) { return 'px-2 py-1 rounded-full text-xs font-semibold ' + (priorities.find(p => p.key === priority)?.badgeClass || 'bg-gray-100 text-gray-700'); }
function getPriorityLabel(priority) { return priorities.find(p => p.key === priority)?.label || priority; }
function getDepartmentName(id) { return departments.value.find(d => d.id === id)?.name || id; }
function getUserName(id) { return id; }
function formatDate(date) { return date; }
function openEditIncidentModal() { showEditIncidentModal.value = true; }
function openDeleteIncidentModal() { showDeleteIncidentModal.value = true; }
function handleIncidentSaved(updatedIncident) { /* Actualizar datos y feedback visual */ showEditIncidentModal.value = false; }
function handleIncidentDeleted() { /* Redirigir o feedback visual */ showDeleteIncidentModal.value = false; }
function updateIncident() { /* Guardar cambios de estado/prioridad */ }
function addLogEntry() { /* Guardar nueva entrada en bitácora */ newLogEntry.value = ''; selectedFiles.value = []; }
function handleFileUpload(e) { selectedFiles.value = Array.from(e.target.files); }
function removeSelectedFile(idx) { selectedFiles.value.splice(idx, 1); }
function notify(type) { /* Notificar según tipo */ }
</script>

<style scoped>
.section-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
h1 {
  font-size: 2.5rem;
  color: #2196f3;
}
</style>
