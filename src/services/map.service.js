import api from './api'

<<<<<<< HEAD
class MapService {
  // Obtener datos de geografía política
  async getGeographicData() {
    try {
      const response = await api.get('/geografia-politica')
      return response.data
    } catch (error) {
      console.error('Error obteniendo datos geográficos:', error)
=======
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
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener resumen de consumo histórico
  async getConsumptionHistory(params = {}) {
    try {
      const response = await api.get('/resumen-consumo-historico', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo historial de consumo:', error)
=======
  async getParishes(filters = {}) {
    try {
      const response = await api.get('/map/parishes', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching parishes:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener datos de zonas administrativas
  async getAdministrativeZones() {
    try {
      const response = await api.get('/administraciones-zonales')
      return response.data
    } catch (error) {
      console.error('Error obteniendo zonas administrativas:', error)
=======
  async getGeographicData(filters = {}) {
    try {
      const response = await api.get('/map/geographic-data', { params: filters })
      return response.data
    } catch (error) {
      // console.error('Error fetching geographic data:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener datos de parroquias
  async getParishes(zoneId = null) {
    try {
      const params = zoneId ? { zona_id: zoneId } : {}
      const response = await api.get('/parroquias', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo parroquias:', error)
=======
  // Consumo Histórico
  async getConsumptionHistory(filters = {}) {
    try {
      const response = await api.get('/map/consumption-history', { params: filters })
      return response.data
    } catch (error) {
      // console.error('Error fetching consumption history:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener consumo por zona
  async getConsumptionByZone(zoneId, period = '1') {
    try {
      const response = await api.get(`/consumo-zona/${zoneId}`, {
        params: { periodo: period }
      })
      return response.data
    } catch (error) {
      console.error('Error obteniendo consumo por zona:', error)
=======
  async getConsumptionSummary(filters = {}) {
    try {
      const response = await api.get('/map/consumption-summary', { params: filters })
      return response.data
    } catch (error) {
      // console.error('Error fetching consumption summary:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener variación temporal de consumo
  async getTemporalVariation(zoneId = null, months = 6) {
    try {
      const params = {
        meses: months,
        ...(zoneId && { zona_id: zoneId })
      }
      const response = await api.get('/variacion-temporal', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo variación temporal:', error)
=======
  async getConsumptionByZone(zoneId, filters = {}) {
    try {
      const response = await api.get(`/map/consumption/zone/${zoneId}`, { params: filters })
      return response.data
    } catch (error) {
      // console.error('Error fetching zone consumption:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener distribución por tipo de parroquia
  async getParishTypeDistribution() {
    try {
      const response = await api.get('/distribucion-parroquias')
      return response.data
    } catch (error) {
      console.error('Error obteniendo distribución por parroquia:', error)
=======
  // Datos del Mapa
  async getMapData(filters = {}) {
    try {
      const response = await api.get('/map/data', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching map data:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener resumen general del sistema
  async getSystemSummary() {
    try {
      const response = await api.get('/resumen-sistema')
      return response.data
    } catch (error) {
      console.error('Error obteniendo resumen del sistema:', error)
=======
  async getZoneDetails(zoneId) {
    try {
      const response = await api.get(`/map/zone/${zoneId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching zone details:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Exportar datos del mapa
  async exportMapData(filters = {}) {
    try {
      const response = await api.post('/exportar-mapa', filters, {
=======
  // Gráficos y Estadísticas
  async getConsumptionByZonalAdmin(filters = {}) {
    try {
      const response = await api.get('/map/stats/consumption-by-zonal', { params: filters })
      return response.data
    } catch (error) {
      // console.error('Error fetching consumption by zonal admin:', error)
      throw error
    }
  }

  async getTemporalVariation(filters = {}) {
    try {
      const response = await api.get('/map/stats/temporal-variation', { params: filters })
      return response.data
    } catch (error) {
      // console.error('Error fetching temporal variation:', error)
      throw error
    }
  }

  async getDistributionByParish(filters = {}) {
    try {
      const response = await api.get('/map/stats/distribution-by-parish', { params: filters })
      return response.data
    } catch (error) {
      // console.error('Error fetching distribution by parish:', error)
      throw error
    }
  }

  // Exportación
  async exportMapData(filters = {}, format = 'excel') {
    try {
      const response = await api.get('/map/export', { 
        params: { ...filters, format },
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
<<<<<<< HEAD
      console.error('Error exportando datos del mapa:', error)
=======
      console.error('Error exporting map data:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener coordenadas de zonas
  async getZoneCoordinates() {
    try {
      const response = await api.get('/coordenadas-zonas')
      return response.data
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error)
=======
  // Gestión de Medidores en el Mapa
  async getMetersInMap(filters = {}) {
    try {
      const response = await api.get('/map/meters', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching meters in map:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Filtrar datos por múltiples criterios
  async filterMapData(filters = {}) {
    try {
      const response = await api.post('/filtrar-mapa', filters)
      return response.data
    } catch (error) {
      console.error('Error filtrando datos del mapa:', error)
=======
  async addMeterToMap(meterData) {
    try {
      const response = await api.post('/map/meters', meterData)
      return response.data
    } catch (error) {
      console.error('Error adding meter to map:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Obtener alertas de consumo
  async getConsumptionAlerts() {
    try {
      const response = await api.get('/alertas-consumo')
      return response.data
    } catch (error) {
      console.error('Error obteniendo alertas:', error)
=======
  async updateMeterInMap(meterId, meterData) {
    try {
      const response = await api.put(`/map/meters/${meterId}`, meterData)
      return response.data
    } catch (error) {
      console.error('Error updating meter in map:', error)
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
      throw error
    }
  }

<<<<<<< HEAD
  // Datos simulados para desarrollo
  getMockData() {
    // Calcular parishDistribution y temporalData dinámicamente según las zonas
    const allZones = [
      {
        id: 1,
        name: 'Zona Norte',
        type: 'urbana',
        consumption: 120,
        variation: 1.2,
        status: 'online',
        parishes: ['Carcelén', 'Calderón', 'Pomasqui'],
        coordinates: [-0.1022, -78.4691],
        color: '#10b981',
        monthlyHistories: {
          '1': { bajo: [80], medio: [120], alto: [200], muyalto: [350] },
          '3': { bajo: [30, 25, 20], medio: [60, 55, 50], alto: [90, 85, 80], muyalto: [120, 115, 110] },
          '6': { bajo: [60, 55, 50, 45, 40, 35], medio: [120, 115, 110, 105, 100, 95], alto: [180, 175, 170, 165, 160, 155], muyalto: [240, 235, 230, 225, 220, 215] },
          '12': { bajo: [120, 115, 110, 105, 100, 95, 90, 85, 80, 75, 70, 65], medio: [240, 235, 230, 225, 220, 215, 210, 205, 200, 195, 190, 185], alto: [360, 355, 350, 345, 340, 335, 330, 325, 320, 315, 310, 305], muyalto: [480, 475, 470, 465, 460, 455, 450, 445, 440, 435, 430, 425] }
        }
      },
      {
        id: 2,
        name: 'Zona Centro',
        type: 'urbana',
        consumption: 340,
        variation: 2.8,
        status: 'online',
        parishes: ['La Mariscal', 'San Blas', 'San Roque'],
        coordinates: [-0.2201, -78.5127],
        color: '#f59e0b',
        monthlyHistories: {
          '1': { bajo: [15], medio: [25], alto: [35], muyalto: [45] },
          '3': { bajo: [35, 30, 25], medio: [65, 60, 55], alto: [95, 90, 85], muyalto: [125, 120, 115] },
          '6': { bajo: [65, 60, 55, 50, 45, 40], medio: [130, 125, 120, 115, 110, 105], alto: [195, 190, 185, 180, 175, 170], muyalto: [255, 250, 245, 240, 235, 230] },
          '12': { bajo: [130, 125, 120, 115, 110, 105, 100, 95, 90, 85, 80, 75], medio: [260, 255, 250, 245, 240, 235, 230, 225, 220, 215, 210, 205], alto: [390, 385, 380, 375, 370, 365, 360, 355, 350, 345, 340, 335], muyalto: [520, 515, 510, 505, 500, 495, 490, 485, 480, 475, 470, 465] }
        }
      },
      {
        id: 3,
        name: 'Zona Sur',
        type: 'rural',
        consumption: 650,
        variation: -0.9,
        status: 'online',
        parishes: ['Quitumbe', 'Guamaní', 'La Ecuatoriana'],
        coordinates: [-0.3275, -78.5526],
        color: '#facc15',
        monthlyHistories: {
          '1': { bajo: [12], medio: [22], alto: [32], muyalto: [42] },
          '3': { bajo: [32, 27, 22], medio: [62, 57, 52], alto: [92, 87, 82], muyalto: [122, 117, 112] },
          '6': { bajo: [62, 57, 52, 47, 42, 37], medio: [124, 119, 114, 109, 104, 99], alto: [186, 181, 176, 171, 166, 161], muyalto: [248, 243, 238, 233, 228, 223] },
          '12': { bajo: [124, 119, 114, 109, 104, 99, 94, 89, 84, 79, 74, 69], medio: [248, 243, 238, 233, 228, 223, 218, 213, 208, 203, 198, 193], alto: [372, 367, 362, 357, 352, 347, 342, 337, 332, 327, 322, 317], muyalto: [496, 491, 486, 481, 476, 471, 466, 461, 456, 451, 446, 441] }
        }
      },
      {
        id: 4,
        name: 'Zona Los Chillos',
        type: 'mixta',
        consumption: 1250,
        variation: 4.1,
        status: 'alert',
        parishes: ['Conocoto', 'Alangasí', 'La Merced'],
        coordinates: [-0.2946, -78.4347],
        color: '#ef4444',
        monthlyHistories: {
          '1': { bajo: [18], medio: [28], alto: [38], muyalto: [48] },
          '3': { bajo: [38, 33, 28], medio: [68, 63, 58], alto: [98, 93, 88], muyalto: [128, 123, 118] },
          '6': { bajo: [68, 63, 58, 53, 48, 43], medio: [136, 131, 126, 121, 116, 111], alto: [204, 199, 194, 189, 184, 179], muyalto: [272, 267, 262, 257, 252, 247] },
          '12': { bajo: [136, 131, 126, 121, 116, 111, 106, 101, 96, 91, 86, 81], medio: [272, 267, 262, 257, 252, 247, 242, 237, 232, 227, 222, 217], alto: [408, 403, 398, 393, 388, 383, 378, 373, 368, 363, 358, 353], muyalto: [544, 539, 534, 529, 524, 519, 514, 509, 504, 499, 494, 489] }
        }
      },
      {
        id: 5,
        name: 'Zona Tumbaco',
        type: 'rural',
        consumption: 480,
        variation: 0.7,
        status: 'online',
        parishes: ['Tumbaco', 'Cumbayá', 'Pifo'],
        coordinates: [-0.2102, -78.4146],
        color: '#f59e0b',
        monthlyHistories: {
          '1': { bajo: [400], medio: [420], alto: [430], muyalto: [450] },
          '3': { bajo: [600], medio: [620], alto: [650], muyalto: [670] },
          '6': { bajo: [1800], medio: [1900], alto: [2000], muyalto: [2100] },
          '12': { bajo: [120], medio: [130], alto: [140], muyalto: [150] }
        }
      },
      {
        id: 6,
        name: 'Zona Calderón',
        type: 'urbana',
        consumption: 980,
        variation: 3.5,
        status: 'online',
        parishes: ['Llano Chico', 'Carapungo', 'Calderón'],
        coordinates: [-0.1025, -78.4250],
        color: '#facc15',
        monthlyHistories: {
          '1': { bajo: [800], medio: [850], alto: [900], muyalto: [950] },
          '3': { bajo: [600], medio: [620], alto: [650], muyalto: [670] },
          '6': { bajo: [1800], medio: [1900], alto: [2000], muyalto: [2100] },
          '12': { bajo: [120], medio: [130], alto: [140], muyalto: [150] }
        }
      },
      {
        id: 7,
        name: 'Zona Valle de los Chillos',
        type: 'mixta',
        consumption: 2150,
        variation: 6.2,
        status: 'alert',
        parishes: ['La Merced', 'Alangasí', 'Amaguaña'],
        coordinates: [-0.3150, -78.4100],
        color: '#ef4444',
        monthlyHistories: {
          '1': { bajo: [1800], medio: [1900], alto: [2000], muyalto: [2100] },
          '3': { bajo: [1800], medio: [1900], alto: [2000], muyalto: [2100] },
          '6': { bajo: [1800], medio: [1900], alto: [2000], muyalto: [2100] },
          '12': { bajo: [120], medio: [130], alto: [140], muyalto: [150] }
        }
      },
      {
        id: 8,
        name: 'Zona Quitumbe',
        type: 'urbana',
        consumption: 180,
        variation: 1.5,
        status: 'online',
        parishes: ['Solanda', 'Chimbacalle', 'La Magdalena'],
        coordinates: [-0.2730, -78.5420],
        color: '#10b981',
        monthlyHistories: {
          '1': { bajo: [120], medio: [130], alto: [140], muyalto: [150] },
          '3': { bajo: [600], medio: [620], alto: [650], muyalto: [670] },
          '6': { bajo: [1800], medio: [1900], alto: [2000], muyalto: [2100] },
          '12': { bajo: [120], medio: [130], alto: [140], muyalto: [150] }
        }
      }
    ];
    // Calcular distribución de parroquias por tipo
    const parishTypes = ['urbana', 'rural', 'mixta'];
    const parishDistribution = {
      labels: ['Urbana', 'Rural', 'Mixta'],
      data: [
        allZones.filter(z => z.type === 'urbana').reduce((acc, z) => acc + z.parishes.length, 0),
        allZones.filter(z => z.type === 'rural').reduce((acc, z) => acc + z.parishes.length, 0),
        allZones.filter(z => z.type === 'mixta').reduce((acc, z) => acc + z.parishes.length, 0)
      ],
      colors: [
        'rgba(14, 165, 233, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ]
    };
    // Calcular temporalData como suma de todos los historiales mensuales
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const monthlyTotals = months.map((_, i) =>
      allZones.reduce((acc, z) => acc + (z.monthlyHistories['1']?.bajo[i] || 0), 0)
    );
    const temporalData = {
      labels: months,
      datasets: [
        {
          label: 'Consumo Total (m³)',
          data: monthlyTotals,
          borderColor: 'rgba(14, 165, 233, 1)',
          backgroundColor: 'rgba(14, 165, 233, 0.1)'
        }
      ]
    };
    // Calcular systemSummary
    const systemSummary = {
      totalConsumption: allZones.reduce((acc, z) => acc + z.consumption, 0),
      monthlyVariation: (allZones.reduce((acc, z) => acc + z.variation, 0) / allZones.length).toFixed(1),
      totalZones: allZones.length,
      totalParishes: allZones.reduce((acc, z) => acc + z.parishes.length, 0),
      averageConsumption: Math.round(allZones.reduce((acc, z) => acc + z.consumption, 0) / allZones.length)
    };
    return {
      zones: allZones,
      temporalData,
      parishDistribution,
      systemSummary
    };
  }

  // Utilidades para el mapa
  getConsumptionColor(consumption) {
    if (consumption <= 100) return '#10b981' // Verde - Bajo
    if (consumption <= 500) return '#f59e0b' // Amarillo - Medio
    if (consumption <= 1000) return '#facc15' // Amarillo claro - Alto
    return '#ef4444' // Rojo - Muy Alto
  }

  getConsumptionRange(consumption) {
    if (consumption <= 100) return 'bajo'
    if (consumption <= 500) return 'medio'
    if (consumption <= 1000) return 'alto'
    return 'muyalto'
  }

  formatConsumption(value) {
    return new Intl.NumberFormat('es-EC').format(value)
  }

  formatVariation(value) {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
=======
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
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
  }
}

export default new MapService()
