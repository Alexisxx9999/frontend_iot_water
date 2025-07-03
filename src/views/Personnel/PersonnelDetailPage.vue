<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-4">
      <button @click="goBack" class="btn btn-secondary mr-4">
        ← Regresar
      </button>
    </div>
    <div v-if="!user" class="text-center text-gray-500">
      Usuario no encontrado
    </div>
    <div v-else>
      <!-- Header -->
      <div class="mb-6 flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ user.firstName }} {{ user.lastName }}</h1>
          <p class="text-gray-500">ID: {{ user.employeeId }}</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="handlePrint"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Imprimir Perfil
          </button>
          <button
            @click="editUser"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Editar Usuario
          </button>
        </div>
      </div>

      <!-- Grid de información -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Información Personal -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
          <div class="space-y-4">
            <div><label class="block text-sm font-medium text-gray-500">Email</label><p class="mt-1">{{ user.email }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Departamento</label><p class="mt-1">{{ user.department }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Posición</label><p class="mt-1">{{ user.position }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Estado</label><p class="mt-1"><span :class="getStatusClass(user.status)">{{ getStatusText(user.status) }}</span></p></div>
            <div><label class="block text-sm font-medium text-gray-500">Antigüedad</label><p class="mt-1">{{ getSeniority(user.startDate) }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Teléfono</label><p class="mt-1">{{ user.phone }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">DNI</label><p class="mt-1">{{ user.dni }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Fecha de Nacimiento</label><p class="mt-1">{{ user.birthDate }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Dirección</label><p class="mt-1">{{ user.address }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Tipo de Contrato</label><p class="mt-1">{{ getContractType(user.contractType) }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Salario</label><p class="mt-1">{{ user.salary }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Jornada</label><p class="mt-1">{{ getSchedule(user.schedule) }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Experiencia</label><p class="mt-1">{{ user.experience }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Habilidades</label><p class="mt-1">{{ user.skills }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Certificaciones</label><p class="mt-1">{{ user.certifications }}</p></div>
            <div><label class="block text-sm font-medium text-gray-500">Observaciones</label><p class="mt-1">{{ user.observations }}</p></div>
          </div>
        </div>

        <!-- Roles y Permisos -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Roles</h2>
            <button @click="showRolesModal = true" class="text-blue-600 hover:text-blue-800 text-sm">Gestionar Roles</button>
          </div>
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Roles Asignados</h3>
            <div class="space-y-2">
              <div v-for="role in user.roles" :key="role.id" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                <span>{{ role.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial de Actividad -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Historial de Actividad</h2>
          <div class="space-y-4">
            <div v-for="activity in activityHistory" :key="activity.id" class="border-b pb-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
                  <p class="text-sm text-gray-500">{{ activity.details }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Interacción (mock) -->
        <div v-if="isCrmAgent" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Métricas de Interacción</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg"><p class="text-sm text-gray-500">Casos Resueltos</p><p class="text-2xl font-semibold text-gray-900">{{ interactionMetrics.casosResueltos }}</p></div>
            <div class="bg-gray-50 p-4 rounded-lg"><p class="text-sm text-gray-500">Tiempo Promedio</p><p class="text-2xl font-semibold text-gray-900">{{ interactionMetrics.tiempoPromedio }}</p></div>
            <div class="bg-gray-50 p-4 rounded-lg"><p class="text-sm text-gray-500">Satisfacción</p><p class="text-2xl font-semibold text-gray-900">{{ interactionMetrics.satisfaccion }}</p></div>
            <div class="bg-gray-50 p-4 rounded-lg"><p class="text-sm text-gray-500">Casos Activos</p><p class="text-2xl font-semibold text-gray-900">{{ interactionMetrics.casosActivos }}</p></div>
          </div>
        </div>

        <!-- Contribuciones AI (mock) -->
        <div v-if="aiContributions.length" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contribuciones AI</h2>
          <div class="space-y-4">
            <div v-for="contribution in aiContributions" :key="contribution.id" class="border-b pb-4">
              <p class="text-sm font-medium text-gray-900">{{ contribution.type }}</p>
              <p class="text-sm text-gray-500">{{ contribution.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(contribution.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Roles -->
    <div v-if="showRolesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Gestionar Roles</h3>
          <button @click="showRolesModal = false" class="text-gray-500 hover:text-gray-700">
            <span class="sr-only">Cerrar</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="role in availableRoles" :key="role.id" class="flex items-center">
            <input
              type="checkbox"
              :id="'role-' + role.id"
              v-model="selectedRoles"
              :value="role.id"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label :for="'role-' + role.id" class="ml-2 block text-sm text-gray-900">
              {{ role.name }}
            </label>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showRolesModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancelar</button>
          <button @click="saveRoles" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" :disabled="savingRoles">{{ savingRoles ? 'Guardando...' : 'Guardar' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <NewPersonnelModal
      v-if="showEditModal"
      :is-editing="true"
      :user-data="user"
      @close="closeEditModal"
      @refresh="refreshUser"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePersonnelStore } from '@/stores/personnel';
import NewPersonnelModal from '@/components/personnel/NewPersonnelModal.vue';

const route = useRoute();
const router = useRouter();
const personnelStore = usePersonnelStore();

const showRolesModal = ref(false);
const showEditModal = ref(false);
const selectedRoles = ref([]);
const savingRoles = ref(false);

const user = computed(() => {
  const id = Number(route.params.id);
  return personnelStore.personnel.find(p => p.id === id);
});

const availableRoles = computed(() => personnelStore.roles);

const activityHistory = ref([
  { id: 1, action: 'Inicio de sesión', details: 'El usuario inició sesión en el sistema', timestamp: new Date() },
  { id: 2, action: 'Actualizó perfil', details: 'El usuario actualizó su información personal', timestamp: new Date() },
  { id: 3, action: 'Cambio de contraseña', details: 'El usuario cambió su contraseña', timestamp: new Date() }
]);

const interactionMetrics = ref({
  casosResueltos: 12,
  tiempoPromedio: '15m',
  satisfaccion: '95%',
  casosActivos: 2
});

const aiContributions = ref([
  { id: 1, type: 'Entrenamiento', description: 'Contribuyó con 50 frases para el modelo IA', date: new Date() },
  { id: 2, type: 'Validación', description: 'Validó 20 respuestas automáticas', date: new Date() }
]);

const isCrmAgent = computed(() => {
  return user.value && user.value.roles.some(role => role.name.toLowerCase().includes('rrhh') || role.name.toLowerCase().includes('crm'));
});

function getStatusClass(status) {
  const classes = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch ((status || '').toLowerCase()) {
    case 'active':
      return `${classes} bg-green-100 text-green-800`;
    case 'inactive':
      return `${classes} bg-red-100 text-red-800`;
    default:
      return `${classes} bg-yellow-100 text-yellow-800`;
  }
}
function getStatusText(status) {
  switch ((status || '').toLowerCase()) {
    case 'active': return 'Activo';
    case 'inactive': return 'Inactivo';
    default: return status;
  }
}
function getSeniority(startDate) {
  if (!startDate) return '';
  const start = new Date(startDate);
  const now = new Date();
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  return years > 0 ? `${years} años` : `${months} meses`;
}
function getContractType(type) {
  switch (type) {
    case 'FULL_TIME': return 'Tiempo Completo';
    case 'PART_TIME': return 'Medio Tiempo';
    case 'TEMPORARY': return 'Temporal';
    case 'CONTRACTOR': return 'Contratista';
    default: return type;
  }
}
function getSchedule(schedule) {
  switch (schedule) {
    case 'MORNING': return 'Mañana';
    case 'AFTERNOON': return 'Tarde';
    case 'NIGHT': return 'Noche';
    case 'ROTATING': return 'Rotativo';
    default: return schedule;
  }
}
function formatDate(date) {
  return new Date(date).toLocaleString();
}
function handlePrint() {
  window.print();
}
function editUser() {
  showEditModal.value = true;
}
function closeEditModal() {
  showEditModal.value = false;
}
function refreshUser() {
  // No hace falta recargar, el store ya está en memoria
}
function saveRoles() {
  if (!user.value) return;
  user.value.roles = availableRoles.value.filter(r => selectedRoles.value.includes(r.id));
  showRolesModal.value = false;
}

function goBack() {
  router.push('/app/personnel');
}

onMounted(() => {
  if (user.value) {
    selectedRoles.value = user.value.roles.map(r => r.id);
  }
});
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
.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
