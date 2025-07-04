<template>
  <div class="reports-page">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">📊 Reportes y Analíticas</h1>
          <p class="text-gray-600 mt-1">Genera reportes detallados y analíticas avanzadas de tu sistema IoT</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="saveCurrentReport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="!selectedReportType"
          >
            💾 Guardar Reporte
          </button>
          <button 
            @click="exportReport"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            :disabled="!selectedReportType"
          >
            📤 Exportar
          </button>
        </div>
      </div>
    </div>

    <div class="flex h-full">
      <!-- Sidebar de configuración -->
      <div class="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <!-- Tipo de Reporte -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">📋 Tipo de Reporte</h3>
          <select 
            v-model="selectedReportType" 
            @change="onReportTypeChange"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar tipo de reporte</option>
            <option value="consumo">💧 Consumo Hídrico</option>
            <option value="eficiencia">🔧 Eficiencia Hídrica / Pérdidas</option>
            <option value="dispositivos">📱 Gestión de Dispositivos</option>
            <option value="crm">👥 Atención al Cliente / CRM</option>
            <option value="incidentes">⚠️ Gestión de Incidentes / Denuncias</option>
            <option value="recaudacion">💰 Recaudación / Facturación</option>
          </select>
        </div>

        <!-- Filtros dinámicos -->
        <div v-if="selectedReportType" class="space-y-6">
          <!-- Filtros de fecha -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">📅 Rango de Fechas</h4>
            <div class="space-y-2">
              <select 
                v-model="dateRange" 
                @change="onDateRangeChange"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este año</option>
                <option value="custom">Personalizado</option>
              </select>
              
              <div v-if="dateRange === 'custom'" class="space-y-2">
                <input 
                  type="date" 
                  v-model="customStartDate"
                  class="w-full p-2 border border-gray-300 rounded-lg"
                >
                <input 
                  type="date" 
                  v-model="customEndDate"
                  class="w-full p-2 border border-gray-300 rounded-lg"
                >
              </div>
            </div>
          </div>

          <!-- Filtros específicos por tipo de reporte -->
          <div v-if="reportFilters.length > 0">
            <h4 class="font-medium text-gray-900 mb-2">🔍 Filtros Adicionales</h4>
            <div class="space-y-3">
              <div v-for="filter in reportFilters" :key="filter.key" class="space-y-1">
                <label class="text-sm font-medium text-gray-700">{{ filter.label }}</label>
                <select 
                  v-if="filter.type === 'select'"
                  v-model="filterValues[filter.key]"
                  class="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Todos</option>
                  <option v-for="option in filter.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <input 
                  v-else-if="filter.type === 'text'"
                  v-model="filterValues[filter.key]"
                  :placeholder="filter.placeholder"
                  class="w-full p-2 border border-gray-300 rounded-lg"
                >
              </div>
            </div>
          </div>

          <!-- Configuración de columnas -->
          <div v-if="availableColumns.length > 0">
            <h4 class="font-medium text-gray-900 mb-2">📊 Columnas a Mostrar</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <label 
                v-for="column in availableColumns" 
                :key="column.key"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  v-model="selectedColumns" 
                  :value="column.key"
                  class="rounded border-gray-300"
                >
                <span class="text-sm text-gray-700">{{ column.label }}</span>
              </label>
            </div>
          </div>

          <!-- Agrupamiento -->
          <div v-if="groupingOptions.length > 0">
            <h4 class="font-medium text-gray-900 mb-2">📈 Agrupamiento</h4>
            <select 
              v-model="selectedGrouping"
              class="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sin agrupamiento</option>
              <option v-for="option in groupingOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Botón generar reporte -->
          <button 
            @click="generateReport"
            class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            :disabled="loading"
          >
            <span v-if="loading">⏳ Generando...</span>
            <span v-else>🚀 Generar Reporte</span>
          </button>
        </div>

        <!-- Reportes guardados -->
        <div v-if="savedReports.length > 0" class="mt-8">
          <h4 class="font-medium text-gray-900 mb-3">💾 Reportes Guardados</h4>
          <div class="space-y-2">
            <div 
              v-for="report in savedReports" 
              :key="report.id"
              class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="loadSavedReport(report)"
            >
              <div class="font-medium text-sm text-gray-900">{{ report.name }}</div>
              <div class="text-xs text-gray-500">{{ report.type }} • {{ report.createdAt }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Área principal del reporte -->
      <div class="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div v-if="!selectedReportType" class="text-center py-12">
          <div class="text-6xl mb-4">📊</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Selecciona un tipo de reporte</h2>
          <p class="text-gray-600">Elige el tipo de reporte que deseas generar desde el panel izquierdo</p>
        </div>

        <div v-else-if="loading" class="text-center py-12">
          <div class="text-4xl mb-4">⏳</div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Generando reporte...</h2>
          <p class="text-gray-600">Esto puede tomar unos segundos</p>
        </div>

        <div v-else-if="reportData" class="space-y-6">
          <!-- Resumen del reporte -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📈 Resumen del Reporte</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                v-for="metric in reportMetrics" 
                :key="metric.key"
                class="bg-gray-50 rounded-lg p-4"
              >
                <div class="text-2xl font-bold text-gray-900">{{ metric.value }}</div>
                <div class="text-sm text-gray-600">{{ metric.label }}</div>
              </div>
            </div>
          </div>

          <!-- Gráficos -->
          <div v-if="reportCharts.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Visualizaciones</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                v-for="(chart, idx) in reportCharts" 
                :key="chart.id"
                class="bg-gray-50 rounded-lg p-4"
              >
                <h4 class="font-medium text-gray-900 mb-3">{{ chart.title }}</h4>
                <canvas :ref="el => chartRefs[idx] = el" class="h-64 w-full"></canvas>
              </div>
            </div>
          </div>

          <!-- Tabla de datos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">📋 Datos Detallados</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th 
                      v-for="column in visibleColumns" 
                      :key="column.key"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ column.label }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in reportData" :key="index">
                    <td 
                      v-for="column in visibleColumns" 
                      :key="column.key"
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ row[column.key] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useReportsStore } from '@/stores/reports'
import Chart from 'chart.js/auto'

export default {
  name: 'ReportsPage',
  setup() {
    const reportsStore = useReportsStore()
    
    // Estado reactivo
    const selectedReportType = ref('')
    const dateRange = ref('month')
    const customStartDate = ref('')
    const customEndDate = ref('')
    const filterValues = ref({})
    const selectedColumns = ref([])
    const selectedGrouping = ref('')
    const loading = ref(false)
    const reportData = ref(null)
    const reportMetrics = ref([])
    const reportCharts = ref([])
    const chartRefs = ref([])
    const chartInstances = ref([])

    // Configuraciones de reportes
    const reportConfigs = {
      consumo: {
        filters: [
          { key: 'sector', label: 'Sector/Parroquia', type: 'select', options: [
            { value: 'norte', label: 'Norte' },
            { value: 'sur', label: 'Sur' },
            { value: 'este', label: 'Este' },
            { value: 'oeste', label: 'Oeste' }
          ]},
          { key: 'tipoCliente', label: 'Tipo de Cliente', type: 'select', options: [
            { value: 'residencial', label: 'Residencial' },
            { value: 'comercial', label: 'Comercial' },
            { value: 'industrial', label: 'Industrial' }
          ]},
          { key: 'tipoDispositivo', label: 'Tipo de Dispositivo', type: 'select', options: [
            { value: 'medidor', label: 'Medidor' },
            { value: 'valvula', label: 'Válvula' }
          ]}
        ],
        columns: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'sector', label: 'Sector' },
          { key: 'consumoTotal', label: 'Consumo Total (m³)' },
          { key: 'consumoPromedio', label: 'Consumo Promedio (m³)' },
          { key: 'variacion', label: 'Variación (%)' },
          { key: 'clientes', label: 'N° Clientes' }
        ],
        grouping: [
          { value: 'dia', label: 'Por Día' },
          { value: 'semana', label: 'Por Semana' },
          { value: 'mes', label: 'Por Mes' },
          { value: 'sector', label: 'Por Sector' }
        ]
      },
      eficiencia: {
        filters: [
          { key: 'sector', label: 'Sector', type: 'select', options: [
            { value: 'norte', label: 'Norte' },
            { value: 'sur', label: 'Sur' },
            { value: 'este', label: 'Este' },
            { value: 'oeste', label: 'Oeste' }
          ]},
          { key: 'tipoFuga', label: 'Tipo de Fuga', type: 'select', options: [
            { value: 'red', label: 'Red Principal' },
            { value: 'domiciliaria', label: 'Domiciliaria' },
            { value: 'comercial', label: 'Comercial' }
          ]},
          { key: 'estado', label: 'Estado', type: 'select', options: [
            { value: 'activa', label: 'Activa' },
            { value: 'resuelta', label: 'Resuelta' }
          ]}
        ],
        columns: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'sector', label: 'Sector' },
          { key: 'tipoFuga', label: 'Tipo de Fuga' },
          { key: 'volumenPerdido', label: 'Volumen Perdido (m³)' },
          { key: 'eficiencia', label: 'Eficiencia (%)' },
          { key: 'estado', label: 'Estado' }
        ],
        grouping: [
          { value: 'tipo', label: 'Por Tipo de Fuga' },
          { value: 'sector', label: 'Por Sector' },
          { value: 'estado', label: 'Por Estado' }
        ]
      },
      dispositivos: {
        filters: [
          { key: 'tipo', label: 'Tipo de Dispositivo', type: 'select', options: [
            { value: 'medidor', label: 'Medidor' },
            { value: 'valvula', label: 'Válvula' },
            { value: 'sensor', label: 'Sensor' }
          ]},
          { key: 'estado', label: 'Estado', type: 'select', options: [
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
            { value: 'mantenimiento', label: 'En Mantenimiento' }
          ]},
          { key: 'ubicacion', label: 'Ubicación', type: 'text', placeholder: 'Buscar por ubicación' }
        ],
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'estado', label: 'Estado' },
          { key: 'ubicacion', label: 'Ubicación' },
          { key: 'bateria', label: 'Batería (%)' },
          { key: 'ultimoMantenimiento', label: 'Último Mantenimiento' }
        ],
        grouping: [
          { value: 'tipo', label: 'Por Tipo' },
          { value: 'estado', label: 'Por Estado' },
          { value: 'ubicacion', label: 'Por Ubicación' }
        ]
      },
      crm: {
        filters: [
          { key: 'agente', label: 'Agente', type: 'select', options: [
            { value: 'agente1', label: 'Agente 1' },
            { value: 'agente2', label: 'Agente 2' },
            { value: 'agente3', label: 'Agente 3' }
          ]},
          { key: 'tipo', label: 'Tipo de Consulta', type: 'select', options: [
            { value: 'reclamo', label: 'Reclamo' },
            { value: 'consulta', label: 'Consulta' },
            { value: 'solicitud', label: 'Solicitud' }
          ]},
          { key: 'estado', label: 'Estado', type: 'select', options: [
            { value: 'abierto', label: 'Abierto' },
            { value: 'en_proceso', label: 'En Proceso' },
            { value: 'cerrado', label: 'Cerrado' }
          ]}
        ],
        columns: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'agente', label: 'Agente' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'tiempoRespuesta', label: 'Tiempo Respuesta (min)' },
          { key: 'tiempoResolucion', label: 'Tiempo Resolución (hrs)' },
          { key: 'satisfaccion', label: 'Satisfacción' }
        ],
        grouping: [
          { value: 'agente', label: 'Por Agente' },
          { value: 'tipo', label: 'Por Tipo' },
          { value: 'estado', label: 'Por Estado' }
        ]
      },
      incidentes: {
        filters: [
          { key: 'tipo', label: 'Tipo de Incidente', type: 'select', options: [
            { value: 'fuga', label: 'Fuga' },
            { value: 'corte', label: 'Corte de Servicio' },
            { value: 'contaminacion', label: 'Contaminación' }
          ]},
          { key: 'prioridad', label: 'Prioridad', type: 'select', options: [
            { value: 'baja', label: 'Baja' },
            { value: 'media', label: 'Media' },
            { value: 'alta', label: 'Alta' },
            { value: 'critica', label: 'Crítica' }
          ]},
          { key: 'estado', label: 'Estado', type: 'select', options: [
            { value: 'abierto', label: 'Abierto' },
            { value: 'en_proceso', label: 'En Proceso' },
            { value: 'resuelto', label: 'Resuelto' }
          ]}
        ],
        columns: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'prioridad', label: 'Prioridad' },
          { key: 'estado', label: 'Estado' },
          { key: 'tiempoResolucion', label: 'Tiempo Resolución (hrs)' },
          { key: 'tecnico', label: 'Técnico Asignado' }
        ],
        grouping: [
          { value: 'tipo', label: 'Por Tipo' },
          { value: 'prioridad', label: 'Por Prioridad' },
          { value: 'estado', label: 'Por Estado' }
        ]
      },
      recaudacion: {
        filters: [
          { key: 'tipoServicio', label: 'Tipo de Servicio', type: 'select', options: [
            { value: 'agua', label: 'Agua' },
            { value: 'alcantarillado', label: 'Alcantarillado' },
            { value: 'otros', label: 'Otros' }
          ]},
          { key: 'estado', label: 'Estado del Cobro', type: 'select', options: [
            { value: 'pagado', label: 'Pagado' },
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'vencido', label: 'Vencido' }
          ]},
          { key: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Buscar por cliente' }
        ],
        columns: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'cliente', label: 'Cliente' },
          { key: 'tipoServicio', label: 'Tipo de Servicio' },
          { key: 'monto', label: 'Monto ($)' },
          { key: 'estado', label: 'Estado' },
          { key: 'fechaPago', label: 'Fecha de Pago' }
        ],
        grouping: [
          { value: 'mes', label: 'Por Mes' },
          { value: 'tipoServicio', label: 'Por Tipo de Servicio' },
          { value: 'estado', label: 'Por Estado' }
        ]
      }
    }

    // Computed properties
    const reportFilters = computed(() => {
      return selectedReportType.value ? reportConfigs[selectedReportType.value]?.filters || [] : []
    })

    const availableColumns = computed(() => {
      return selectedReportType.value ? reportConfigs[selectedReportType.value]?.columns || [] : []
    })

    const groupingOptions = computed(() => {
      return selectedReportType.value ? reportConfigs[selectedReportType.value]?.grouping || [] : []
    })

    const visibleColumns = computed(() => {
      if (selectedColumns.value.length === 0) {
        return availableColumns.value
      }
      return availableColumns.value.filter(col => selectedColumns.value.includes(col.key))
    })

    const savedReports = computed(() => reportsStore.savedReports)

    // Methods
    const onReportTypeChange = () => {
      // Resetear valores cuando cambia el tipo de reporte
      filterValues.value = {}
      selectedColumns.value = []
      selectedGrouping.value = ''
      reportData.value = null
      reportMetrics.value = []
      reportCharts.value = []
    }

    const onDateRangeChange = () => {
      if (dateRange.value !== 'custom') {
        customStartDate.value = ''
        customEndDate.value = ''
      }
    }

    const generateReport = async () => {
      loading.value = true
      try {
        const reportConfig = {
          type: selectedReportType.value,
          dateRange: dateRange.value,
          customStartDate: customStartDate.value,
          customEndDate: customEndDate.value,
          filters: filterValues.value,
          columns: selectedColumns.value,
          grouping: selectedGrouping.value
        }

        const result = await reportsStore.generateReport(reportConfig)
        
        reportData.value = result.data
        reportMetrics.value = result.metrics
        reportCharts.value = result.charts
      } catch (error) {
        console.error('Error generando reporte:', error)
      } finally {
        loading.value = false
      }
    }

    const saveCurrentReport = async () => {
      const name = prompt('Nombre del reporte:')
      if (name) {
        const reportConfig = {
          name,
          type: selectedReportType.value,
          dateRange: dateRange.value,
          customStartDate: customStartDate.value,
          customEndDate: customEndDate.value,
          filters: filterValues.value,
          columns: selectedColumns.value,
          grouping: selectedGrouping.value
        }
        await reportsStore.saveReport(reportConfig)
      }
    }

    const loadSavedReport = (report) => {
      selectedReportType.value = report.type
      dateRange.value = report.dateRange
      customStartDate.value = report.customStartDate
      customEndDate.value = report.customEndDate
      filterValues.value = report.filters
      selectedColumns.value = report.columns
      selectedGrouping.value = report.grouping
      
      // Generar el reporte automáticamente
      generateReport()
    }

    const exportReport = () => {
      if (!reportData.value) return
      
      const format = prompt('Formato de exportación (csv/pdf):', 'csv')
      if (format) {
        reportsStore.exportReport(reportData.value, format)
      }
    }

    // Renderizar gráficos con Chart.js
    const renderCharts = async () => {
      await nextTick()
      // Limpiar instancias previas
      chartInstances.value.forEach(instance => instance && instance.destroy())
      chartInstances.value = []
      if (!reportCharts.value) return
      reportCharts.value.forEach((chart, idx) => {
        const ctx = chartRefs.value[idx]?.getContext('2d')
        if (ctx) {
          const instance = new Chart(ctx, {
            type: chart.type || 'bar',
            data: chart.data,
            options: chart.options || {}
          })
          chartInstances.value.push(instance)
        }
      })
    }

    // Observar cambios en reportCharts
    onMounted(renderCharts)
    watch(reportCharts, renderCharts)

    // Lifecycle
    onMounted(() => {
      reportsStore.loadSavedReports()
    })

    return {
      selectedReportType,
      dateRange,
      customStartDate,
      customEndDate,
      filterValues,
      selectedColumns,
      selectedGrouping,
      loading,
      reportData,
      reportMetrics,
      reportCharts,
      reportFilters,
      availableColumns,
      groupingOptions,
      visibleColumns,
      savedReports,
      onReportTypeChange,
      onDateRangeChange,
      generateReport,
      saveCurrentReport,
      loadSavedReport,
      exportReport,
      chartRefs
    }
  }
}
</script>

<style scoped>
.reports-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 