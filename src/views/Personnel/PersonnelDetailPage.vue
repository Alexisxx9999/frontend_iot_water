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
          <button
            @click="toggleUserStatus"
            :class="[
              'px-4 py-2 rounded-md font-medium transition-colors duration-200',
              user.status === 'active' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            ]"
            :disabled="updatingStatus"
          >
            <svg v-if="updatingStatus" class="w-4 h-4 mr-2 animate-spin inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
            </svg>
            {{ user.status === 'active' ? 'Desactivar' : 'Activar' }} Usuario
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
            <div>
              <label class="block text-sm font-medium text-gray-500">Estado</label>
              <div class="mt-1 flex items-center">
                <span :class="getStatusClass(user.status)">{{ getStatusText(user.status) }}</span>
                <button
                  @click="toggleUserStatus"
                  class="ml-2 text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  :title="user.status === 'active' ? 'Hacer clic para desactivar' : 'Hacer clic para activar'"
                >
                  Cambiar
                </button>
              </div>
            </div>
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
            <h2 class="text-lg font-semibold text-gray-900">Roles y Permisos</h2>
            <button @click="showRolesModal = true" class="text-blue-600 hover:text-blue-800 text-sm">Gestionar Roles</button>
          </div>
          
          <!-- Roles Asignados -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Roles Asignados</h3>
            <div class="space-y-2">
              <div v-for="role in user.roles" :key="role.id" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                <span class="font-medium">{{ role.name }}</span>
                <button
                  @click="removeRole(role.id)"
                  class="text-red-600 hover:text-red-800 text-xs"
                  title="Remover rol"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div v-if="user.roles.length === 0" class="text-sm text-gray-400 italic">
                Sin roles asignados
              </div>
            </div>
          </div>

          <!-- Permisos Derivados -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Permisos Derivados</h3>
            <div class="space-y-1">
              <div v-for="permission in userPermissions" :key="permission.id" class="flex items-center text-sm">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ permission.name }}</span>
              </div>
              <div v-if="userPermissions.length === 0" class="text-sm text-gray-400 italic">
                Sin permisos asignados
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

    <!-- Modal de confirmación de cambio de estado -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-900">
              Confirmar cambio de estado
            </h3>
          </div>
        </div>
        <div class="mb-6">
          <p class="text-sm text-gray-500">
            ¿Estás seguro de que quieres 
            <span class="font-medium text-gray-900">
              {{ user.status === 'active' ? 'desactivar' : 'activar' }}
            </span> 
            al usuario 
            <span class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</span>?
          </p>
          <p v-if="user.status === 'active'" class="text-sm text-red-600 mt-2">
            El usuario no podrá acceder al sistema hasta que sea reactivado.
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showStatusModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            @click="confirmStatusChange" 
            :class="[
              'px-4 py-2 rounded-md font-medium',
              user.status === 'active' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            ]"
            :disabled="updatingStatus"
          >
            {{ updatingStatus ? 'Procesando...' : 'Confirmar' }}
          </button>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePersonnelStore } from '@/stores/personnel';
import NewPersonnelModal from '@/components/personnel/NewPersonnelModal.vue';

const route = useRoute();
const router = useRouter();
const personnelStore = usePersonnelStore();

const showRolesModal = ref(false);
const showEditModal = ref(false);
const showStatusModal = ref(false);
const selectedRoles = ref([]);
const savingRoles = ref(false);
const updatingStatus = ref(false);

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

const userPermissions = computed(() => {
  if (!user.value) return [];
  const allPermissions = [];
  user.value.roles.forEach(role => {
    const rolePermissions = getPermissionsByRole(role.id);
    rolePermissions.forEach(permission => {
      if (!allPermissions.find(p => p.id === permission.id)) {
        allPermissions.push(permission);
      }
    });
  });
  return allPermissions;
});

function getPermissionsByRole(roleId) {
  // Mapeo de roles a permisos (simulado)
  const rolePermissions = {
    1: [1, 6, 8], // Usuario: ver usuarios, ver CRM, ver reportes
    2: [1, 2, 3, 4, 5], // RRHH: todos los permisos de usuarios
    3: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Administrador: todos los permisos
    4: [1, 6, 7], // CRM: ver usuarios, ver CRM, gestionar CRM
    5: [1, 2, 3, 6, 7, 8], // Supervisor: ver/crear/editar usuarios, CRM, reportes
    6: [1, 6], // Técnico: ver usuarios, ver CRM
    7: [6, 8] // Invitado: ver CRM, ver reportes
  };
  
  const permissions = [
    { id: 1, name: 'Ver usuarios' },
    { id: 2, name: 'Crear usuarios' },
    { id: 3, name: 'Editar usuarios' },
    { id: 4, name: 'Eliminar usuarios' },
    { id: 5, name: 'Gestionar roles' },
    { id: 6, name: 'Ver CRM' },
    { id: 7, name: 'Gestionar CRM' },
    { id: 8, name: 'Ver reportes' },
    { id: 9, name: 'Gestionar sistema' }
  ];
  
  const permissionIds = rolePermissions[roleId] || [];
  return permissions.filter(p => permissionIds.includes(p.id));
}

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
async function handlePrint() {
  try {
    const profileData = await personnelStore.exportUserProfile(user.value.id);
    
    // Crear contenido para impresión
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Perfil de Usuario</h1>
        <h2>${profileData.user.firstName} ${profileData.user.lastName}</h2>
        <p><strong>ID:</strong> ${profileData.user.employeeId}</p>
        <p><strong>Email:</strong> ${profileData.user.email}</p>
        <p><strong>Departamento:</strong> ${profileData.user.department}</p>
        <p><strong>Posición:</strong> ${profileData.user.position}</p>
        <p><strong>Estado:</strong> ${getStatusText(profileData.user.status)}</p>
        <p><strong>Fecha de exportación:</strong> ${profileData.exportDate.toLocaleString()}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    showStatusMessage('Reporte generado correctamente', 'success');
  } catch (error) {
    showStatusMessage('Error al generar reporte', 'error');
  }
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
  
  try {
    savingRoles.value = true;
    personnelStore.updateUserRoles(user.value.id, selectedRoles.value);
    showRolesModal.value = false;
    showStatusMessage('Roles actualizados correctamente', 'success');
  } catch (error) {
    showStatusMessage('Error al actualizar roles', 'error');
  } finally {
    savingRoles.value = false;
  }
}

function removeRole(roleId) {
  if (!user.value) return;
  const newRoles = selectedRoles.value.filter(id => id !== roleId);
  selectedRoles.value = newRoles;
  saveRoles();
}

function showStatusMessage(message, type = 'success') {
  // Crear un elemento temporal para mostrar el mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
    type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
  }`;
  messageDiv.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
          type === 'success' 
            ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' 
            : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        }"></path>
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(messageDiv);
  
  // Remover el mensaje después de 3 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

function toggleUserStatus() {
  if (!user.value) return;
  showStatusModal.value = true;
}

async function confirmStatusChange() {
  if (!user.value) return;
  
  try {
    updatingStatus.value = true;
    const newStatus = user.value.status === 'active' ? 'inactive' : 'active';
    
    // Actualizar en el store
    await personnelStore.updateUserStatus(user.value.id, newStatus);
    
    // Actualizar el estado local
    user.value.status = newStatus;
    
    // Agregar al historial de actividad
    const action = newStatus === 'active' ? 'Usuario activado' : 'Usuario desactivado';
    const details = newStatus === 'active' 
      ? 'El usuario ha sido reactivado en el sistema' 
      : 'El usuario ha sido desactivado del sistema';
    
    activityHistory.value.unshift({
      id: Date.now(),
      action: action,
      details: details,
      timestamp: new Date()
    });
    
    // Cerrar modal
    showStatusModal.value = false;
    
    const statusText = newStatus === 'active' ? 'activado' : 'desactivado';
    showStatusMessage(`Usuario ${statusText} correctamente`, 'success');
    
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    showStatusMessage('Error al cambiar el estado del usuario', 'error');
  } finally {
    updatingStatus.value = false;
  }
}

function goBack() {
  router.push('/app/personnel');
}

onMounted(() => {
  if (user.value) {
    selectedRoles.value = user.value.roles.map(r => r.id);
  }
});

// Actualizar roles seleccionados cuando cambie el usuario
watch(() => user.value, (newUser) => {
  if (newUser) {
    selectedRoles.value = newUser.roles.map(r => r.id);
  }
}, { immediate: true });
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
