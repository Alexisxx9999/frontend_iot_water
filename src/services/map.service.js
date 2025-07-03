import api from './api'

// Constantes para tipos de parroquia y rangos de consumo
export const PARISH_TYPES = {
  URBANA: 'urbana',
  RURAL: 'rural',
  MIXTA: 'mixta'
}

export const CONSUMPTION_RANGES = {
  BAJO: { min: 0, max: 25, color: '#4CAF50', label: 'Bajo' },
  MEDIO: { min: 25, max: 50, color: '#FFC107', label: 'Medio' },
  ALTO: { min: 50, max: 75, color: '#FF9800', label: 'Alto' },
  MUY_ALTO: { min: 75, max: 100, color: '#F44336', label: 'Muy Alto' }
}

export const TIME_PERIODS = {
  ULTIMO_MES: 'last_month',
  ULTIMOS_3_MESES: 'last_3_months',
  ULTIMO_ANIO: 'last_year',
  PERSONALIZADO: 'custom'
}

class MapService {
  // Geografía Política
  async getZonalAdministrations() {
    try {
      const response = await api.get('/map/zonal-administrations')
      return response.data
    } catch (error) {
      console.error('Error fetching zonal administrations:', error)
      throw error
    }
  }

  async getParishes(filters = {}) {
    try {
      const response = await api.get('/map/parishes', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching parishes:', error)
      throw error
    }
  }

  async getGeographicData(filters = {}) {
    try {
      const response = await api.get('/map/geographic-data', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching geographic data:', error)
      throw error
    }
  }

  // Consumo Histórico
  async getConsumptionHistory(filters = {}) {
    try {
      const response = await api.get('/map/consumption-history', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching consumption history:', error)
      throw error
    }
  }

  async getConsumptionSummary(filters = {}) {
    try {
      const response = await api.get('/map/consumption-summary', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching consumption summary:', error)
      throw error
    }
  }

  async getConsumptionByZone(zoneId, filters = {}) {
    try {
      const response = await api.get(`/map/consumption/zone/${zoneId}`, { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching zone consumption:', error)
      throw error
    }
  }

  // Datos del Mapa
  async getMapData(filters = {}) {
    try {
      const response = await api.get('/map/data', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching map data:', error)
      throw error
    }
  }

  async getZoneDetails(zoneId) {
    try {
      const response = await api.get(`/map/zone/${zoneId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching zone details:', error)
      throw error
    }
  }

  // Gráficos y Estadísticas
  async getConsumptionByZonalAdmin(filters = {}) {
    try {
      const response = await api.get('/map/stats/consumption-by-zonal', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching consumption by zonal admin:', error)
      throw error
    }
  }

  async getTemporalVariation(filters = {}) {
    try {
      const response = await api.get('/map/stats/temporal-variation', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching temporal variation:', error)
      throw error
    }
  }

  async getDistributionByParish(filters = {}) {
    try {
      const response = await api.get('/map/stats/distribution-by-parish', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching distribution by parish:', error)
      throw error
    }
  }

  // Exportación
  async exportMapData(filters = {}, format = 'excel') {
    try {
      const response = await api.get('/map/export', { 
        params: { ...filters, format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting map data:', error)
      throw error
    }
  }

  // Gestión de Medidores en el Mapa
  async getMetersInMap(filters = {}) {
    try {
      const response = await api.get('/map/meters', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching meters in map:', error)
      throw error
    }
  }

  async addMeterToMap(meterData) {
    try {
      const response = await api.post('/map/meters', meterData)
      return response.data
    } catch (error) {
      console.error('Error adding meter to map:', error)
      throw error
    }
  }

  async updateMeterInMap(meterId, meterData) {
    try {
      const response = await api.put(`/map/meters/${meterId}`, meterData)
      return response.data
    } catch (error) {
      console.error('Error updating meter in map:', error)
      throw error
    }
  }

  async deleteMeterFromMap(meterId) {
    try {
      const response = await api.delete(`/map/meters/${meterId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting meter from map:', error)
      throw error
    }
  }

  // Mock data para desarrollo
  getMockMapData() {
    return {
      zonalAdministrations: [
        { id: 1, name: 'Administración Zonal Norte', code: 'AZN', parishes: 12 },
        { id: 2, name: 'Administración Zonal Sur', code: 'AZS', parishes: 8 },
        { id: 3, name: 'Administración Zonal Este', code: 'AZE', parishes: 15 },
        { id: 4, name: 'Administración Zonal Oeste', code: 'AZO', parishes: 10 }
      ],
      parishes: [
        { id: 1, name: 'Parroquia San José', type: 'urbana', zonalAdminId: 1, consumption: 45.2 },
        { id: 2, name: 'Parroquia La Merced', type: 'urbana', zonalAdminId: 1, consumption: 32.8 },
        { id: 3, name: 'Parroquia Rural Norte', type: 'rural', zonalAdminId: 1, consumption: 18.5 },
        { id: 4, name: 'Parroquia San Francisco', type: 'urbana', zonalAdminId: 2, consumption: 67.3 },
        { id: 5, name: 'Parroquia Mixta Sur', type: 'mixta', zonalAdminId: 2, consumption: 41.7 },
        { id: 6, name: 'Parroquia El Valle', type: 'urbana', zonalAdminId: 3, consumption: 55.9 },
        { id: 7, name: 'Parroquia Rural Este', type: 'rural', zonalAdminId: 3, consumption: 22.1 },
        { id: 8, name: 'Parroquia Los Chillos', type: 'mixta', zonalAdminId: 4, consumption: 38.4 }
      ],
      consumptionSummary: {
        totalConsumption: 322.9,
        monthlyVariation: 5.2,
        averageConsumption: 40.4,
        totalParishes: 8,
        totalZonalAdmins: 4
      },
      meters: [
        { id: 1, serialNumber: 'MTR001', parishId: 1, coordinates: [-0.2299, -78.5249], status: 'active' },
        { id: 2, serialNumber: 'MTR002', parishId: 2, coordinates: [-0.2150, -78.5100], status: 'active' },
        { id: 3, serialNumber: 'MTR003', parishId: 3, coordinates: [-0.2400, -78.5400], status: 'maintenance' },
        { id: 4, serialNumber: 'MTR004', parishId: 4, coordinates: [-0.2000, -78.4800], status: 'active' }
      ]
    }
  }
}

export default new MapService()
