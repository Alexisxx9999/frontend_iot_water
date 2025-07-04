<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Dispositivos LoRaWAN</h1>
            <p class="mt-1 text-sm text-gray-500">
              Administra y monitorea todos los dispositivos del sistema
            </p>
          </div>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Dispositivo
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filtros y Búsqueda -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Búsqueda -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Número de serie, tipo, sector, cliente..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="handleSearch"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Filtro por Tipo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              v-model="filters.type"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option v-for="(label, key) in DEVICE_TYPES" :key="key" :value="key">
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Filtro por Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="filters.status"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option v-for="(label, key) in DEVICE_STATUS" :key="key" :value="key">
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Filtro por Sector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <select
              v-model="filters.sector"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                {{ sector.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-between items-center mt-4">
          <div class="flex space-x-2">
            <button
              @click="clearFilters"
              class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Limpiar Filtros
            </button>
            <button
              @click="refreshData"
              class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Actualizar
            </button>
          </div>
          
          <!-- Estadísticas Rápidas -->
          <div class="flex space-x-4 text-sm text-gray-600">
            <span>Total: {{ pagination.total }}</span>
            <span>Activos: {{ stats.active || 0 }}</span>
            <span>En Falla: {{ stats.failure || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Tabla de Dispositivos -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center space-x-2">
            <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">Cargando dispositivos...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center py-12">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Error al cargar dispositivos</h3>
            <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
            <button
              @click="refreshData"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>

        <!-- Table Content -->
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="column in tableColumns"
                    :key="column.key"
                    @click="handleSort(column.key)"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div class="flex items-center space-x-1">
                      <span>{{ column.label }}</span>
                      <svg v-if="sortBy === column.key" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="sortOrder === 'asc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="device in devices" :key="device.id" class="hover:bg-gray-50">
                  <!-- Número de Serie -->
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
                        <div class="text-sm font-medium text-gray-900">{{ device.serialNumber }}</div>
                        <div class="text-sm text-gray-500">{{ device.model }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Tipo -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getTypeBadgeClass(device.type)">
                      {{ DEVICE_TYPES[device.type] || device.type }}
                    </span>
                  </td>

                  <!-- Estado -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusBadgeClass(device.status)">
                      {{ DEVICE_STATUS[device.status] || device.status }}
                    </span>
                  </td>

                  <!-- Ubicación -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ device.sector?.name || 'Sin asignar' }}
                  </td>

                  <!-- Última Comunicación -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatLastCommunication(device.lastCommunication) }}
                  </td>

                  <!-- Nivel de Batería -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          class="h-2 rounded-full"
                          :class="getBatteryClass(device.batteryLevel)"
                          :style="{ width: `${device.batteryLevel || 0}%` }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-900">{{ device.batteryLevel || 0 }}%</span>
                    </div>
                  </td>

                  <!-- Acciones -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        @click="viewDevice(device)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        @click="editDevice(device)"
                        class="text-green-600 hover:text-green-900"
                        title="Editar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        @click="deleteDevice(device)"
                        class="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando
                  <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                  a
                  <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                  de
                  <span class="font-medium">{{ pagination.total }}</span>
                  resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="changePage(pagination.page - 1)"
                    :disabled="pagination.page <= 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  
                  <button
                    v-for="page in getPageNumbers()"
                    :key="page"
                    @click="changePage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === pagination.page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  
                  <button
                    @click="changePage(pagination.page + 1)"
                    :disabled="pagination.page >= pagination.totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <DeviceModal
      :is-open="showDeviceModal"
      :device="selectedDevice"
      @close="closeDeviceModal"
      @saved="handleDeviceSaved"
    />

    <DeleteDeviceModal
      :is-open="showDeleteModal"
      :device="selectedDevice"
      @close="closeDeleteModal"
      @deleted="handleDeviceDeleted"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDevicesStore } from '@/stores/devices'
import DeviceModal from '@/components/devices/DeviceModal.vue'
import DeleteDeviceModal from '@/components/devices/DeleteDeviceModal.vue'

export default {
  name: 'DeviceListPage',
  components: {
    DeviceModal,
    DeleteDeviceModal
  },
  setup() {
    const router = useRouter()
    const devicesStore = useDevicesStore()
    
    // Estado local
    const loading = ref(false)
    const error = ref(null)
    const searchTerm = ref('')
    const searchTimeout = ref(null)
    
    // Modales
    const showDeviceModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedDevice = ref(null)
    
    // Filtros
    const filters = reactive({
      type: '',
      status: '',
      sector: ''
    })
    
    // Estadísticas
    const stats = ref({
      active: 0,
      failure: 0
    })

    // Columnas de la tabla
    const tableColumns = [
      { key: 'serialNumber', label: 'Número de Serie' },
      { key: 'type', label: 'Tipo' },
      { key: 'status', label: 'Estado' },
      { key: 'sector', label: 'Ubicación' },
      { key: 'lastCommunication', label: 'Última Comunicación' },
      { key: 'batteryLevel', label: 'Batería' }
    ]

    // Computed
    const devices = computed(() => devicesStore.getDevices)
    const pagination = computed(() => devicesStore.getPagination)
    const { DEVICE_TYPES, DEVICE_STATUS } = devicesStore
    const sectors = computed(() => devicesStore.getSectors)

    // Métodos
    const loadData = async () => {
      loading.value = true
      error.value = null
      
      try {
        await devicesStore.fetchDevices()
        // Cargar estadísticas
        await loadStats()
      } catch (err) {
        error.value = err.message || 'Error al cargar dispositivos'
      } finally {
        loading.value = false
      }
    }

    const loadStats = async () => {
      try {
        const statsData = await devicesStore.searchDevices('')
        stats.value = {
          active: devices.value.filter(d => d.status === 'ACTIVO').length,
          failure: devices.value.filter(d => d.status === 'FALLA').length
        }
      } catch (err) {
        console.error('Error loading stats:', err)
      }
    }

    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      
      searchTimeout.value = setTimeout(() => {
        devicesStore.setFilters({ search: searchTerm.value })
        loadData()
      }, 300)
    }

    const applyFilters = () => {
      devicesStore.setFilters(filters)
      loadData()
    }

    const clearFilters = () => {
      searchTerm.value = ''
      Object.assign(filters, {
        type: '',
        status: '',
        sector: ''
      })
      devicesStore.clearFilters()
      loadData()
    }

    const refreshData = () => {
      loadData()
    }

    const handleSort = (field) => {
      const currentOrder = devicesStore.sortOrder
      const newOrder = devicesStore.sortBy === field && currentOrder === 'asc' ? 'desc' : 'asc'
      devicesStore.setSorting(field, newOrder)
      loadData()
    }

    const changePage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        devicesStore.setPagination({ page })
        loadData()
      }
    }

    const getPageNumbers = () => {
      const pages = []
      const current = pagination.value.page
      const total = pagination.value.totalPages
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    }

    // Acciones de dispositivos
    const openCreateModal = () => {
      selectedDevice.value = null
      showDeviceModal.value = true
    }

    const editDevice = (device) => {
      selectedDevice.value = device
      showDeviceModal.value = true
    }

    const viewDevice = (device) => {
      router.push(`/app/devices/${device.id}`)
    }

    const deleteDevice = (device) => {
      selectedDevice.value = device
      showDeleteModal.value = true
    }

    const closeDeviceModal = () => {
      showDeviceModal.value = false
      selectedDevice.value = null
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      selectedDevice.value = null
    }

    const handleDeviceSaved = () => {
      loadData()
    }

    const handleDeviceDeleted = () => {
      loadData()
    }

    // Utilidades
    const getTypeBadgeClass = (type) => {
      const classes = {
        MEDIDOR: 'bg-blue-100 text-blue-800',
        VALVULA: 'bg-green-100 text-green-800',
        GATEWAY: 'bg-purple-100 text-purple-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        ACTIVO: 'bg-green-100 text-green-800',
        INACTIVO: 'bg-gray-100 text-gray-800',
        MANTENIMIENTO: 'bg-yellow-100 text-yellow-800',
        FALLA: 'bg-red-100 text-red-800',
        DESCONECTADO: 'bg-orange-100 text-orange-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getBatteryClass = (level) => {
      if (level >= 80) return 'bg-green-500'
      if (level >= 50) return 'bg-yellow-500'
      if (level >= 20) return 'bg-orange-500'
      return 'bg-red-500'
    }

    const formatLastCommunication = (date) => {
      if (!date) return 'Nunca'
      
      const now = new Date()
      const lastComm = new Date(date)
      const diffMs = now - lastComm
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return 'Ahora'
      if (diffMins < 60) return `${diffMins}m`
      if (diffHours < 24) return `${diffHours}h`
      return `${diffDays}d`
    }

    // Lifecycle
    onMounted(async () => {
      await loadData()
    })

    return {
      // Estado
      loading,
      error,
      searchTerm,
      filters,
      stats,
      showDeviceModal,
      showDeleteModal,
      selectedDevice,
      tableColumns,
      
      // Computed
      devices,
      pagination,
      DEVICE_TYPES,
      DEVICE_STATUS,
      sectors,
      
      // Métodos
      loadData,
      handleSearch,
      applyFilters,
      clearFilters,
      refreshData,
      handleSort,
      changePage,
      getPageNumbers,
      openCreateModal,
      editDevice,
      viewDevice,
      deleteDevice,
      closeDeviceModal,
      closeDeleteModal,
      handleDeviceSaved,
      handleDeviceDeleted,
      getTypeBadgeClass,
      getStatusBadgeClass,
      getBatteryClass,
      formatLastCommunication
    }
  }
}
</script> 