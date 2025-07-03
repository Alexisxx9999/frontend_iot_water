<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
            <p class="mt-1 text-sm text-gray-500">
              Administra y gestiona todos los usuarios y equipos del sistema
            </p>
            <p class="mt-1 text-sm text-blue-600 font-medium">
              {{ store.totalItems }} empleado{{ store.totalItems !== 1 ? 's' : '' }} registrado{{ store.totalItems !== 1 ? 's' : '' }}
            </p>
          </div>
          <button
            @click="openNewPersonnelModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Empleado
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              id="search"
              v-model="filters.search"
              placeholder="Nombre, ID o Email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              @input="handleSearch"
            />
          </div>

          <div class="form-group">
            <label for="department" class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select
              id="department"
              v-model="filters.department"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              @change="handleFilters"
            >
              <option value="">Todos</option>
              <option v-for="dept in departments" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              id="role"
              v-model="filters.role"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              @change="handleFilters"
            >
              <option value="">Todos</option>
              <option v-for="role in store.roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select
              id="sortBy"
              v-model="filters.sortBy"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              @change="handleFilters"
            >
              <option value="">Sin orden</option>
              <option value="employeeId">ID Empleado</option>
              <option value="firstName">Nombre</option>
              <option value="department">Departamento</option>
              <option value="position">Posición</option>
              <option value="startDate">Antigüedad</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button 
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            @click="clearFilters"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Limpiar Filtros
          </button>
          <button 
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            @click="refreshData"
            :disabled="isLoading"
          >
            <svg 
              class="w-4 h-4 mr-2" 
              :class="{ 'animate-spin': isLoading }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>
      </div>

      <!-- Mensaje de feedback -->
      <div v-if="showFeedback" class="mb-4">
        <div :class="[
          'rounded-md p-4',
          feedbackType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        ]">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg v-if="feedbackType === 'success'" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm">{{ feedbackMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="header in tableHeaders"
                  :key="header.value"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  @click="sortBy(header.value)"
                >
                  {{ header.text }}
                  <span v-if="filters.sortBy === header.value" class="ml-1">
                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="store.loading" class="hover:bg-gray-50">
                <td colspan="8" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-8 h-8 text-blue-600 animate-spin mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <p class="text-gray-500">Cargando empleados...</p>
                  </div>
                </td>
              </tr>
              <tr v-else-if="personnel.length === 0" class="hover:bg-gray-50">
                <td colspan="8" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No hay empleados registrados</h3>
                    <p class="text-gray-500 mb-4">Comienza agregando el primer empleado a tu sistema</p>
                    <button
                      @click="openNewPersonnelModal"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Agregar Primer Empleado
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-for="person in personnel" :key="person.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ person.employeeId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ person.firstName }} {{ person.lastName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ person.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ person.department }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ person.position }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(person.startDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(person.status)">
                    {{ getStatusText(person.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    @click="viewDetails(person)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Ver
                  </button>
                  <button
                    @click="editPerson(person)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-700">
              Mostrando {{ paginationText }}
            </div>
            <div class="flex space-x-2">
              <button
                @click="previousPage"
                :disabled="filters.page === 1"
                class="btn btn-secondary"
                :class="{ 'opacity-50 cursor-not-allowed': filters.page === 1 }"
              >
                Anterior
              </button>
              <button
                @click="nextPage"
                :disabled="filters.page >= totalPages"
                class="btn btn-secondary"
                :class="{ 'opacity-50 cursor-not-allowed': filters.page >= totalPages }"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nuevo/Editar Personal -->
    <NewPersonnelModal
      v-if="showPersonnelModal"
      :is-editing="!!selectedPerson"
      :user-data="selectedPerson"
      @close="closePersonnelModal"
      @refresh="refreshData"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePersonnelStore } from '@/stores/personnel';
import NewPersonnelModal from '@/components/personnel/NewPersonnelModal.vue';

export default {
  name: 'PersonnelListPage',
  components: {
    NewPersonnelModal
  },

  setup() {
    const router = useRouter();
    const store = usePersonnelStore();
    const showPersonnelModal = ref(false);
    const selectedPerson = ref(null);
    const isLoading = ref(false);
    const showFeedback = ref(false);
    const feedbackMessage = ref('');
    const feedbackType = ref('success');
    const feedbackTimeout = ref(null);

    const departments = computed(() => store.departments);

    const filters = ref({
      page: 1,
      limit: 10,
      search: '',
      department: '',
      role: '',
      sortBy: '',
      sortOrder: 'asc'
    });

    const tableHeaders = [
      { text: 'ID', value: 'employeeId' },
      { text: 'Nombre', value: 'firstName' },
      { text: 'Email', value: 'email' },
      { text: 'Departamento', value: 'department' },
      { text: 'Posición', value: 'position' },
      { text: 'Fecha Inicio', value: 'startDate' },
      { text: 'Estado', value: 'status' }
    ];

    const personnel = computed(() => store.getPersonnelList);
    const totalPages = computed(() => store.getTotalPages);

    const showFeedbackMessage = (message, type = 'success') => {
      if (feedbackTimeout.value) clearTimeout(feedbackTimeout.value);
      feedbackMessage.value = message;
      feedbackType.value = type;
      showFeedback.value = true;
      feedbackTimeout.value = setTimeout(() => {
        showFeedback.value = false;
      }, 3000);
    };

    const clearFilters = () => {
      filters.value = {
        page: 1,
        limit: 10,
        search: '',
        department: '',
        role: '',
        sortBy: '',
        sortOrder: 'asc'
      };
      store.setFilters(filters.value);
      showFeedbackMessage('Filtros limpiados correctamente');
    };

    const refreshData = async () => {
      try {
        isLoading.value = true;
        await store.fetchPersonnel();
        showFeedbackMessage('Datos actualizados correctamente');
      } catch (error) {
        showFeedbackMessage('Error al actualizar los datos', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const handleSearch = () => {
      filters.value.page = 1;
      store.setFilters(filters.value);
    };

    const handleFilters = () => {
      filters.value.page = 1;
      store.setFilters(filters.value);
    };

    const sortBy = (column) => {
      if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        filters.value.sortBy = column;
        filters.value.sortOrder = 'asc';
      }
      store.setFilters(filters.value);
    };

    const previousPage = () => {
      if (filters.value.page > 1) {
        filters.value.page--;
        store.setFilters(filters.value);
      }
    };

    const nextPage = () => {
      if (filters.value.page < totalPages.value) {
        filters.value.page++;
        store.setFilters(filters.value);
      }
    };

    const paginationText = computed(() => {
      const start = (filters.value.page - 1) * filters.value.limit + 1;
      const end = Math.min(start + filters.value.limit - 1, store.totalItems);
      return `${start}-${end} de ${store.totalItems}`;
    });

    const getStatusClass = (status) => {
      const classes = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      };
      return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[status] || ''}`;
    };

    const getStatusText = (status) => {
      const texts = {
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente'
      };
      return texts[status] || status;
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const openNewPersonnelModal = () => {
      selectedPerson.value = null;
      showPersonnelModal.value = true;
    };

    const closePersonnelModal = () => {
      showPersonnelModal.value = false;
      selectedPerson.value = null;
    };

    const viewDetails = (person) => {
      try {
        // Mostrar feedback de navegación
        showFeedbackMessage(`Navegando al perfil de ${person.firstName} ${person.lastName}...`, 'success');
        router.push(`/app/personnel/${person.id}`);
      } catch (error) {
        showFeedbackMessage('Error al navegar al detalle del empleado', 'error');
      }
    };

    const editPerson = (person) => {
      selectedPerson.value = person;
      showPersonnelModal.value = true;
    };

    onMounted(() => {
      store.fetchPersonnel();
    });

    return {
      store,
      showPersonnelModal,
      selectedPerson,
      departments,
      filters,
      tableHeaders,
      personnel,
      totalPages,
      isLoading,
      showFeedback,
      feedbackMessage,
      feedbackType,
      clearFilters,
      refreshData,
      handleSearch,
      handleFilters,
      sortBy,
      previousPage,
      nextPage,
      paginationText,
      getStatusClass,
      getStatusText,
      formatDate,
      openNewPersonnelModal,
      closePersonnelModal,
      viewDetails,
      editPerson
    };
  }
}
</script>

<style scoped>
.form-group {
  @apply flex flex-col;
}

.form-input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}

.btn {
  @apply inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition;
}

.btn-secondary {
  @apply border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500;
}
</style>