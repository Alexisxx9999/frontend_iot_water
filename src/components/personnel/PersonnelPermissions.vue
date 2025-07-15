<template>
  <div class="space-y-8">
    <!-- Permisos del Sistema -->
    <div>
      <h4 class="text-lg font-medium text-gray-900 mb-4">Permisos del Sistema</h4>
      <div class="space-y-3">
        <div v-for="perm in permissions" :key="perm.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-700">{{ perm.label }}</span>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="perm.enabled">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:bg-primary-600 transition-all duration-200"></div>
            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-200" :class="perm.enabled ? 'translate-x-5' : ''"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Habilidades Técnicas -->
    <div>
      <h4 class="text-lg font-medium text-gray-900 mb-4">Habilidades Técnicas</h4>
      <div class="flex flex-wrap gap-2">
        <span v-for="skill in skills" :key="skill" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- Nivel de Acceso -->
    <div>
      <h4 class="text-lg font-medium text-gray-900 mb-2">Nivel de Acceso</h4>
      <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div class="bg-primary-500 h-2 rounded-full transition-all duration-300" :style="{ width: accessLevel + '%' }"></div>
      </div>
      <div class="text-xs text-gray-500">Nivel de acceso basado en permisos asignados</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  permissions: {
    type: Array,
    default: () => [
      { id: 'dashboardAccess', label: 'Acceso al Dashboard', enabled: true },
      { id: 'reportsAccess', label: 'Generar Reportes', enabled: true },
      { id: 'settingsAccess', label: 'Configuración del Sistema', enabled: false },
      { id: 'userManagement', label: 'Gestión de Usuarios', enabled: false },
      { id: 'technicalAccess', label: 'Acceso Técnico', enabled: true }
    ]
  },
  skills: {
    type: Array,
    default: () => ['JavaScript', 'Python', 'SQL', 'AWS', 'Docker', 'Análisis de Datos']
  }
});

const accessLevel = computed(() => {
  const enabledCount = props.permissions.filter(p => p.enabled).length;
  return Math.round((enabledCount / props.permissions.length) * 100);
});
</script>

<style scoped>
/* Switch estilo tailwind */
label.inline-flex {
  position: relative;
  width: 44px;
  height: 24px;
}
input[type="checkbox"].peer {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 9999px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}
.translate-x-5 {
  transform: translateX(20px);
}
</style> 