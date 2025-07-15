import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import api from '@/services/api' // Comentado por ahora

export const useDashboardStore = defineStore('dashboard', () => {
  // Estado reactivo
  const loading = ref(false)
  const error = ref(null)

  // Métricas de eficiencia (RF13.1)
  const efficiencyMetrics = ref({
    lossPercentage: 13.5,
    totalConsumption: 15420,
    totalLosses: 2082,
    efficiencyRate: 86.5
  })

  // Estadísticas de componentes (RF13.2)
  const componentStats = ref({
    activeValves: 245,
    failedValves: 12,
    totalDevices: 320,
    activeDevices: 298
  })

  // Datos de consumo y pérdidas (RF13.3)
  const consumptionData = ref({
    daily: [
      { time: '06:00', consumption: 220, losses: 30 },
      { time: '08:00', consumption: 180, losses: 25 },
      { time: '10:00', consumption: 120, losses: 15 },
      { time: '12:00', consumption: 90, losses: 12 },
      { time: '14:00', consumption: 110, losses: 18 },
      { time: '16:00', consumption: 160, losses: 22 },
      { time: '18:00', consumption: 200, losses: 28 },
      { time: '20:00', consumption: 140, losses: 20 }
    ],
    weekly: [
      { day: 'Lun', consumption: 1200, losses: 180 },
      { day: 'Mar', consumption: 980, losses: 147 },
      { day: 'Mié', consumption: 1100, losses: 165 },
      { day: 'Jue', consumption: 900, losses: 135 },
      { day: 'Vie', consumption: 1300, losses: 195 },
      { day: 'Sáb', consumption: 1500, losses: 225 },
      { day: 'Dom', consumption: 1400, losses: 210 }
    ],
    monthly: [
      { date: '1', consumption: 4000, losses: 600 },
      { date: '5', consumption: 4200, losses: 630 },
      { date: '10', consumption: 3900, losses: 585 },
      { date: '15', consumption: 4100, losses: 615 },
      { date: '20', consumption: 4300, losses: 645 },
      { date: '25', consumption: 4400, losses: 660 },
      { date: '30', consumption: 4200, losses: 630 }
    ],
    yearly: [
      { month: 'Ene', consumption: 48000, losses: 7200 },
      { month: 'Feb', consumption: 47000, losses: 7050 },
      { month: 'Mar', consumption: 50000, losses: 7500 },
      { month: 'Abr', consumption: 52000, losses: 7800 },
      { month: 'May', consumption: 51000, losses: 7650 },
      { month: 'Jun', consumption: 53000, losses: 7950 },
      { month: 'Jul', consumption: 54000, losses: 8100 },
      { month: 'Ago', consumption: 52000, losses: 7800 },
      { month: 'Sep', consumption: 51000, losses: 7650 },
      { month: 'Oct', consumption: 50000, losses: 7500 },
      { month: 'Nov', consumption: 49000, losses: 7350 },
      { month: 'Dic', consumption: 48000, losses: 7200 }
    ]
  })

  // Cards de resumen (RF14.1)
  const summaryCards = ref({
    gateways: { active: 45, inactive: 3 },
    meters: { total: 1250, newToday: 8, failed: 23, newYesterday: 12 },
    users: { registered: 3420, newThisMonth: 156 }
  })

  // Sectores de alto consumo (RF14.3)
  const highConsumptionSectors = ref([
    { sector: 'Doméstico', consumption: 420, percentage: 28 },
    { sector: 'Comercial', consumption: 320, percentage: 21 },
    { sector: 'Industrial', consumption: 510, percentage: 34 },
    { sector: 'Público', consumption: 280, percentage: 12 },
    { sector: 'Agrícola', consumption: 390, percentage: 5 }
  ])

  // Resumen financiero y eficiencia (RF14.4)
  const financialSummary = ref({
    totalRevenue: 1250000,
    monthlyRevenue: 125000,
    efficiencyRate: 86.5,
    waterSavings: 185000
  })

  // Getters computados
  const totalValves = computed(() =>
    componentStats.value.activeValves + componentStats.value.failedValves
  )

  const valveHealthRate = computed(() =>
    totalValves.value > 0 ? (componentStats.value.activeValves / totalValves.value) * 100 : 0
  )

  const deviceHealthRate = computed(() =>
    componentStats.value.totalDevices > 0 ? (componentStats.value.activeDevices / componentStats.value.totalDevices) * 100 : 0
  )

  // Acciones - Por ahora solo simulamos la carga
  const fetchEfficiencyMetrics = async () => {
    try {
      loading.value = true
      error.value = null

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 500))

      // Los datos ya están cargados en el estado inicial
      console.log('Métricas de eficiencia cargadas')
    } catch (err) {
      error.value = 'Error al cargar métricas de eficiencia'
      console.error('Error fetching efficiency metrics:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchComponentStats = async () => {
    try {
      loading.value = true
      error.value = null

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 300))

      console.log('Estadísticas de componentes cargadas')
    } catch (err) {
      error.value = 'Error al cargar estadísticas de componentes'
      console.error('Error fetching component stats:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchConsumptionData = async (period = 'daily') => {
    try {
      loading.value = true
      error.value = null

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 400))

      console.log(`Datos de consumo para ${period} cargados`)
    } catch (err) {
      error.value = 'Error al cargar datos de consumo'
      console.error('Error fetching consumption data:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSummaryCards = async () => {
    try {
      loading.value = true
      error.value = null

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 200))

      console.log('Tarjetas de resumen cargadas')
    } catch (err) {
      error.value = 'Error al cargar tarjetas de resumen'
      console.error('Error fetching summary cards:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchHighConsumptionSectors = async () => {
    try {
      loading.value = true
      error.value = null

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 250))

      console.log('Sectores de alto consumo cargados')
    } catch (err) {
      error.value = 'Error al cargar sectores de alto consumo'
      console.error('Error fetching high consumption sectors:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFinancialSummary = async () => {
    try {
      loading.value = true
      error.value = null

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 350))

      console.log('Resumen financiero cargado')
    } catch (err) {
      error.value = 'Error al cargar resumen financiero'
      console.error('Error fetching financial summary:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAllDashboardData = async () => {
    try {
      loading.value = true
      error.value = null

      console.log('Iniciando carga de datos del dashboard...')

      // Simular carga de todos los datos
      await Promise.all([
        fetchEfficiencyMetrics(),
        fetchComponentStats(),
        fetchConsumptionData(),
        fetchSummaryCards(),
        fetchHighConsumptionSectors(),
        fetchFinancialSummary()
      ])

      console.log('Todos los datos del dashboard cargados exitosamente')
    } catch (err) {
      error.value = 'Error al cargar datos del dashboard'
      console.error('Error fetching all dashboard data:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    loading,
    error,
    efficiencyMetrics,
    componentStats,
    consumptionData,
    summaryCards,
    highConsumptionSectors,
    financialSummary,

    // Getters
    totalValves,
    valveHealthRate,
    deviceHealthRate,

    // Acciones
    fetchEfficiencyMetrics,
    fetchComponentStats,
    fetchConsumptionData,
    fetchSummaryCards,
    fetchHighConsumptionSectors,
    fetchFinancialSummary,
    fetchAllDashboardData
  }
})
