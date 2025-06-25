<template>
  <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <slot name="header-icon" />
        </div>
        <h3 class="text-xl font-bold text-gray-900">Incidentes Reportados</h3>
      </div>
      <div class="flex items-center space-x-3 mt-4 md:mt-0">
        <div class="relative">
          <input 
            type="text" 
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            placeholder="Buscar incidente..." 
            class="input pl-10 pr-4 py-3 w-64" 
          />
          <slot name="search-icon" />
        </div>
        <button class="btn btn-light p-3" title="Filtrar">
          <slot name="filter-icon" />
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <nav class="flex space-x-2 mb-6 overflow-x-auto pb-2">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab-button', { 'active': activeTab === tab.value }]"
        @click="$emit('set-active-tab', tab.value)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Lista de incidentes -->
    <div class="incident-list space-y-4">
      <div 
        v-for="incident in incidents" 
        :key="incident.IdIncidente" 
        class="incident-item bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
        @click="$emit('select-incident', incident)"
      >
        <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div class="flex-1">
            <h4 class="font-bold text-gray-900 text-lg mb-2">{{ incident.Titulo }}</h4>
            <p class="text-gray-700 mb-3 line-clamp-2">{{ incident.DescripcionDetallada }}</p>
          </div>
          <span class="incident-date text-xs text-gray-400 mt-2 md:mt-0">{{ formatDate(incident.FechaReporte) }}</span>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="status-badge" :class="priorityClass(incident.Prioridad)">
            {{ incident.Prioridad }}
          </span>
          <span class="status-badge" :class="statusClass(incident.EstadoIncidente)">
            {{ incident.EstadoIncidente }}
          </span>
          <span class="status-badge bg-blue-100 text-blue-700">
            {{ incident.DepartamentoAfectado }}
          </span>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span v-for="tag in incident.Tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>Reportado por: {{ getUserName(incident.IdUsuarioReporta) }}</span>
            <span v-if="incident.IdTecnicoAsignado" class="text-green-700">
              Asignado a: {{ getUserName(incident.IdTecnicoAsignado) }}
            </span>
          </div>
          <div class="flex gap-2">
            <button 
              class="btn btn-xs btn-outline-primary" 
              @click.stop="$emit('select-incident', incident)"
            >
              Ver Detalles
            </button>
            <button 
              v-if="incident.EstadoIncidente === 'Nuevo'" 
              class="btn btn-xs btn-success" 
              @click.stop="$emit('assign-technician', incident)"
            >
              Asignar Técnico
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="incidents.length === 0" class="text-center text-gray-400 py-12">
        <slot name="empty-state-icon" />
        <p class="text-lg font-medium">No hay incidentes para mostrar</p>
        <p class="text-sm">Intenta ajustar los filtros o crear un nuevo reporte</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  incidents: {
    type: Array,
    default: () => []
  },
  tabs: {
    type: Array,
    default: () => [
      { value: 'all', label: 'Todos' },
      { value: 'new', label: 'Nuevos' },
      { value: 'assigned', label: 'Asignados' },
      { value: 'in-progress', label: 'En Progreso' },
      { value: 'resolved', label: 'Resueltos' }
    ]
  },
  activeTab: {
    type: String,
    default: 'all'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  users: {
    type: Array,
    default: () => []
  }
});

// Métodos auxiliares
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
}

function priorityClass(priority) {
  return {
    'bg-red-100 text-red-700': priority === 'Crítico',
    'bg-orange-100 text-orange-700': priority === 'Alto',
    'bg-yellow-100 text-yellow-700': priority === 'Medio',
    'bg-green-100 text-green-700': priority === 'Bajo',
  };
}

function statusClass(status) {
  return {
    'bg-gray-200 text-gray-700': status === 'Nuevo',
    'bg-blue-100 text-blue-700': status === 'Asignado',
    'bg-yellow-100 text-yellow-700': status === 'En Progreso',
    'bg-green-100 text-green-700': status === 'Resuelto',
    'bg-gray-300 text-gray-800': status === 'Cerrado',
  };
}

function getUserName(id) {
  const user = props.users.find(u => u.IdUsuario === id);
  return user ? user.nombre : 'Desconocido';
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.2s;
  outline: none;
}

.btn:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-light {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-light:hover {
  background-color: #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-outline-primary {
  border: 1px solid #3b82f6;
  color: #2563eb;
  background-color: white;
}

.btn-outline-primary:hover {
  background-color: #eff6ff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-success {
  background: linear-gradient(to right, #10b981, #059669);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(to right, #059669, #047857);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-xs {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
}

.input {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.input::placeholder {
  color: #9ca3af;
}

.input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  border-color: #3b82f6;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tag {
  background-color: #dbeafe;
  color: #1d4ed8;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tab-button {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: #f3f4f6;
  color: #374151;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover {
  background-color: #eff6ff;
}

.tab-button.active {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

/* Scrollbar personalizado */
.incident-list::-webkit-scrollbar {
  width: 6px;
}

.incident-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.incident-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.incident-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 