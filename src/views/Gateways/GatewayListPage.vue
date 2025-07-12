<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gateways</h1>
            <p class="mt-2 text-sm text-gray-600">
              Administrar gateways del sistema IoT
            </p>
          </div>
          <router-link
            to="/app/gateways/create"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Gateway
          </router-link>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Buscador -->
            <div class="flex-1">
              <label for="search" class="sr-only">Buscar gateways</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  id="search"
                  v-model="searchTerm"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Buscar por código, dirección o estado..."
                />
              </div>
            </div>

            <!-- Filtro de estado -->
            <div class="sm:w-48">
              <select
                v-model="statusFilter"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gateway
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latitud
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Longitud
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Altitud
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Instalación
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última actividad
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="gateway in filteredGateways" :key="gateway.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ gateway.code }}</div>
                      <div v-if="gateway.description" class="text-sm text-gray-500">{{ gateway.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ gateway.address }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ gateway.latitude }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ gateway.longitude }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ gateway.altitude }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(gateway.installationDate, true) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': gateway.status === 'active',
                      'bg-red-100 text-red-800': gateway.status === 'inactive',
                      'bg-yellow-100 text-yellow-800': gateway.status === 'maintenance'
                    }"
                  >
                    {{ getStatusText(gateway.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(gateway.lastActivity) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <!-- Enviar datos -->
                    <button
                      v-if="gateway.dataUrl"
                      @click="sendData(gateway)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Enviar datos"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                      </svg>
                    </button>

                    <!-- Editar -->
                    <router-link
                      :to="`/app/gateways/${gateway.id}/edit`"
                      class="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </router-link>

                    <!-- Activar/Desactivar -->
                    <button
                      @click="toggleStatus(gateway)"
                      :class="{
                        'text-green-600 hover:text-green-900': gateway.status === 'inactive',
                        'text-red-600 hover:text-red-900': gateway.status === 'active'
                      }"
                      :title="gateway.status === 'active' ? 'Desactivar' : 'Activar'"
                    >
                      <svg v-if="gateway.status === 'active'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>

                    <!-- Eliminar -->
                    <button
                      @click="confirmDelete(gateway)"
                      class="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredGateways.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron gateways</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ searchTerm || statusFilter ? 'Intenta ajustar los filtros de búsqueda.' : 'Comienza creando tu primer gateway.' }}
          </p>
          <div class="mt-6">
            <router-link
              to="/app/gateways/create"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nuevo Gateway
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Confirmar eliminación</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              ¿Estás seguro de que quieres eliminar el gateway <strong>{{ gatewayToDelete?.code }}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="flex justify-center space-x-3 mt-4">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              @click="deleteGateway"
              class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'GatewayListPage',
  setup() {
    const { showToast } = useToast()
    
    const gateways = ref([])
    const searchTerm = ref('')
    const statusFilter = ref('')
    const showDeleteModal = ref(false)
    const gatewayToDelete = ref(null)

    // Mock data
    const mockGateways = [
      {
        id: 1,
        code: 'GW-001',
        address: 'Av. Principal 123, Quito',
        latitude: '-0.1807',
        longitude: '-78.4678',
        altitude: '2850',
        installationDate: '2023-01-01',
        status: 'active',
        description: 'Gateway principal del sector norte',
        dataUrl: 'https://api.example.com/gateway-data',
        lastActivity: new Date('2024-01-15T10:30:00')
      },
      {
        id: 2,
        code: 'GW-002',
        address: 'Calle 10 de Agosto 456, Guayaquil',
        latitude: '-2.1709',
        longitude: '-79.9224',
        altitude: '4',
        installationDate: '2023-02-10',
        status: 'active',
        description: 'Gateway del centro comercial',
        dataUrl: 'https://api.example.com/gateway-data',
        lastActivity: new Date('2024-01-15T09:15:00')
      },
      {
        id: 3,
        code: 'GW-003',
        address: 'Av. Amazonas 789, Cuenca',
        latitude: '-2.9006',
        longitude: '-79.0045',
        altitude: '2560',
        installationDate: '2023-03-05',
        status: 'maintenance',
        description: 'Gateway en mantenimiento programado',
        dataUrl: null,
        lastActivity: new Date('2024-01-14T16:45:00')
      },
      {
        id: 4,
        code: 'GW-004',
        address: 'Calle Bolívar 321, Manta',
        latitude: '-0.9677',
        longitude: '-80.7089',
        altitude: '6',
        installationDate: '2023-04-20',
        status: 'inactive',
        description: 'Gateway temporalmente desactivado',
        dataUrl: 'https://api.example.com/gateway-data',
        lastActivity: new Date('2024-01-10T14:20:00')
      }
    ]

    const filteredGateways = computed(() => {
      let filtered = gateways.value

      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(gateway =>
          gateway.code.toLowerCase().includes(term) ||
          gateway.address.toLowerCase().includes(term) ||
          getStatusText(gateway.status).toLowerCase().includes(term)
        )
      }

      if (statusFilter.value) {
        filtered = filtered.filter(gateway => gateway.status === statusFilter.value)
      }

      return filtered
    })

    const getStatusText = (status) => {
      const statusMap = {
        active: 'Activo',
        inactive: 'Inactivo',
        maintenance: 'Mantenimiento'
      }
      return statusMap[status] || status
    }

    const formatDate = (date, onlyDate = false) => {
      if (!date) return ''
      const d = new Date(date)
      if (onlyDate) {
        return d.toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: '2-digit' })
      }
      return new Intl.DateTimeFormat('es-EC', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d)
    }

    const loadGateways = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500))
        // Usar array global si existe (para mock de edición)
        if (window && window.__GATEWAYS__) {
          gateways.value = window.__GATEWAYS__
        } else {
          gateways.value = mockGateways
          window.__GATEWAYS__ = mockGateways
        }
      } catch (error) {
        showToast('Error al cargar los gateways', 'error')
        console.error('Error loading gateways:', error)
      }
    }

    const toggleStatus = async (gateway) => {
      try {
        const newStatus = gateway.status === 'active' ? 'inactive' : 'active'
        
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        gateway.status = newStatus
        gateway.lastActivity = new Date()
        
        const action = newStatus === 'active' ? 'activado' : 'desactivado'
        showToast(`Gateway ${action} exitosamente`, 'success')
      } catch (error) {
        showToast('Error al cambiar el estado del gateway', 'error')
        console.error('Error toggling gateway status:', error)
      }
    }

    const sendData = async (gateway) => {
      try {
        showToast('Enviando datos...', 'info')
        
        // Simular envío de datos
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        showToast('Datos enviados exitosamente', 'success')
      } catch (error) {
        showToast('Error al enviar los datos', 'error')
        console.error('Error sending data:', error)
      }
    }

    const confirmDelete = (gateway) => {
      gatewayToDelete.value = gateway
      showDeleteModal.value = true
    }

    const deleteGateway = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const index = gateways.value.findIndex(g => g.id === gatewayToDelete.value.id)
        if (index > -1) {
          gateways.value.splice(index, 1)
        }
        
        showToast('Gateway eliminado exitosamente', 'success')
        showDeleteModal.value = false
        gatewayToDelete.value = null
      } catch (error) {
        showToast('Error al eliminar el gateway', 'error')
        console.error('Error deleting gateway:', error)
      }
    }

    onMounted(() => {
      loadGateways()
    })

    return {
      gateways,
      searchTerm,
      statusFilter,
      filteredGateways,
      showDeleteModal,
      gatewayToDelete,
      getStatusText,
      formatDate,
      toggleStatus,
      sendData,
      confirmDelete,
      deleteGateway
    }
  }
}
</script> 
