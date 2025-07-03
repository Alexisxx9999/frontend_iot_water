<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Problemas (Incidentes Internos)</h1>
            <p class="mt-1 text-sm text-gray-500">
              Administra y monitorea todos los incidentes reportados en el sistema
            </p>
          </div>
          <button
            @click="openNewIncidentModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            :disabled="loading"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Incidente
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Resumen de Incidentes por Prioridad -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div v-for="priority in priorities" :key="priority.key" :class="['rounded-xl shadow flex flex-col items-center py-6 hover:shadow-lg transition', priority.cardClass]">
          <div class="flex items-center justify-center w-12 h-12 rounded-full mb-2" :class="priority.iconBg">
            <component :is="priority.icon" class="w-7 h-7" />
          </div>
          <span :class="priority.badgeClass" class="px-3 py-1 rounded-full text-xs font-semibold mb-2">{{ priority.label }}</span>
          <span class="text-4xl font-extrabold text-gray-900">{{ incidentSummary[priority.key] || 0 }}</span>
          <span class="text-xs text-gray-500 mt-1">Incidentes</span>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Búsqueda -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Título, departamento, reportado por..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="handleSearch"
                :disabled="loading"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- Filtros -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="filters.status" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="loading">
              <option value="">Todos</option>
              <option v-for="status in incidentStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select v-model="filters.priority" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="loading">
              <option value="">Todas</option>
              <option v-for="priority in priorities" :key="priority.key" :value="priority.key">{{ priority.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select v-model="filters.department" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="loading">
              <option value="">Todos</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente</label>
            <select v-model="filters.type" @change="applyFilters" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="loading">
              <option value="">Todos</option>
              <option v-for="type in incidentTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
        </div>
        <!-- Chips de filtros activos -->
        <div v-if="activeFilters.length" class="flex flex-wrap gap-2 mt-4">
          <span v-for="chip in activeFilters" :key="chip.label" class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            {{ chip.label }}
            <button @click="chip.clear" class="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none">&times;</button>
          </span>
        </div>
        <!-- Botones de Acción -->
        <div class="flex justify-between items-center mt-6">
          <div class="flex space-x-2">
            <button @click="clearFilters" class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition" :disabled="loading">Limpiar Filtros</button>
            <button @click="refreshData" class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition" :disabled="loading">Actualizar</button>
          </div>
          <div class="flex space-x-4 text-sm text-gray-600">
            <span>Total: {{ pagination.total }}</span>
          </div>
        </div>
      </div>

      <!-- Loading animado -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 text-lg">Cargando incidentes...</span>
      </div>

      <!-- Tabla de Incidentes -->
      <div v-else class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="column in tableColumns" :key="column.key" class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{{ column.label }}</th>
                <th class="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="incident in incidents" :key="incident.id" :class="{'bg-blue-50/50': incident.status === 'Resuelto', 'hover:bg-blue-50 transition': true}">
                <td class="px-6 py-4 whitespace-nowrap font-medium">{{ incident.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getPriorityBadgeClass(incident.priority)">{{ getPriorityLabel(incident.priority) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ getDepartmentName(incident.departmentId) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ getUserName(incident.reportedBy) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(incident.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['inline-block px-2 py-1 rounded-full text-xs font-semibold', incident.status === 'Resuelto' ? 'bg-green-100 text-green-700' : incident.status === 'En Proceso' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700']">
                    {{ incident.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button @click="assignIncident(incident)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition" :disabled="loading" title="Asignar Técnico">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3a3 3 0 01-3 3H9a3 3 0 01-3-3V9"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m4 0h-1v4h-1"></path></svg>
                    Asignar
                  </button>
                  <button @click="() => openEditIncidentModal(incident)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition" :disabled="loading" title="Editar Incidente">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h18"></path></svg>
                    Editar
                  </button>
                  <button @click="() => openDeleteIncidentModal(incident)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 transition" :disabled="loading" title="Eliminar Incidente">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Eliminar
                  </button>
                  <button @click="viewIncident(incident)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition" :disabled="loading" title="Ver Detalle">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Ver
                  </button>
                </td>
              </tr>
              <tr v-if="!incidents.length && !loading">
                <td colspan="7" class="text-center text-gray-400 py-8">No hay incidentes registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Paginación -->
        <div class="flex justify-end mt-6 space-x-2">
          <button @click="prevPage" :disabled="pagination.page === 1 || loading" class="px-3 py-1 border rounded-l bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Anterior</button>
          <span class="px-4 py-1 border-t border-b">Página {{ pagination.page }} de {{ totalPages }}</span>
          <button @click="nextPage" :disabled="pagination.page === totalPages || loading" class="px-3 py-1 border rounded-r bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Siguiente</button>
        </div>
      </div>

      <!-- Equipo Técnico Disponible -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Equipo Técnico Disponible</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="tech in technicalTeam" :key="tech.id" class="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow hover:shadow-md transition">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 mb-2">
              {{ tech.name.charAt(0) }}
            </div>
            <span class="font-bold text-gray-800">{{ tech.name }}</span>
            <span class="text-xs text-gray-500 mb-1">{{ tech.specialty }}</span>
            <span :class="getTechStatusClass(tech.status)" class="px-2 py-1 rounded-full text-xs font-semibold">{{ tech.status }}</span>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <IncidentModal
        :isOpen="showNewIncidentModal || showEditIncidentModal"
        :isEditing="!!selectedIncident"
        :incident="selectedIncident"
        :priorities="priorities"
        :departments="departments"
        :incidentTypes="incidentTypes"
        :technicalTeam="technicalTeam"
        @close="showNewIncidentModal = false; showEditIncidentModal = false; selectedIncident = null"
        @saved="handleIncidentSaved"
      />
      <DeleteIncidentModal
        :isOpen="showDeleteIncidentModal"
        :incident="selectedIncident"
        @close="showDeleteIncidentModal = false; selectedIncident = null"
        @deleted="handleIncidentDeleted"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import IncidentModal from '@/components/incidents/IncidentModal.vue';
import DeleteIncidentModal from '@/components/incidents/DeleteIncidentModal.vue';
import { formatDate } from '@/utils/incidents.js';

// Iconos para tarjetas de prioridad
const IconCritical = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
};
const IconHigh = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m4 0h-1v4h-1M12 8v.01"/></svg>'
};
const IconMedium = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"/></svg>'
};
const IconLow = {
  template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2"/></svg>'
};

const priorities = [
  { key: 'critico', label: 'Crítico', badgeClass: 'bg-red-100 text-red-700', cardClass: 'bg-gradient-to-br from-red-50 to-white border border-red-200', icon: IconCritical, iconBg: 'bg-red-100 text-red-700' },
  { key: 'alto', label: 'Alto', badgeClass: 'bg-orange-100 text-orange-700', cardClass: 'bg-gradient-to-br from-orange-50 to-white border border-orange-200', icon: IconHigh, iconBg: 'bg-orange-100 text-orange-700' },
  { key: 'medio', label: 'Medio', badgeClass: 'bg-yellow-100 text-yellow-700', cardClass: 'bg-gradient-to-br from-yellow-50 to-white border border-yellow-200', icon: IconMedium, iconBg: 'bg-yellow-100 text-yellow-700' },
  { key: 'bajo', label: 'Bajo', badgeClass: 'bg-green-100 text-green-700', cardClass: 'bg-gradient-to-br from-green-50 to-white border border-green-200', icon: IconLow, iconBg: 'bg-green-100 text-green-700' },
];
const incidentSummary = ref({});
const searchTerm = ref('');
const filters = ref({ status: '', priority: '', department: '', type: '' });
const incidentStatuses = ['Abierto', 'En Proceso', 'Resuelto', 'Cerrado'];
const departments = ref([]); // Cargar desde API
const incidentTypes = ref([]); // Cargar desde API
const technicalTeam = ref([]); // Cargar desde API
const incidents = ref([]); // Cargar desde API
const loading = ref(false);
const pagination = ref({ page: 1, total: 0 });
const totalPages = ref(1);
const tableColumns = [
  { key: 'title', label: 'Título' },
  { key: 'priority', label: 'Prioridad' },
  { key: 'department', label: 'Departamento Afectado' },
  { key: 'reportedBy', label: 'Reportado Por' },
  { key: 'date', label: 'Fecha' },
  { key: 'status', label: 'Estado' },
];
const showNewIncidentModal = ref(false);
const showEditIncidentModal = ref(false);
const showDeleteIncidentModal = ref(false);
const selectedIncident = ref(null);

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
  // Aquí deberías cargar los incidentes y el resumen desde tu backend
  refreshData();
});

const activeFilters = computed(() => {
  const chips = [];
  if (filters.value.status) chips.push({ label: `Estado: ${filters.value.status}`, clear: () => { filters.value.status = ''; refreshData(); } });
  if (filters.value.priority) chips.push({ label: `Prioridad: ${priorities.find(p => p.key === filters.value.priority)?.label || filters.value.priority}`, clear: () => { filters.value.priority = ''; refreshData(); } });
  if (filters.value.department) chips.push({ label: `Departamento: ${getDepartmentName(filters.value.department)}`, clear: () => { filters.value.department = ''; refreshData(); } });
  if (filters.value.type) chips.push({ label: `Tipo: ${filters.value.type}`, clear: () => { filters.value.type = ''; refreshData(); } });
  return chips;
});

function openNewIncidentModal() {
  selectedIncident.value = null;
  showNewIncidentModal.value = true;
}
function openEditIncidentModal(incident) {
  selectedIncident.value = incident;
  showEditIncidentModal.value = true;
}
function openDeleteIncidentModal(incident) {
  selectedIncident.value = incident;
  showDeleteIncidentModal.value = true;
}
function handleIncidentSaved(incident) {
  // Si el incidente tiene id, es edición (aquí solo refrescamos)
  if (incident.id) {
    refreshData();
    return;
  }
  // Si es nuevo, le asignamos un id único (por ejemplo, timestamp)
  const newIncident = {
    ...incident,
    id: Date.now(),
    date: new Date().toISOString(), // Fecha actual
    status: 'Abierto', // Estado inicial
    reportedBy: 'Usuario Demo' // Puedes cambiar esto por el usuario real si lo tienes
  };
  incidents.value.unshift(newIncident); // Lo agregamos al principio
  pagination.value.total = incidents.value.length;
  refreshData(); // Opcional: si quieres refrescar otros datos
}
function handleIncidentDeleted(incident) {
  // Aquí iría la lógica para eliminar en el backend
  refreshData();
}
function handleSearch() { /* Filtrar incidentes por término */ }
function applyFilters() { /* Filtrar incidentes por filtros */ }
function clearFilters() {
  filters.value = { status: '', priority: '', department: '', type: '' };
  loading.value = true;
  setTimeout(() => {
    // Aquí iría la recarga real desde backend
    loading.value = false;
  }, 1000);
}
function refreshData() {
  loading.value = true;
  setTimeout(() => {
    // Aquí iría la recarga real desde backend
    loading.value = false;
  }, 1000);
}
function prevPage() { if (pagination.value.page > 1) { pagination.value.page--; refreshData(); } }
function nextPage() { if (pagination.value.page < totalPages.value) { pagination.value.page++; refreshData(); } }
function assignIncident(incident) { /* Lógica para asignar técnico */ }
function viewIncident(incident) { /* Navegar a detalle */ }
function getPriorityBadgeClass(priority) { return 'px-2 py-1 rounded-full text-xs font-semibold ' + (priorities.find(p => p.key === priority)?.badgeClass || 'bg-gray-100 text-gray-700'); }
function getPriorityLabel(priority) { return priorities.find(p => p.key === priority)?.label || priority; }
function getDepartmentName(id) { return departments.value.find(d => d.id === id)?.name || id; }
function getUserName(id) { return id; }
function getTechStatusClass(status) { return status === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'; }
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