import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import devicesService, { 
  DEVICE_TYPES, 
  DEVICE_STATUS, 
  MAINTENANCE_TYPES,
  LOG_TYPES 
} from '@/services/devices.service'

export const useDevicesStore = defineStore('devices', () => {
  // Estado
  const devices = ref([])
  const currentDevice = ref(null)
  const deviceMaintenance = ref([])
  const deviceLogs = ref([])
  const sectors = ref([])
  const clients = ref([])
  const gateways = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Paginación
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  
  // Filtros
  const filters = ref({
    search: '',
    type: '',
    status: '',
    sector: '',
    client: ''
  })
  
  // Ordenamiento
  const sortBy = ref('serialNumber')
  const sortOrder = ref('asc')

  // Getters
  const getDevices = computed(() => devices.value)
  const getCurrentDevice = computed(() => currentDevice.value)
  const getDeviceMaintenance = computed(() => deviceMaintenance.value)
  const getDeviceLogs = computed(() => deviceLogs.value)
  const getSectors = computed(() => sectors.value)
  const getClients = computed(() => clients.value)
  const getGateways = computed(() => gateways.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)
  const getPagination = computed(() => pagination.value)
  const getFilters = computed(() => filters.value)

  // Acciones
  const fetchDevices = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        ...filters.value,
        ...params
      }
      
      const response = await devicesService.getDevices(queryParams)
      
      devices.value = response.data || response.devices || []
      pagination.value = {
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }
    } catch (err) {
      error.value = err.message || 'Error al cargar dispositivos'
      console.error('Error fetching devices:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDeviceById = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const device = await devicesService.getDeviceById(id)
      currentDevice.value = device
      return device
    } catch (err) {
      error.value = err.message || 'Error al cargar dispositivo'
      console.error('Error fetching device:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDevice = async (deviceData) => {
    loading.value = true
    error.value = null
    
    try {
      const newDevice = await devicesService.createDevice(deviceData)
      devices.value.unshift(newDevice)
      return newDevice
    } catch (err) {
      error.value = err.message || 'Error al crear dispositivo'
      console.error('Error creating device:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDevice = async (id, deviceData) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedDevice = await devicesService.updateDevice(id, deviceData)
      
      // Actualizar en la lista
      const index = devices.value.findIndex(d => d.id === id)
      if (index !== -1) {
        devices.value[index] = updatedDevice
      }
      
      // Actualizar dispositivo actual si es el mismo
      if (currentDevice.value && currentDevice.value.id === id) {
        currentDevice.value = updatedDevice
      }
      
      return updatedDevice
    } catch (err) {
      error.value = err.message || 'Error al actualizar dispositivo'
      console.error('Error updating device:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDevice = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await devicesService.deleteDevice(id)
      
      // Remover de la lista
      devices.value = devices.value.filter(d => d.id !== id)
      
      // Limpiar dispositivo actual si es el mismo
      if (currentDevice.value && currentDevice.value.id === id) {
        currentDevice.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.message || 'Error al eliminar dispositivo'
      console.error('Error deleting device:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDeviceMaintenance = async (deviceId) => {
    loading.value = true
    error.value = null
    
    try {
      const maintenance = await devicesService.getDeviceMaintenance(deviceId)
      deviceMaintenance.value = maintenance
      return maintenance
    } catch (err) {
      error.value = err.message || 'Error al cargar mantenimientos'
      console.error('Error fetching maintenance:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMaintenance = async (deviceId, maintenanceData) => {
    loading.value = true
    error.value = null
    
    try {
      const newMaintenance = await devicesService.createMaintenance(deviceId, maintenanceData)
      deviceMaintenance.value.unshift(newMaintenance)
      return newMaintenance
    } catch (err) {
      error.value = err.message || 'Error al crear mantenimiento'
      // console.error('Error creating maintenance:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDeviceLogs = async (deviceId, params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const logs = await devicesService.getDeviceLogs(deviceId, params)
      deviceLogs.value = logs
      return logs
    } catch (err) {
      error.value = err.message || 'Error al cargar logs'
      // console.error('Error fetching logs:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFirmware = async (deviceId, firmwareData) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await devicesService.updateFirmware(deviceId, firmwareData)
      return result
    } catch (err) {
      error.value = err.message || 'Error al actualizar firmware'
      // console.error('Error updating firmware:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSectors = async () => {
    try {
      const sectorsData = await devicesService.getSectors()
      sectors.value = sectorsData
      return sectorsData
    } catch (err) {
      // console.error('Error fetching sectors:', err)
      throw err
    }
  }

  const fetchClients = async () => {
    try {
      const clientsData = await devicesService.getClients()
      clients.value = clientsData
      return clientsData
    } catch (err) {
      // console.error('Error fetching clients:', err)
      throw err
    }
  }

  const fetchGateways = async () => {
    try {
      const gatewaysData = await devicesService.getGateways()
      gateways.value = gatewaysData
      return gatewaysData
    } catch (err) {
      // console.error('Error fetching gateways:', err)
      throw err
    }
  }

  const searchDevices = async (searchTerm) => {
    loading.value = true
    error.value = null
    
    try {
      const results = await devicesService.searchDevices(searchTerm)
      return results
    } catch (err) {
      error.value = err.message || 'Error en la búsqueda'
      // console.error('Error searching devices:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filtros y paginación
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset a primera página
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  const setSorting = (field, order = 'asc') => {
    sortBy.value = field
    sortOrder.value = order
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      type: '',
      status: '',
      sector: '',
      client: ''
    }
    pagination.value.page = 1
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentDevice = () => {
    currentDevice.value = null
  }

  return {
    // Estado
    devices,
    currentDevice,
    deviceMaintenance,
    deviceLogs,
    sectors,
    clients,
    gateways,
    loading,
    error,
    pagination,
    filters,
    sortBy,
    sortOrder,
    
    // Getters
    getDevices,
    getCurrentDevice,
    getDeviceMaintenance,
    getDeviceLogs,
    getSectors,
    getClients,
    getGateways,
    isLoading,
    getError,
    getPagination,
    getFilters,
    
    // Acciones
    fetchDevices,
    fetchDeviceById,
    createDevice,
    updateDevice,
    deleteDevice,
    fetchDeviceMaintenance,
    createMaintenance,
    fetchDeviceLogs,
    updateFirmware,
    fetchSectors,
    fetchClients,
    fetchGateways,
    searchDevices,
    setFilters,
    setPagination,
    setSorting,
    clearFilters,
    clearError,
    clearCurrentDevice,
    
    // Constantes
    DEVICE_TYPES,
    DEVICE_STATUS,
    MAINTENANCE_TYPES,
    LOG_TYPES
  }
}) 