<template>
  <div class="w-full lg:w-96 flex-shrink-0 space-y-6">
    <!-- Equipo Técnico -->
    <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <slot name="team-icon" />
        </div>
        <h3 class="font-bold text-gray-900">Equipo Técnico Disponible</h3>
      </div>
      <div class="space-y-3">
        <div 
          v-for="tech in team" 
          :key="tech.IdUsuario" 
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <img :src="tech.avatar" alt="avatar" class="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
          <div class="flex-1">
            <div class="font-medium text-gray-800">{{ tech.nombre }}</div>
            <div class="text-xs text-gray-500">{{ tech.Especialidad }}</div>
          </div>
          <span 
            class="status-badge" 
            :class="tech.EstadoDisponibilidad === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
          >
            {{ tech.EstadoDisponibilidad }}
          </span>
        </div>
      </div>
      <button 
        class="btn btn-xs btn-outline-primary w-full mt-4" 
        @click="$emit('assign-personnel')"
      >
        Asignar Personal
      </button>
    </div>

    <!-- Notificaciones -->
    <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <slot name="notifications-icon" />
        </div>
        <h3 class="font-bold text-gray-900">Notificaciones</h3>
      </div>
      <div class="space-y-3 mb-4">
        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <input 
            type="checkbox" 
            :checked="notificationSettings.notificarUsuarioReporta"
            @change="$emit('update:notificationSettings', { ...notificationSettings, notificarUsuarioReporta: $event.target.checked })"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span class="text-sm text-gray-700">Usuario que reportó</span>
        </label>
        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <input 
            type="checkbox" 
            :checked="notificationSettings.notificarEquipoTecnico"
            @change="$emit('update:notificationSettings', { ...notificationSettings, notificarEquipoTecnico: $event.target.checked })"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span class="text-sm text-gray-700">Equipo técnico</span>
        </label>
        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <input 
            type="checkbox" 
            :checked="notificationSettings.notificarSupervisores"
            @change="$emit('update:notificationSettings', { ...notificationSettings, notificarSupervisores: $event.target.checked })"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span class="text-sm text-gray-700">Supervisores</span>
        </label>
      </div>
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Mensaje personalizado</label>
        <textarea 
          :value="notificationSettings.mensajeNotificacion"
          @input="$emit('update:notificationSettings', { ...notificationSettings, mensajeNotificacion: $event.target.value })"
          class="input" 
          rows="2" 
          placeholder="Agregue un mensaje adicional..."
        ></textarea>
      </div>
      <button 
        class="btn btn-xs btn-primary w-full" 
        @click="$emit('send-notifications')"
      >
        Enviar Notificaciones
      </button>
    </div>

    <!-- Bitácora -->
    <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <slot name="logbook-icon" />
        </div>
        <h3 class="font-bold text-gray-900">Bitácora del Caso</h3>
      </div>
      <div class="space-y-3 mb-4 max-h-48 overflow-y-auto">
        <div 
          v-for="log in logbook" 
          :key="log.IdBitacora" 
          class="flex gap-3 items-start p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <span 
            class="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" 
            :class="logDotClass(log.TipoAccion)"
          ></span>
          <div class="flex-1">
            <div class="font-medium text-gray-800 text-xs">
              {{ log.TipoAccion }} 
              <span class="text-gray-400">- {{ formatDate(log.Timestamp) }}</span>
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ log.Descripcion }}</div>
          </div>
        </div>
        <div v-if="logbook.length === 0" class="text-gray-400 text-xs text-center py-4">
          No hay entradas en la bitácora.
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Agregar entrada</label>
        <textarea 
          :value="newLogEntry"
          @input="$emit('update:newLogEntry', $event.target.value)"
          class="input" 
          rows="2" 
          placeholder="Registre actualizaciones o comentarios..."
        ></textarea>
      </div>
      <button 
        class="btn btn-xs btn-outline-primary w-full" 
        @click="$emit('add-log-entry')"
      >
        Agregar a Bitácora
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  team: {
    type: Array,
    default: () => []
  },
  notificationSettings: {
    type: Object,
    default: () => ({
      notificarUsuarioReporta: true,
      notificarEquipoTecnico: true,
      notificarSupervisores: false,
      mensajeNotificacion: ''
    })
  },
  logbook: {
    type: Array,
    default: () => []
  },
  newLogEntry: {
    type: String,
    default: ''
  }
});

// Métodos auxiliares
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
}

function logDotClass(tipo) {
  return {
    'bg-blue-400': tipo === 'Reporte',
    'bg-red-400': tipo === 'CambioPrioridad',
    'bg-green-400': tipo === 'Asignacion',
    'bg-gray-400': tipo === 'Comentario',
    'bg-yellow-400': tipo === 'Resolucion',
  };
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

.btn-primary {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1);
}

.btn-primary:hover {
  background: linear-gradient(to right, #1d4ed8, #1e40af);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.05);
}

.btn-primary:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
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
</style> 