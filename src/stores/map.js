import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import mapService from '@/services/map.service'

export const useMapStore = defineStore('map', () => {
  // Estado
  const zones = ref([])
  const selectedZone = ref('')
  const selectedParishType = ref('')
  const selectedPeriod = ref('1')
  const selectedConsumptionRange = ref('')
  const selectedZoneInfo = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const temporalData = ref({})
  const parishDistribution = ref({})
  const systemSummary = ref({})

  // Getters (computed)
  const filteredZones = computed(() => {
    let filtered = zones.value

    if (selectedZone.value) {
      filtered = filtered.filter(zone => zone.id === parseInt(selectedZone.value))
    }

    if (selectedParishType.value) {
      filtered = filtered.filter(zone => zone.type === selectedParishType.value)
    }

    if (selectedConsumptionRange.value) {
      filtered = filtered.filter(zone => {
        const consumption = zone.consumption
        switch (selectedConsumptionRange.value) {
          case 'bajo': return consumption <= 100
          case 'medio': return consumption > 100 && consumption <= 500
          case 'alto': return consumption > 500 && consumption <= 1000
          case 'muyalto': return consumption > 1000
          default: return true
        }
      })
    }

    return filtered
  })

  const totalConsumption = computed(() => {
    return filteredZones.value.reduce((total, zone) => total + zone.consumption, 0)
  })

  const monthlyVariation = computed(() => {
    const variations = filteredZones.value.map(zone => zone.variation)
    return variations.length > 0 ? (variations.reduce((a, b) => a + b, 0) / variations.length).toFixed(1) : 0
  })

  const totalZones = computed(() => filteredZones.value.length)

  const totalParishes = computed(() => {
    return filteredZones.value.reduce((total, zone) => total + zone.parishes.length, 0)
  })

  const zonesByType = computed(() => {
    const types = {}
    filteredZones.value.forEach(zone => {
      if (!types[zone.type]) {
        types[zone.type] = []
      }
      types[zone.type].push(zone)
    })
    return types
  })

  const consumptionRanges = computed(() => {
    const ranges = {
      bajo: 0,
      medio: 0,
      alto: 0,
      muyalto: 0
    }

    filteredZones.value.forEach(zone => {
      const range = mapService.getConsumptionRange(zone.consumption)
      ranges[range]++
    })

    return ranges
  })

  const filteredMonthlyHistories = computed(() => {
    return filteredZones.value.map(zone => {
      if (zone.monthlyHistories && zone.monthlyHistories[selectedPeriod.value] && zone.monthlyHistories[selectedPeriod.value][selectedConsumptionRange.value || 'bajo']) {
        return zone.monthlyHistories[selectedPeriod.value][selectedConsumptionRange.value || 'bajo']
      }
      // Fallback: historial general
      return zone.monthlyHistory || []
    })
  })

  // Actions
  const fetchZones = async () => {
    loading.value = true
    error.value = null
    try {
      // En desarrollo, usar datos simulados
      const mockData = mapService.getMockData()
      zones.value = mockData.zones
      temporalData.value = mockData.temporalData
      parishDistribution.value = mockData.parishDistribution
      systemSummary.value = mockData.systemSummary
      
      // En producción, usar la API real:
      // const response = await mapService.getAdministrativeZones()
      // zones.value = response.data
    } catch (err) {
      error.value = 'Error al cargar las zonas administrativas'
      console.error('Error fetching zones:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchConsumptionHistory = async (params = {}) => {
    try {
      const response = await mapService.getConsumptionHistory(params)
      return response
    } catch (err) {
      error.value = 'Error al cargar el historial de consumo'
      console.error('Error fetching consumption history:', err)
      throw err
    }
  }

  const fetchTemporalVariation = async (zoneId = null, months = 6) => {
    // Solo usar datos simulados
    const mockData = mapService.getMockData()
    temporalData.value = mockData.temporalData
    return mockData.temporalData
  }

  const fetchParishDistribution = async () => {
    // Solo usar datos simulados
    const mockData = mapService.getMockData()
    parishDistribution.value = mockData.parishDistribution
    return mockData.parishDistribution
  }

  const fetchSystemSummary = async () => {
    // Solo usar datos simulados
    const mockData = mapService.getMockData()
    systemSummary.value = mockData.systemSummary
    return mockData.systemSummary
  }

  const setSelectedZone = (zoneId) => {
    selectedZone.value = zoneId
  }

  const setSelectedParishType = (type) => {
    selectedParishType.value = type
  }

  const setSelectedPeriod = (period) => {
    selectedPeriod.value = period
  }

  const setSelectedConsumptionRange = (range) => {
    selectedConsumptionRange.value = range
  }

  const setSelectedZoneInfo = (zoneInfo) => {
    selectedZoneInfo.value = zoneInfo
  }

  const clearFilters = () => {
    selectedZone.value = ''
    selectedParishType.value = ''
    selectedPeriod.value = '1'
    selectedConsumptionRange.value = ''
    selectedZoneInfo.value = null
  }

  const exportMapData = async () => {
    try {
      const filters = {
        zone: selectedZone.value,
        parishType: selectedParishType.value,
        period: selectedPeriod.value,
        consumptionRange: selectedConsumptionRange.value
      }

      const data = {
        zones: filteredZones.value,
        filters,
        summary: {
          totalConsumption: totalConsumption.value,
          monthlyVariation: monthlyVariation.value,
          totalZones: totalZones.value,
          totalParishes: totalParishes.value
        },
        temporalData: temporalData.value,
        parishDistribution: parishDistribution.value,
        systemSummary: systemSummary.value
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mapa_consumo_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return true
    } catch (err) {
      error.value = 'Error al exportar los datos'
      console.error('Error exporting map data:', err)
      throw err
    }
  }

  const getZoneById = (id) => {
    return zones.value.find(zone => zone.id === id)
  }

  const getZonesByType = (type) => {
    return zones.value.filter(zone => zone.type === type)
  }

  const getZonesByConsumptionRange = (range) => {
    return zones.value.filter(zone => {
      const zoneRange = mapService.getConsumptionRange(zone.consumption)
      return zoneRange === range
    })
  }

  const updateZoneConsumption = (zoneId, newConsumption) => {
    const zone = zones.value.find(z => z.id === zoneId)
    if (zone) {
      zone.consumption = newConsumption
      zone.color = mapService.getConsumptionColor(newConsumption)
    }
  }

  const addZone = (zoneData) => {
    const newZone = {
      id: Date.now(), // En producción, el ID vendría del backend
      ...zoneData,
      color: mapService.getConsumptionColor(zoneData.consumption)
    }
    zones.value.push(newZone)
  }

  const removeZone = (zoneId) => {
    const index = zones.value.findIndex(zone => zone.id === zoneId)
    if (index !== -1) {
      zones.value.splice(index, 1)
    }
  }

  return {
    // Estado
    zones,
    selectedZone,
    selectedParishType,
    selectedPeriod,
    selectedConsumptionRange,
    selectedZoneInfo,
    loading,
    error,
    temporalData,
    parishDistribution,
    systemSummary,

    // Getters
    filteredZones,
    totalConsumption,
    monthlyVariation,
    totalZones,
    totalParishes,
    zonesByType,
    consumptionRanges,
    filteredMonthlyHistories,

    // Actions
    fetchZones,
    fetchConsumptionHistory,
    fetchTemporalVariation,
    fetchParishDistribution,
    fetchSystemSummary,
    setSelectedZone,
    setSelectedParishType,
    setSelectedPeriod,
    setSelectedConsumptionRange,
    setSelectedZoneInfo,
    clearFilters,
    exportMapData,
    getZoneById,
    getZonesByType,
    getZonesByConsumptionRange,
    updateZoneConsumption,
    addZone,
    removeZone
  }
})
