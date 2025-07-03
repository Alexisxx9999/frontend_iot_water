import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import mapService, { 
  PARISH_TYPES, 
  CONSUMPTION_RANGES, 
  TIME_PERIODS 
} from '@/services/map.service'

export const useMapStore = defineStore('map', () => {
  // Estado reactivo
  const zonalAdministrations = ref([])
  const parishes = ref([])
  const meters = ref([])
  const selectedZone = ref(null)
  const consumptionSummary = ref({})
  const consumptionHistory = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Filtros
  const filters = ref({
    zonalAdmin: '',
    parishType: '',
    timePeriod: TIME_PERIODS.ULTIMO_MES,
    consumptionRange: '',
    startDate: '',
    endDate: ''
  })
  
  // Datos de gráficos
  const chartData = ref({
    consumptionByZonal: [],
    temporalVariation: [],
    distributionByParish: []
  })

  // Getters computados
  const getZonalAdministrations = computed(() => zonalAdministrations.value)
  const getParishes = computed(() => parishes.value)
  const getMeters = computed(() => meters.value)
  const getSelectedZone = computed(() => selectedZone.value)
  const getConsumptionSummary = computed(() => consumptionSummary.value)
  const getConsumptionHistory = computed(() => consumptionHistory.value)
  const getFilters = computed(() => filters.value)
  const getChartData = computed(() => chartData.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)

  // Getter para obtener parroquias filtradas
  const getFilteredParishes = computed(() => {
    let filtered = parishes.value

    if (filters.value.zonalAdmin) {
      filtered = filtered.filter(parish => parish.zonalAdminId === parseInt(filters.value.zonalAdmin))
    }

    if (filters.value.parishType) {
      filtered = filtered.filter(parish => parish.type === filters.value.parishType)
    }

    return filtered
  })

  // Getter para obtener medidores filtrados
  const getFilteredMeters = computed(() => {
    let filtered = meters.value

    if (filters.value.zonalAdmin) {
      const parishIds = getFilteredParishes.value.map(p => p.id)
      filtered = filtered.filter(meter => parishIds.includes(meter.parishId))
    }

    return filtered
  })

  // Acciones
  const fetchZonalAdministrations = async () => {
    loading.value = true
    error.value = null
    
    try {
      // En desarrollo, usar mock data
      const mockData = mapService.getMockMapData()
      zonalAdministrations.value = mockData.zonalAdministrations
      
      // Para producción, descomentar:
      // const data = await mapService.getZonalAdministrations()
      // zonalAdministrations.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar administraciones zonales'
      console.error('Error fetching zonal administrations:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchParishes = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // En desarrollo, usar mock data
      const mockData = mapService.getMockMapData()
      parishes.value = mockData.parishes
      
      // Para producción, descomentar:
      // const data = await mapService.getParishes(filters)
      // parishes.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar parroquias'
      console.error('Error fetching parishes:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchMeters = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // En desarrollo, usar mock data
      const mockData = mapService.getMockMapData()
      meters.value = mockData.meters
      
      // Para producción, descomentar:
      // const data = await mapService.getMetersInMap(filters)
      // meters.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar medidores'
      console.error('Error fetching meters:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchConsumptionSummary = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // En desarrollo, usar mock data
      const mockData = mapService.getMockMapData()
      consumptionSummary.value = mockData.consumptionSummary
      
      // Para producción, descomentar:
      // const data = await mapService.getConsumptionSummary(filters)
      // consumptionSummary.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar resumen de consumo'
      console.error('Error fetching consumption summary:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchConsumptionHistory = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Mock data para consumo histórico
      const mockHistory = [
        { date: '2024-01', consumption: 310.5, variation: 2.1 },
        { date: '2024-02', consumption: 322.9, variation: 5.2 },
        { date: '2024-03', consumption: 318.7, variation: -1.3 },
        { date: '2024-04', consumption: 325.1, variation: 2.0 }
      ]
      consumptionHistory.value = mockHistory
      
      // Para producción, descomentar:
      // const data = await mapService.getConsumptionHistory(filters)
      // consumptionHistory.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar historial de consumo'
      console.error('Error fetching consumption history:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchChartData = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Mock data para gráficos
      chartData.value = {
        consumptionByZonal: [
          { zonalAdmin: 'AZN', consumption: 96.5, parishes: 3 },
          { zonalAdmin: 'AZS', consumption: 109.0, parishes: 2 },
          { zonalAdmin: 'AZE', consumption: 78.0, parishes: 2 },
          { zonalAdmin: 'AZO', consumption: 38.4, parishes: 1 }
        ],
        temporalVariation: [
          { month: 'Ene', consumption: 310.5 },
          { month: 'Feb', consumption: 322.9 },
          { month: 'Mar', consumption: 318.7 },
          { month: 'Abr', consumption: 325.1 }
        ],
        distributionByParish: [
          { type: 'Urbana', consumption: 201.2, percentage: 62.3 },
          { type: 'Rural', consumption: 40.6, percentage: 12.6 },
          { type: 'Mixta', consumption: 81.1, percentage: 25.1 }
        ]
      }
      
      // Para producción, descomentar:
      // const [zonalData, temporalData, parishData] = await Promise.all([
      //   mapService.getConsumptionByZonalAdmin(filters),
      //   mapService.getTemporalVariation(filters),
      //   mapService.getDistributionByParish(filters)
      // ])
      // chartData.value = {
      //   consumptionByZonal: zonalData,
      //   temporalVariation: temporalData,
      //   distributionByParish: parishData
      // }
    } catch (err) {
      error.value = err.message || 'Error al cargar datos de gráficos'
      console.error('Error fetching chart data:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchZoneDetails = async (zoneId) => {
    loading.value = true
    error.value = null
    
    try {
      // Mock data para detalles de zona
      const mockZoneDetails = {
        id: zoneId,
        name: `Zona ${zoneId}`,
        consumption: 45.2,
        variation: 2.1,
        parishes: [
          { id: 1, name: 'Parroquia San José', type: 'urbana', consumption: 45.2 }
        ],
        meters: [
          { id: 1, serialNumber: 'MTR001', status: 'active' }
        ]
      }
      selectedZone.value = mockZoneDetails
      
      // Para producción, descomentar:
      // const data = await mapService.getZoneDetails(zoneId)
      // selectedZone.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar detalles de zona'
      console.error('Error fetching zone details:', err)
    } finally {
      loading.value = false
    }
  }

  // Gestión de medidores
  const addMeterToMap = async (meterData) => {
    loading.value = true
    error.value = null
    
    try {
      // En desarrollo, simular creación
      const newMeter = {
        id: Date.now(),
        ...meterData,
        status: 'active'
      }
      meters.value.push(newMeter)
      
      // Para producción, descomentar:
      // const data = await mapService.addMeterToMap(meterData)
      // meters.value.push(data)
      
      return newMeter
    } catch (err) {
      error.value = err.message || 'Error al agregar medidor al mapa'
      console.error('Error adding meter to map:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMeterInMap = async (meterId, meterData) => {
    loading.value = true
    error.value = null
    
    try {
      // En desarrollo, simular actualización
      const index = meters.value.findIndex(m => m.id === meterId)
      if (index !== -1) {
        meters.value[index] = { ...meters.value[index], ...meterData }
      }
      
      // Para producción, descomentar:
      // const data = await mapService.updateMeterInMap(meterId, meterData)
      // const index = meters.value.findIndex(m => m.id === meterId)
      // if (index !== -1) {
      //   meters.value[index] = data
      // }
      
      return meters.value[index]
    } catch (err) {
      error.value = err.message || 'Error al actualizar medidor en el mapa'
      console.error('Error updating meter in map:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMeterFromMap = async (meterId) => {
    loading.value = true
    error.value = null
    
    try {
      // En desarrollo, simular eliminación
      meters.value = meters.value.filter(m => m.id !== meterId)
      
      // Para producción, descomentar:
      // await mapService.deleteMeterFromMap(meterId)
      // meters.value = meters.value.filter(m => m.id !== meterId)
      
      return true
    } catch (err) {
      error.value = err.message || 'Error al eliminar medidor del mapa'
      console.error('Error deleting meter from map:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Exportación
  const exportMapData = async (format = 'excel') => {
    loading.value = true
    error.value = null
    
    try {
      const data = await mapService.exportMapData(filters.value, format)
      
      // Crear y descargar archivo
      const blob = new Blob([data], { 
        type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' 
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mapa_consumo_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      return true
    } catch (err) {
      error.value = err.message || 'Error al exportar datos del mapa'
      console.error('Error exporting map data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utilidades
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      zonalAdmin: '',
      parishType: '',
      timePeriod: TIME_PERIODS.ULTIMO_MES,
      consumptionRange: '',
      startDate: '',
      endDate: ''
    }
  }

  const clearSelectedZone = () => {
    selectedZone.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const getConsumptionRange = (consumption) => {
    for (const [key, range] of Object.entries(CONSUMPTION_RANGES)) {
      if (consumption >= range.min && consumption <= range.max) {
        return range
      }
    }
    return CONSUMPTION_RANGES.BAJO
  }

  return {
    // Estado
    zonalAdministrations,
    parishes,
    meters,
    selectedZone,
    consumptionSummary,
    consumptionHistory,
    loading,
    error,
    filters,
    chartData,
    
    // Getters
    getZonalAdministrations,
    getParishes,
    getMeters,
    getSelectedZone,
    getConsumptionSummary,
    getConsumptionHistory,
    getFilters,
    getChartData,
    isLoading,
    getError,
    getFilteredParishes,
    getFilteredMeters,
    
    // Acciones
    fetchZonalAdministrations,
    fetchParishes,
    fetchMeters,
    fetchConsumptionSummary,
    fetchConsumptionHistory,
    fetchChartData,
    fetchZoneDetails,
    addMeterToMap,
    updateMeterInMap,
    deleteMeterFromMap,
    exportMapData,
    setFilters,
    clearFilters,
    clearSelectedZone,
    clearError,
    getConsumptionRange
  }
})
