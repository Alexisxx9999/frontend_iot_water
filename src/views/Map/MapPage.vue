<template>
  <div class="map-page">
    <!-- Header con título y acciones -->
    <div class="page-header">
      <div class="header-content">
        <h1>Visualización Territorial y Geográfica</h1>
        <p>Monitoreo del consumo hídrico por zonas administrativas y parroquias</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showMeterModal = true">
          <i class="fas fa-plus"></i>
          Agregar Medidor
        </button>
        <button class="btn btn-secondary" @click="exportData">
          <i class="fas fa-download"></i>
          Exportar Datos
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filters-grid">
        <!-- Filtro de Administración Zonal -->
        <div class="filter-group">
          <label for="zonalAdmin">Administración Zonal</label>
          <select 
            id="zonalAdmin" 
            v-model="filters.zonalAdmin"
            @change="applyFilters"
          >
            <option value="">Todas las zonas</option>
            <option 
              v-for="admin in zonalAdministrations" 
              :key="admin.id" 
              :value="admin.id"
            >
              {{ admin.name }}
            </option>
          </select>
        </div>

        <!-- Filtro de Tipo de Parroquia -->
        <div class="filter-group">
          <label for="parishType">Tipo de Parroquia</label>
          <select 
            id="parishType" 
            v-model="filters.parishType"
            @change="applyFilters"
          >
            <option value="">Todos los tipos</option>
            <option value="urbana">Urbana</option>
            <option value="rural">Rural</option>
            <option value="mixta">Mixta</option>
          </select>
        </div>

        <!-- Filtro de Período de Tiempo -->
        <div class="filter-group">
          <label for="timePeriod">Período de Tiempo</label>
          <select 
            id="timePeriod" 
            v-model="filters.timePeriod"
            @change="applyFilters"
          >
            <option value="last_month">Último mes</option>
            <option value="last_3_months">Últimos 3 meses</option>
            <option value="last_year">Último año</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <!-- Filtro de Rango de Consumo -->
        <div class="filter-group">
          <label for="consumptionRange">Rango de Consumo</label>
          <select 
            id="consumptionRange" 
            v-model="filters.consumptionRange"
            @change="applyFilters"
          >
            <option value="">Todos los rangos</option>
            <option value="bajo">Bajo (0-25%)</option>
            <option value="medio">Medio (25-50%)</option>
            <option value="alto">Alto (50-75%)</option>
            <option value="muy_alto">Muy Alto (75-100%)</option>
          </select>
        </div>
      </div>

      <!-- Fechas personalizadas -->
      <div v-if="filters.timePeriod === 'custom'" class="custom-dates">
        <div class="date-group">
          <label for="startDate">Fecha Inicio</label>
          <input 
            id="startDate" 
            v-model="filters.startDate" 
            type="date"
            @change="applyFilters"
          />
        </div>
        <div class="date-group">
          <label for="endDate">Fecha Fin</label>
          <input 
            id="endDate" 
            v-model="filters.endDate" 
            type="date"
            @change="applyFilters"
          />
        </div>
      </div>

      <!-- Botón limpiar filtros -->
      <div class="filters-actions">
        <button class="btn btn-outline" @click="clearFilters">
          <i class="fas fa-times"></i>
          Limpiar Filtros
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Panel izquierdo - Mapa y gráficos -->
      <div class="left-panel">
        <!-- Mapa interactivo -->
        <div class="map-container">
          <div class="map-header">
            <h3>Mapa de Consumo Hídrico</h3>
            <div class="map-legend">
              <div class="legend-item" v-for="(range, key) in consumptionRanges" :key="key">
                <div class="legend-color" :style="{ backgroundColor: range.color }"></div>
                <span class="legend-label">{{ range.label }}</span>
              </div>
            </div>
          </div>
          
          <div class="map-content">
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Cargando mapa...</p>
            </div>
            
            <EcuadorMapLeaflet v-else />
          </div>
        </div>

        <!-- Gráficos -->
        <div class="charts-section">
          <div class="charts-grid">
            <!-- Gráfico de consumo por administración zonal -->
            <div class="chart-card">
              <MapConsumptionChart 
                :data="chartData.consumptionByZonal"
                :loading="loading"
              />
            </div>

            <!-- Gráfico de variación temporal -->
            <div class="chart-card">
              <div class="chart-container">
                <div class="chart-header">
                  <h4>Variación Temporal del Consumo</h4>
                </div>
                <div class="chart-content">
                  <div v-if="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Cargando datos...</p>
                  </div>
                  <div v-else-if="!chartData.temporalVariation.length" class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <p>No hay datos disponibles</p>
                  </div>
                  <div v-else class="temporal-chart">
                    <div 
                      v-for="(item, index) in chartData.temporalVariation" 
                      :key="index"
                      class="chart-point"
                    >
                      <div class="point-label">{{ item.month }}</div>
                      <div class="point-value">{{ item.consumption.toFixed(1) }} m³</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráfico de distribución por parroquia -->
            <div class="chart-card">
              <div class="chart-container">
                <div class="chart-header">
                  <h4>Distribución por Tipo de Parroquia</h4>
                </div>
                <div class="chart-content">
                  <div v-if="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Cargando datos...</p>
                  </div>
                  <div v-else-if="!chartData.distributionByParish.length" class="empty-state">
                    <i class="fas fa-chart-pie"></i>
                    <p>No hay datos disponibles</p>
                  </div>
                  <div v-else class="distribution-chart">
                    <div 
                      v-for="(item, index) in chartData.distributionByParish" 
                      :key="index"
                      class="distribution-item"
                    >
                      <div class="distribution-bar">
                        <div 
                          class="distribution-fill"
                          :style="{ width: `${item.percentage}%` }"
                        ></div>
                      </div>
                      <div class="distribution-info">
                        <span class="distribution-type">{{ item.type }}</span>
                        <span class="distribution-value">{{ item.consumption.toFixed(1) }} m³ ({{ item.percentage }}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Información y resumen -->
      <div class="right-panel">
        <!-- Resumen general -->
        <div class="summary-card">
          <h3>Resumen General</h3>
          <div class="summary-stats">
            <div class="summary-item">
              <div class="summary-icon">
                <i class="fas fa-tint"></i>
              </div>
              <div class="summary-content">
                <span class="summary-value">{{ consumptionSummary.totalConsumption?.toFixed(1) || '0.0' }}</span>
                <span class="summary-label">Consumo Total (m³)</span>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="summary-content">
                <span class="summary-value" :class="getVariationClass(consumptionSummary.monthlyVariation)">
                  {{ consumptionSummary.monthlyVariation > 0 ? '+' : '' }}{{ consumptionSummary.monthlyVariation?.toFixed(1) || '0.0' }}%
                </span>
                <span class="summary-label">Variación Mensual</span>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="summary-content">
                <span class="summary-value">{{ consumptionSummary.totalParishes || 0 }}</span>
                <span class="summary-label">Parroquias</span>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">
                <i class="fas fa-building"></i>
              </div>
              <div class="summary-content">
                <span class="summary-value">{{ consumptionSummary.totalZonalAdmins || 0 }}</span>
                <span class="summary-label">Zonas Administrativas</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Información de zona seleccionada -->
        <div v-if="selectedZone" class="zone-details-card">
          <h3>Información de Zona</h3>
          <div class="zone-info">
            <h4>{{ selectedZone.name }}</h4>
            <div class="zone-stats">
              <div class="zone-stat">
                <span class="stat-label">Consumo:</span>
                <span class="stat-value">{{ selectedZone.consumption?.toFixed(1) }} m³</span>
              </div>
              <div class="zone-stat">
                <span class="stat-label">Variación:</span>
                <span class="stat-value" :class="getVariationClass(selectedZone.variation)">
                  {{ selectedZone.variation > 0 ? '+' : '' }}{{ selectedZone.variation?.toFixed(1) }}%
                </span>
              </div>
            </div>
            
            <div class="zone-parishes">
              <h5>Parroquias Asociadas</h5>
              <div class="parish-list">
                <div 
                  v-for="parish in selectedZone.parishes" 
                  :key="parish.id"
                  class="parish-item"
                >
                  <span class="parish-name">{{ parish.name }}</span>
                  <span class="parish-type">{{ parish.type }}</span>
                  <span class="parish-consumption">{{ parish.consumption?.toFixed(1) }} m³</span>
                </div>
              </div>
            </div>
            
            <div class="zone-meters">
              <h5>Medidores en la Zona</h5>
              <div class="meter-list">
                <div 
                  v-for="meter in selectedZone.meters" 
                  :key="meter.id"
                  class="meter-item"
                >
                  <span class="meter-serial">{{ meter.serialNumber }}</span>
                  <span class="meter-status" :class="getStatusClass(meter.status)">
                    {{ getStatusLabel(meter.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de medidores -->
        <div class="meters-card">
          <div class="card-header">
            <h3>Medidores en el Mapa</h3>
            <button class="btn btn-sm btn-outline" @click="refreshMeters">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
          
          <div class="meters-list">
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Cargando medidores...</p>
            </div>
            
            <div v-else-if="!filteredMeters.length" class="empty-state">
              <i class="fas fa-map-marker-alt"></i>
              <p>No hay medidores disponibles</p>
            </div>
            
            <div v-else class="meter-items">
              <div 
                v-for="meter in filteredMeters" 
                :key="meter.id"
                class="meter-item"
                @click="selectMeter(meter)"
              >
                <div class="meter-info">
                  <div class="meter-serial">{{ meter.serialNumber }}</div>
                  <div class="meter-location">{{ getParishName(meter.parishId) }}</div>
                </div>
                <div class="meter-actions">
                  <span class="meter-status" :class="getStatusClass(meter.status)">
                    {{ getStatusLabel(meter.status) }}
                  </span>
                  <div class="action-buttons">
                    <button 
                      class="btn-icon"
                      @click.stop="editMeter(meter)"
                      title="Editar"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn-icon btn-danger"
                      @click.stop="deleteMeter(meter)"
                      title="Eliminar"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <MapMeterModal
      :is-visible="showMeterModal"
      :meter="selectedMeterForEdit"
      @close="closeMeterModal"
      @saved="onMeterSaved"
    />

    <DeleteMeterModal
      :is-visible="showDeleteModal"
      :meter="selectedMeterForDelete"
      @close="closeDeleteModal"
      @deleted="onMeterDeleted"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useMapStore } from '@/stores/map'
import { CONSUMPTION_RANGES, TIME_PERIODS } from '@/services/map.service'
import MapMeterModal from '@/components/map/MapMeterModal.vue'
import DeleteMeterModal from '@/components/map/DeleteMeterModal.vue'
import MapConsumptionChart from '@/components/map/MapConsumptionChart.vue'
import EcuadorMapLeaflet from '@/components/map/EcuadorMapLeaflet.vue'

export default {
  name: 'MapPage',
  components: {
    MapMeterModal,
    DeleteMeterModal,
    MapConsumptionChart,
    EcuadorMapLeaflet
  },
  setup() {
    const mapStore = useMapStore()
    
    // Estado reactivo
    const loading = ref(false)
    const showMeterModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedMeterForEdit = ref(null)
    const selectedMeterForDelete = ref(null)
    
    // Filtros
    const filters = reactive({
      zonalAdmin: '',
      parishType: '',
      timePeriod: TIME_PERIODS.ULTIMO_MES,
      consumptionRange: '',
      startDate: '',
      endDate: ''
    })

    // Constantes
    const consumptionRanges = CONSUMPTION_RANGES

    // Computed properties
    const zonalAdministrations = computed(() => mapStore.getZonalAdministrations)
    const parishes = computed(() => mapStore.getParishes)
    const meters = computed(() => mapStore.getMeters)
    const selectedZone = computed(() => mapStore.getSelectedZone)
    const consumptionSummary = computed(() => mapStore.getConsumptionSummary)
    const chartData = computed(() => mapStore.getChartData)
    const filteredParishes = computed(() => mapStore.getFilteredParishes)
    const filteredMeters = computed(() => mapStore.getFilteredMeters)

    const totalConsumption = computed(() => {
      return filteredParishes.value.reduce((sum, parish) => sum + (parish.consumption || 0), 0)
    })

    // Métodos
    const loadData = async () => {
      loading.value = true
      try {
        await Promise.all([
          mapStore.fetchZonalAdministrations(),
          mapStore.fetchParishes(),
          mapStore.fetchMeters(),
          mapStore.fetchConsumptionSummary(),
          mapStore.fetchConsumptionHistory(),
          mapStore.fetchChartData()
        ])
      } catch (error) {
        console.error('Error loading map data:', error)
      } finally {
        loading.value = false
      }
    }

    const applyFilters = () => {
      mapStore.setFilters(filters)
      loadData()
    }

    const clearFilters = () => {
      Object.assign(filters, {
        zonalAdmin: '',
        parishType: '',
        timePeriod: TIME_PERIODS.ULTIMO_MES,
        consumptionRange: '',
        startDate: '',
        endDate: ''
      })
      mapStore.clearFilters()
      loadData()
    }

    const exportData = async () => {
      try {
        await mapStore.exportMapData('excel')
      } catch (error) {
        console.error('Error exporting data:', error)
      }
    }

    const refreshMeters = () => {
      loadData()
    }

    const selectMeter = (meter) => {
      // Aquí se podría implementar la selección en el mapa
      // console.log('Meter selected:', meter)
    }

    const editMeter = (meter) => {
      selectedMeterForEdit.value = meter
      showMeterModal.value = true
    }

    const deleteMeter = (meter) => {
      selectedMeterForDelete.value = meter
      showDeleteModal.value = true
    }

    const closeMeterModal = () => {
      showMeterModal.value = false
      selectedMeterForEdit.value = null
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      selectedMeterForDelete.value = null
    }

    const onMeterSaved = () => {
      loadData()
    }

    const onMeterDeleted = () => {
      loadData()
    }

    const getParishName = (parishId) => {
      const parish = parishes.value.find(p => p.id === parishId)
      return parish ? parish.name : 'N/A'
    }

    const getStatusLabel = (status) => {
      const statusLabels = {
        active: 'Activo',
        inactive: 'Inactivo',
        maintenance: 'En Mantenimiento',
        fault: 'En Falla',
        disconnected: 'Desconectado'
      }
      return statusLabels[status] || 'Desconocido'
    }

    const getStatusClass = (status) => {
      const statusClasses = {
        active: 'status-active',
        inactive: 'status-inactive',
        maintenance: 'status-maintenance',
        fault: 'status-fault',
        disconnected: 'status-disconnected'
      }
      return statusClasses[status] || 'status-unknown'
    }

    const getVariationClass = (variation) => {
      if (!variation) return ''
      return variation > 0 ? 'variation-positive' : 'variation-negative'
    }

    // Lifecycle
    onMounted(() => {
      loadData()
    })

    return {
      // Estado
      loading,
      showMeterModal,
      showDeleteModal,
      selectedMeterForEdit,
      selectedMeterForDelete,
      filters,
      consumptionRanges,
      
      // Computed
      zonalAdministrations,
      parishes,
      meters,
      selectedZone,
      consumptionSummary,
      chartData,
      filteredParishes,
      filteredMeters,
      totalConsumption,
      
      // Métodos
      loadData,
      applyFilters,
      clearFilters,
      exportData,
      refreshMeters,
      selectMeter,
      editMeter,
      deleteMeter,
      closeMeterModal,
      closeDeleteModal,
      onMeterSaved,
      onMeterDeleted,
      getParishName,
      getStatusLabel,
      getStatusClass,
      getVariationClass
    }
  }
}
</script>

<style scoped>
.map-page {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
}

.header-content p {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filters-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.filter-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s;
}

.filter-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.custom-dates {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
}

.date-group {
  flex: 1;
}

.date-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.date-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.map-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.map-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.map-header h3 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.map-content {
  padding: 40px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state {
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.map-placeholder {
  text-align: center;
  color: #9ca3af;
}

.map-placeholder i {
  font-size: 4rem;
  margin-bottom: 16px;
  display: block;
}

.map-placeholder h4 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #374151;
}

.map-placeholder p {
  margin: 0 0 24px 0;
  font-size: 1rem;
}

.map-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.charts-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.summary-card,
.zone-details-card,
.meters-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.summary-card h3,
.zone-details-card h3,
.meters-card h3 {
  margin: 0;
  padding: 20px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.summary-stats {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.variation-positive {
  color: #059669;
}

.variation-negative {
  color: #dc2626;
}

.zone-info {
  padding: 20px;
}

.zone-info h4 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.zone-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.zone-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.stat-label {
  font-weight: 500;
  color: #374151;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.zone-parishes,
.zone-meters {
  margin-bottom: 20px;
}

.zone-parishes h5,
.zone-meters h5 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #374151;
}

.parish-list,
.meter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parish-item,
.meter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.parish-name,
.meter-serial {
  font-weight: 500;
  color: #374151;
}

.parish-type,
.meter-status {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: #e5e7eb;
  color: #374151;
}

.parish-consumption {
  font-weight: 600;
  color: #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.meters-list {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.meter-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.meter-item:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.meter-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meter-serial {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.meter-location {
  font-size: 0.75rem;
  color: #6b7280;
}

.meter-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meter-status {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f3f4f6;
  color: #374151;
}

.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-fault {
  background: #fee2e2;
  color: #991b1b;
}

.status-disconnected {
  background: #fed7aa;
  color: #c2410c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e5e7eb;
  color: #374151;
}

.btn-icon.btn-danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 40px 20px;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

/* Estilos para gráficos temporales y de distribución */
.temporal-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 20px;
}

.chart-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.point-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.point-value {
  font-size: 0.75rem;
  color: #374151;
  font-weight: 600;
}

.distribution-chart {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-bar {
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.5s ease;
}

.distribution-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distribution-type {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.distribution-value {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .map-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: stretch;
  }
  
  .btn {
    flex: 1;
    justify-content: center;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .custom-dates {
    flex-direction: column;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .zone-stats {
    grid-template-columns: 1fr;
  }
  
  .map-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>

