import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useReportsStore = defineStore('reports', () => {
  // Estado reactivo
  const loading = ref(false)
  const error = ref(null)
  const savedReports = ref([])
  const currentReport = ref(null)

  // Getters
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const errorMessage = computed(() => error.value)

  // Acciones
  const generateReport = async (config) => {
    loading.value = true
    error.value = null

    try {
      // Simular llamada a API - en producción esto sería una llamada real
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generar datos de ejemplo basados en el tipo de reporte
      const mockData = generateMockData(config)

      return {
        data: mockData.data,
        metrics: mockData.metrics,
        charts: mockData.charts
      }
    } catch (err) {
      error.value = 'Error al generar el reporte: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const saveReport = async (reportConfig) => {
    try {
      // En producción, esto sería una llamada a la API
      const savedReport = {
        id: Date.now(),
        ...reportConfig,
        createdAt: new Date().toLocaleDateString()
      }

      savedReports.value.push(savedReport)

      // Guardar en localStorage como respaldo
      localStorage.setItem('savedReports', JSON.stringify(savedReports.value))

      return savedReport
    } catch (err) {
      error.value = 'Error al guardar el reporte: ' + err.message
      throw err
    }
  }

  const loadSavedReports = async () => {
    try {
      // Cargar desde localStorage
      const stored = localStorage.getItem('savedReports')
      if (stored) {
        savedReports.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('Error cargando reportes guardados:', err)
    }
  }

  const deleteSavedReport = async (reportId) => {
    try {
      savedReports.value = savedReports.value.filter(r => r.id !== reportId)
      localStorage.setItem('savedReports', JSON.stringify(savedReports.value))
    } catch (err) {
      error.value = 'Error al eliminar el reporte: ' + err.message
      throw err
    }
  }

  const exportReport = (data, format) => {
    try {
      if (format === 'csv') {
        exportToCSV(data)
      } else if (format === 'pdf') {
        exportToPDF(data)
      }
    } catch (err) {
      error.value = 'Error al exportar el reporte: ' + err.message
      throw err
    }
  }

  // Funciones auxiliares para generar datos de ejemplo
  const generateMockData = (config) => {
    const { type } = config

    switch (type) {
      case 'consumo':
        return generateConsumoData()
      case 'eficiencia':
        return generateEficienciaData()
      case 'dispositivos':
        return generateDispositivosData()
      case 'crm':
        return generateCRMData()
      case 'incidentes':
        return generateIncidentesData()
      case 'recaudacion':
        return generateRecaudacionData()
      default:
        return { data: [], metrics: [], charts: [] }
    }
  }

  const generateConsumoData = () => {
    const data = [
      { fecha: '2024-01-01', sector: 'Norte', consumoTotal: 1250, consumoPromedio: 125, variacion: 5.2, clientes: 150 },
      { fecha: '2024-01-02', sector: 'Sur', consumoTotal: 980, consumoPromedio: 98, variacion: -2.1, clientes: 120 },
      { fecha: '2024-01-03', sector: 'Este', consumoTotal: 1100, consumoPromedio: 110, variacion: 1.8, clientes: 135 },
      { fecha: '2024-01-04', sector: 'Oeste', consumoTotal: 1350, consumoPromedio: 135, variacion: 8.5, clientes: 160 },
      { fecha: '2024-01-05', sector: 'Norte', consumoTotal: 1180, consumoPromedio: 118, variacion: -1.2, clientes: 145 }
    ]

    const metrics = [
      { key: 'totalConsumo', label: 'Consumo Total', value: '5,860 m³' },
      { key: 'promedioDiario', label: 'Promedio Diario', value: '1,172 m³' },
      { key: 'variacionPromedio', label: 'Variación Promedio', value: '+2.4%' },
      { key: 'totalClientes', label: 'Total Clientes', value: '710' }
    ]

    const charts = [
      { id: 1, title: 'Tendencia de Consumo', type: 'line' },
      { id: 2, title: 'Consumo por Sector', type: 'bar' }
    ]

    return { data, metrics, charts }
  }

  const generateEficienciaData = () => {
    const data = [
      { fecha: '2024-01-01', sector: 'Norte', tipoFuga: 'Red Principal', volumenPerdido: 45, eficiencia: 92.5, estado: 'Resuelta' },
      { fecha: '2024-01-02', sector: 'Sur', tipoFuga: 'Domiciliaria', volumenPerdido: 12, eficiencia: 97.8, estado: 'Activa' },
      { fecha: '2024-01-03', sector: 'Este', tipoFuga: 'Comercial', volumenPerdido: 28, eficiencia: 94.2, estado: 'Resuelta' },
      { fecha: '2024-01-04', sector: 'Oeste', tipoFuga: 'Red Principal', volumenPerdido: 35, eficiencia: 93.5, estado: 'Activa' },
      { fecha: '2024-01-05', sector: 'Norte', tipoFuga: 'Domiciliaria', volumenPerdido: 8, eficiencia: 98.4, estado: 'Resuelta' }
    ]

    const metrics = [
      { key: 'totalPerdido', label: 'Volumen Perdido', value: '128 m³' },
      { key: 'eficienciaPromedio', label: 'Eficiencia Promedio', value: '95.3%' },
      { key: 'fugasActivas', label: 'Fugas Activas', value: '2' },
      { key: 'fugasResueltas', label: 'Fugas Resueltas', value: '3' }
    ]

    const charts = [
      { id: 1, title: 'Distribución por Tipo de Fuga', type: 'pie' },
      { id: 2, title: 'Evolución de Pérdidas', type: 'line' }
    ]

    return { data, metrics, charts }
  }

  const generateDispositivosData = () => {
    const data = [
      { id: 'DEV001', tipo: 'Medidor', estado: 'Activo', ubicacion: 'Sector Norte', bateria: 85, ultimoMantenimiento: '2024-01-15' },
      { id: 'DEV002', tipo: 'Válvula', estado: 'Activo', ubicacion: 'Sector Sur', bateria: 92, ultimoMantenimiento: '2024-01-10' },
      { id: 'DEV003', tipo: 'Sensor', estado: 'Mantenimiento', ubicacion: 'Sector Este', bateria: 15, ultimoMantenimiento: '2024-01-20' },
      { id: 'DEV004', tipo: 'Medidor', estado: 'Inactivo', ubicacion: 'Sector Oeste', bateria: 0, ultimoMantenimiento: '2024-01-05' },
      { id: 'DEV005', tipo: 'Válvula', estado: 'Activo', ubicacion: 'Sector Norte', bateria: 78, ultimoMantenimiento: '2024-01-12' }
    ]

    const metrics = [
      { key: 'totalDispositivos', label: 'Total Dispositivos', value: '5' },
      { key: 'activos', label: 'Activos', value: '3' },
      { key: 'bateriaPromedio', label: 'Batería Promedio', value: '54%' },
      { key: 'mantenimiento', label: 'En Mantenimiento', value: '1' }
    ]

    const charts = [
      { id: 1, title: 'Estado por Tipo', type: 'bar' },
      { id: 2, title: 'Nivel de Batería', type: 'doughnut' }
    ]

    return { data, metrics, charts }
  }

  const generateCRMData = () => {
    const data = [
      { fecha: '2024-01-01', agente: 'Agente 1', tipo: 'Reclamo', tiempoRespuesta: 15, tiempoResolucion: 2.5, satisfaccion: 4 },
      { fecha: '2024-01-02', agente: 'Agente 2', tipo: 'Consulta', tiempoRespuesta: 8, tiempoResolucion: 1.2, satisfaccion: 5 },
      { fecha: '2024-01-03', agente: 'Agente 1', tipo: 'Solicitud', tiempoRespuesta: 12, tiempoResolucion: 3.8, satisfaccion: 3 },
      { fecha: '2024-01-04', agente: 'Agente 3', tipo: 'Reclamo', tiempoRespuesta: 20, tiempoResolucion: 4.2, satisfaccion: 2 },
      { fecha: '2024-01-05', agente: 'Agente 2', tipo: 'Consulta', tiempoRespuesta: 6, tiempoResolucion: 0.8, satisfaccion: 5 }
    ]

    const metrics = [
      { key: 'totalCasos', label: 'Total Casos', value: '5' },
      { key: 'tiempoRespuestaPromedio', label: 'Tiempo Respuesta Promedio', value: '12.2 min' },
      { key: 'tiempoResolucionPromedio', label: 'Tiempo Resolución Promedio', value: '2.5 hrs' },
      { key: 'satisfaccionPromedio', label: 'Satisfacción Promedio', value: '3.8/5' }
    ]

    const charts = [
      { id: 1, title: 'Casos por Agente', type: 'bar' },
      { id: 2, title: 'Tiempo de Respuesta', type: 'line' }
    ]

    return { data, metrics, charts }
  }

  const generateIncidentesData = () => {
    const data = [
      { fecha: '2024-01-01', tipo: 'Fuga', prioridad: 'Alta', estado: 'Resuelto', tiempoResolucion: 4.5, tecnico: 'Técnico A' },
      { fecha: '2024-01-02', tipo: 'Corte de Servicio', prioridad: 'Crítica', estado: 'En Proceso', tiempoResolucion: 8.2, tecnico: 'Técnico B' },
      { fecha: '2024-01-03', tipo: 'Contaminación', prioridad: 'Media', estado: 'Abierto', tiempoResolucion: 0, tecnico: 'Técnico C' },
      { fecha: '2024-01-04', tipo: 'Fuga', prioridad: 'Baja', estado: 'Resuelto', tiempoResolucion: 2.1, tecnico: 'Técnico A' },
      { fecha: '2024-01-05', tipo: 'Corte de Servicio', prioridad: 'Alta', estado: 'En Proceso', tiempoResolucion: 6.8, tecnico: 'Técnico B' }
    ]

    const metrics = [
      { key: 'totalIncidentes', label: 'Total Incidentes', value: '5' },
      { key: 'resueltos', label: 'Resueltos', value: '2' },
      { key: 'tiempoResolucionPromedio', label: 'Tiempo Resolución Promedio', value: '4.3 hrs' },
      { key: 'enProceso', label: 'En Proceso', value: '2' }
    ]

    const charts = [
      { id: 1, title: 'Incidentes por Tipo', type: 'bar' },
      { id: 2, title: 'Tendencia de Resolución', type: 'line' }
    ]

    return { data, metrics, charts }
  }

  const generateRecaudacionData = () => {
    const data = [
      { fecha: '2024-01-01', cliente: 'Cliente A', tipoServicio: 'Agua', monto: 45.50, estado: 'Pagado', fechaPago: '2024-01-01' },
      { fecha: '2024-01-02', cliente: 'Cliente B', tipoServicio: 'Alcantarillado', monto: 32.80, estado: 'Pendiente', fechaPago: null },
      { fecha: '2024-01-03', cliente: 'Cliente C', tipoServicio: 'Agua', monto: 28.90, estado: 'Vencido', fechaPago: null },
      { fecha: '2024-01-04', cliente: 'Cliente D', tipoServicio: 'Otros', monto: 15.20, estado: 'Pagado', fechaPago: '2024-01-04' },
      { fecha: '2024-01-05', cliente: 'Cliente E', tipoServicio: 'Agua', monto: 52.30, estado: 'Pendiente', fechaPago: null }
    ]

    const metrics = [
      { key: 'totalRecaudado', label: 'Total Recaudado', value: '$61.70' },
      { key: 'totalPendiente', label: 'Total Pendiente', value: '$85.10' },
      { key: 'porcentajeMorosidad', label: 'Porcentaje Morosidad', value: '58%' },
      { key: 'promedioPago', label: 'Promedio Tiempo Pago', value: '2.5 días' }
    ]

    const charts = [
      { id: 1, title: 'Recaudación Mensual', type: 'bar' },
      { id: 2, title: 'Tendencia de Pagos', type: 'line' }
    ]

    return { data, metrics, charts }
  }

  // Funciones de exportación
  const exportToCSV = (data) => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reporte_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = (data) => {
    // En producción, esto usaría una librería como jsPDF
    alert('Exportación a PDF - Funcionalidad en desarrollo')
  }

  return {
    // Estado
    loading,
    error,
    savedReports,
    currentReport,

    // Getters
    isLoading,
    hasError,
    errorMessage,

    // Acciones
    generateReport,
    saveReport,
    loadSavedReports,
    deleteSavedReport,
    exportReport
  }
}) 