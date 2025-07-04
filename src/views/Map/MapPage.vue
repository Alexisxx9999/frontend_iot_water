<template>
  <div class="map-page">
<<<<<<< HEAD
    <!-- Indicador de carga -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando datos del mapa...</p>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">
        <i class="fas fa-redo"></i>
        Reintentar
      </button>
    </div>

    <!-- Header con resumen general -->
    <div class="map-header-container">
      <div class="map-header-premium">
        <div class="map-header-premium-inner">
          <div class="header-premium-left">
            <h1 class="header-premium-title">Visualización Territorial</h1>
            <p class="header-premium-subtitle">Monitoreo de consumo hídrico por zonas administrativas</p>
          </div>
          <div class="header-premium-metrics">
            <div class="metric-premium metric-blue animate-fade-up metric-delay-1">
              <div class="metric-premium-icon">💧</div>
              <div class="metric-premium-number">
                {{ mapStore.totalZones > 0 ? mapStore.totalConsumption : '-' }}
              </div>
              <div class="metric-premium-label">Consumo Total</div>
              <div class="metric-premium-m3">m³</div>
            </div>
            <div class="metric-premium metric-yellow animate-fade-up metric-delay-2">
              <div class="metric-premium-icon">📈</div>
              <div class="metric-premium-number">
                {{ mapStore.totalZones > 0 ? (mapStore.monthlyVariation + '%') : '-' }}
              </div>
              <div class="metric-premium-label">Variación Mensual</div>
            </div>
            <div class="metric-premium metric-cyan animate-fade-up metric-delay-3">
              <div class="metric-premium-icon">🏘️</div>
              <div class="metric-premium-number">
                {{ mapStore.totalZones > 0 ? mapStore.totalZones : '-' }}
              </div>
              <div class="metric-premium-label">Zonas Activas</div>
            </div>
            <div class="metric-premium metric-purple animate-fade-up metric-delay-4">
              <div class="metric-premium-icon">📊</div>
              <div class="metric-premium-number">
                {{ mapStore.totalZones > 0 ? mapStore.totalParishes : '-' }}
              </div>
              <div class="metric-premium-label">Parroquias</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout principal del dashboard -->
    <div class="map-dashboard-layout">
      <!-- Sidebar con filtros -->
      <div class="map-sidebar">
        <div class="sidebar-section">
          <h3>Filtros de Ubicación</h3>
          <div class="filter-group">
            <label class="filter-label">Administración Zonal</label>
            <select v-model="mapStore.selectedZone" class="filter-select" :disabled="mapStore.zones.length === 0">
              <option value="">Todas las zonas</option>
              <option v-for="zone in mapStore.zones" :key="zone.id" :value="zone.id">
                {{ zone.name }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Tipo de Parroquia</label>
            <select v-model="mapStore.selectedParishType" class="filter-select">
              <option value="">Todos los tipos</option>
              <option value="urbana">Urbana</option>
              <option value="rural">Rural</option>
              <option value="mixta">Mixta</option>
            </select>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Filtros de Tiempo y Consumo</h3>
          <div class="filter-group">
            <label class="filter-label">Período de Tiempo</label>
            <select v-model="mapStore.selectedPeriod" class="filter-select">
              <option value="1">Último mes</option>
              <option value="3">Últimos 3 meses</option>
              <option value="6">Últimos 6 meses</option>
              <option value="12">Último año</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Rango de Consumo</label>
            <select v-model="mapStore.selectedConsumptionRange" class="filter-select">
              <option value="">Todos los rangos</option>
              <option value="bajo">Bajo (0-100 m³)</option>
              <option value="medio">Medio (100-500 m³)</option>
              <option value="alto">Alto (500-1000 m³)</option>
              <option value="muyalto">Muy Alto (&gt;1000 m³)</option>
            </select>
          </div>
        </div>

        <!-- Leyenda de consumo -->
        <div class="legend-card-glass">
          <h4 class="legend-title">
            <i class="fas fa-palette"></i>
            Leyenda de Consumo
          </h4>
          <ul class="legend-list-modern">
            <li>
              <span class="legend-dot legend-dot-bajo"></span>
              <span class="legend-label">Bajo</span>
              <span class="legend-range">(0-100 m³)</span>
            </li>
            <li>
              <span class="legend-dot legend-dot-medio"></span>
              <span class="legend-label">Medio</span>
              <span class="legend-range">(100-500 m³)</span>
            </li>
            <li>
              <span class="legend-dot legend-dot-alto"></span>
              <span class="legend-label">Alto</span>
              <span class="legend-range">(500-1000 m³)</span>
            </li>
            <li>
              <span class="legend-dot legend-dot-muyalto"></span>
              <span class="legend-label">Muy Alto</span>
              <span class="legend-range">(>1000 m³)</span>
            </li>
          </ul>
        </div>

        <!-- Botón de exportar -->
        <button class="map-refresh-btn" @click="exportData">
          <i class="fas fa-download btn-icon"></i>
          Exportar Datos
        </button>
        <button class="map-refresh-btn" style="margin-top: 0.5rem; background: #22c55e;" @click="exportToExcel">
          <i class="fas fa-file-excel btn-icon"></i>
          Exportar a Excel
        </button>
      </div>

      <!-- Contenido principal -->
      <div class="map-dashboard-main">
        <!-- Mapa interactivo real -->
        <div id="map" class="map-leaflet"></div>

        <!-- Paneles de gráficos -->
        <div class="map-panels-row">
          <div class="glass-card panel-graph">
            <h4>Consumo por Administración Zonal</h4>
            <template v-if="mapStore.filteredZones.length > 0">
              <canvas ref="zoneChart" width="400" height="200"></canvas>
            </template>
            <template v-else>
              <div class="no-zones-message">No hay datos para mostrar en el gráfico.</div>
            </template>
          </div>
          <div class="glass-card panel-graph">
            <h4>Variación Temporal Mensual</h4>
            <template v-if="mapStore.filteredZones.length > 0">
              <canvas ref="temporalChart" width="400" height="200"></canvas>
            </template>
            <template v-else>
              <div class="no-zones-message">No hay datos para mostrar en el gráfico.</div>
            </template>
          </div>
        </div>

        <div class="map-panels-row">
          <div class="glass-card panel-graph">
            <h4>Distribución por Parroquia</h4>
            <template v-if="mapStore.filteredZones.length > 0">
              <canvas ref="parishChart" width="400" height="200"></canvas>
            </template>
            <template v-else>
              <div class="no-zones-message">No hay datos para mostrar en el gráfico.</div>
            </template>
          </div>
          <div class="glass-card panel-graph">
            <h4>Resumen de Zonas</h4>
            <div class="zone-summary">
              <template v-if="mapStore.filteredZones.length > 0">
                <div class="summary-item" v-for="zone in mapStore.filteredZones" :key="zone.id">
                  <div class="zone-name">{{ zone.name }}</div>
                  <div class="zone-consumption">{{ zone.consumption }} m³</div>
                  <div class="zone-variation" :class="zone.variation >= 0 ? 'positive' : 'negative'">
                    {{ zone.variation >= 0 ? '+' : '' }}{{ zone.variation }}%
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="no-zones-message">
                  No hay zonas para mostrar con el filtro seleccionado.
                </div>
              </template>
=======
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
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
            </div>
          </div>
        </div>
      </div>
    </div>

<<<<<<< HEAD
    <!-- Popup de información de zona -->
    <div v-if="selectedZoneInfo" class="device-popup" :style="popupStyle">
      <div class="popup-header">
        <div class="device-icon" :class="selectedZoneInfo.type">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="device-info">
          <div class="device-name">{{ selectedZoneInfo.name }}</div>
          <div class="device-id">Zona ID: {{ selectedZoneInfo.id }}</div>
        </div>
        <div class="device-status" :class="selectedZoneInfo.status">
          {{ selectedZoneInfo.status }}
        </div>
      </div>
      <div class="popup-content">
        <div class="metric-item">
          <span class="metric-label">Consumo Actual:</span>
          <span class="metric-value">{{ selectedZoneInfo.consumption }} m³</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Variación Mensual:</span>
          <span class="metric-value" :class="selectedZoneInfo.variation >= 0 ? 'positive' : 'negative'">
            {{ selectedZoneInfo.variation >= 0 ? '+' : '' }}{{ selectedZoneInfo.variation }}%
          </span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Parroquias:</span>
          <span class="metric-value">{{ selectedZoneInfo.parishes.length }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Tipo:</span>
          <span class="metric-value">{{ selectedZoneInfo.type }}</span>
        </div>
      </div>
      <div class="popup-actions">
        <button class="popup-btn primary" @click="viewZoneDetails">
          <i class="fas fa-info-circle"></i>
          Ver Detalles
        </button>
        <button class="popup-btn" @click="closePopup">
          <i class="fas fa-times"></i>
          Cerrar
        </button>
      </div>
    </div>
=======
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
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
  </div>
</template>

<script>
<<<<<<< HEAD
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useMapStore } from '@/stores/map'
import Chart from 'chart.js/auto'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as XLSX from 'xlsx'

export default {
  name: 'MapPage',
  setup() {
    const mapStore = useMapStore()
    const zoneChart = ref(null)
    const temporalChart = ref(null)
    const parishChart = ref(null)
    const popupStyle = ref({})
    let leafletMap = null
    let leafletMarkers = []

    // Métodos
    const filterByZone = () => { mapStore.setSelectedZone(mapStore.selectedZone); updateCharts() }
    const filterByParishType = () => { mapStore.setSelectedParishType(mapStore.selectedParishType); updateCharts() }
    const filterByPeriod = () => { mapStore.setSelectedPeriod(mapStore.selectedPeriod); updateCharts() }
    const filterByConsumption = () => { mapStore.setSelectedConsumptionRange(mapStore.selectedConsumptionRange); updateCharts() }
    const showZoneInfo = (zone, event) => { mapStore.setSelectedZoneInfo(zone) }
    const closePopup = () => { mapStore.setSelectedZoneInfo(null) }
    const viewZoneDetails = () => { console.log('Ver detalles de zona:', mapStore.selectedZoneInfo) }
    const exportData = () => { mapStore.exportMapData() }
    const retryLoad = async () => { await mapStore.fetchZones(); await mapStore.fetchTemporalVariation(); await mapStore.fetchParishDistribution(); await mapStore.fetchSystemSummary(); }
    const exportToExcel = () => {
      // Preparar los datos filtrados
      const period = mapStore.selectedPeriod || '3'
      const range = mapStore.selectedConsumptionRange || 'todos'
      const data = mapStore.filteredZones.map((zone, idx) => {
        let historial = ''
        if (zone.monthlyHistories && zone.monthlyHistories[period]) {
          if (range === 'todos') {
            // Concatenar todos los rangos
            historial = Object.entries(zone.monthlyHistories[period])
              .map(([r, arr]) => `${r}: [${arr.join(', ')}]`).join(' | ')
          } else {
            historial = (zone.monthlyHistories[period][range] || []).join(', ')
          }
        }
        return {
          'Zona': zone.name,
          'Tipo': zone.type,
          'Consumo (m³)': zone.consumption,
          'Variación (%)': zone.variation,
          'Estado': zone.status,
          'Parroquias': zone.parishes.join(', '),
          'Coordenadas': zone.coordinates ? zone.coordinates.join(', ') : '',
          'Historial Mensual': historial
        }
      })
      // Crear la hoja y el libro
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Zonas')
      // Exportar
      XLSX.writeFile(workbook, `zonas_mapa_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    // Inicialización de gráficos
    let zoneChartInstance = null, temporalChartInstance = null, parishChartInstance = null
    const initCharts = () => {
      nextTick(() => {
        // Gráfico de consumo por zona
        const zoneCtx = zoneChart.value.getContext('2d')
        zoneChartInstance = new Chart(zoneCtx, {
          type: 'bar',
          data: {
            labels: mapStore.filteredZones.map(zone => zone.name),
            datasets: [{
              label: 'Consumo (m³)',
              data: mapStore.filteredZones.map(zone => zone.consumption),
              backgroundColor: [
                'rgba(14, 165, 233, 0.8)',
                'rgba(6, 182, 212, 0.8)',
                'rgba(8, 145, 178, 0.8)',
                'rgba(16, 185, 129, 0.8)'
              ],
              borderColor: [
                'rgba(14, 165, 233, 1)',
                'rgba(6, 182, 212, 1)',
                'rgba(8, 145, 178, 1)',
                'rgba(16, 185, 129, 1)'
              ],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: '#4f5d75'
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: '#4f5d75'
                }
              }
            }
          }
        })

        // Gráfico de variación temporal usando datos del store
        const temporalCtx = temporalChart.value.getContext('2d')
        let period = mapStore.selectedPeriod || '3'
        let monthsLabels = []
        let temporalChartValues = []
        const histories = mapStore.filteredMonthlyHistories
        if (period === '1') {
          // Mostrar el último mes y el anterior para dar contexto visual
          const labels = mapStore.temporalData.labels
          monthsLabels = [labels[4] || 'Mes anterior', labels[5] || 'Mes Actual']
          let sumPrev = 0
          let sumLast = 0
          histories.forEach(arr => {
            if (Array.isArray(arr)) {
              sumPrev += arr[0] !== undefined ? arr[0] : 0
              sumLast += arr[1] !== undefined ? arr[1] : 0
            } else if (typeof arr === 'object' && arr !== null) {
              Object.values(arr).forEach(val => {
                if (Array.isArray(val)) {
                  sumPrev += val[0] !== undefined ? val[0] : 0
                  sumLast += val[1] !== undefined ? val[1] : 0
                }
              })
            }
          })
          temporalChartValues = [sumPrev, sumLast]
        } else if (period === '3') {
          monthsLabels = mapStore.temporalData.labels.slice(3, 6)
          temporalChartValues = monthsLabels.map((_, i) => {
            let sum = 0
            histories.forEach(arr => {
              if (arr && arr[i] !== undefined && arr[i] !== null) {
                sum += arr[i]
              }
            })
            return sum
          })
        } else if (period === '6') {
          monthsLabels = mapStore.temporalData.labels
          temporalChartValues = monthsLabels.map((_, i) => {
            let sum = 0
            histories.forEach(arr => {
              if (arr && arr[i] !== undefined && arr[i] !== null) {
                sum += arr[i]
              }
            })
            return sum
          })
        } else if (period === '12') {
          monthsLabels = ['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', ...mapStore.temporalData.labels]
          temporalChartValues = monthsLabels.map((_, i) => {
            let sum = 0
            histories.forEach(arr => {
              if (arr && arr[i] !== undefined && arr[i] !== null) {
                sum += arr[i]
              }
            })
            return sum
          })
        }
        const hasData = temporalChartValues.some(v => v !== null && v !== undefined)
        if (hasData) {
          temporalChartInstance = new Chart(temporalCtx, {
            type: 'line',
            data: {
              labels: monthsLabels,
              datasets: [{
                label: 'Consumo Mensual (m³)',
                data: temporalChartValues.map(v => v === null ? 0 : v),
                borderColor: 'rgba(14, 165, 233, 1)',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#4f5d75'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#4f5d75'
                  }
                }
              }
            }
          })
        } else {
          temporalChartInstance = null
          temporalChart.value.parentNode.innerHTML = '<div class="no-zones-message">No hay datos para mostrar en el gráfico.</div>'
        }

        // Gráfico de distribución por parroquia usando datos del store
        const parishCtx = parishChart.value.getContext('2d')
        const parishChartLabels = mapStore.parishDistribution.labels || ['Urbana', 'Rural', 'Mixta']
        const parishChartData = mapStore.parishDistribution.data || [
          mapStore.filteredZones.filter(z => z.type === 'urbana').length,
          mapStore.filteredZones.filter(z => z.type === 'rural').length,
          mapStore.filteredZones.filter(z => z.type === 'mixta').length
        ]
        
        parishChartInstance = new Chart(parishCtx, {
          type: 'doughnut',
          data: {
            labels: parishChartLabels,
            datasets: [{
              data: parishChartData,
              backgroundColor: [
                'rgba(14, 165, 233, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)'
              ],
              borderColor: [
                'rgba(14, 165, 233, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)'
              ],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#4f5d75',
                  padding: 20
                }
              }
            }
          }
        })
      })
    }

    const updateCharts = () => {
      if (zoneChartInstance) {
        zoneChartInstance.destroy()
      }
      if (temporalChartInstance) {
        temporalChartInstance.destroy()
      }
      if (parishChartInstance) {
        parishChartInstance.destroy()
      }
      initCharts()
    }

    // Inicialización del mapa real con Leaflet
    const initMap = () => {
      nextTick(() => {
        if (!leafletMap) {
          leafletMap = L.map('map', {
            center: [-0.2299, -78.5249],
            zoom: 12,
            zoomControl: true,
            attributionControl: false
          })
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(leafletMap)
        }
        // Limpiar marcadores anteriores
        leafletMarkers.forEach(marker => marker.remove())
        leafletMarkers = []
        // Agregar marcadores de zonas filtradas
        mapStore.filteredZones.forEach(zone => {
          if (zone.coordinates && zone.coordinates.length === 2) {
            const marker = L.marker(zone.coordinates, {
              title: zone.name,
              icon: L.divIcon({
                className: 'custom-leaflet-marker',
                html: `<div style="background:${getZoneColor(zone.consumption)};color:white;font-weight:bold;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${zone.name.split(' ').map(w=>w[0]).join('')}</div>`
              })
            })
            // Tooltip personalizado
            const tooltipContent = `
              <div style='font-weight:bold;font-size:1.1em;'>${zone.name}</div>
              <div>Consumo: <b>${zone.consumption} m³</b></div>
              <div>Variación: <b>${zone.variation >= 0 ? '+' : ''}${zone.variation}%</b></div>
              <div>Tipo: <b>${zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}</b></div>
              <div>Parroquias: <b>${zone.parishes.length}</b></div>
            `
            marker.bindTooltip(tooltipContent, { direction: 'top', offset: [0, -24], className: 'leaflet-zone-tooltip', sticky: true })
            marker.addTo(leafletMap)
            marker.on('click', () => showZoneInfo(zone))
            leafletMarkers.push(marker)
          }
        })
        // Ajustar vista si hay zonas
        if (mapStore.filteredZones.length > 0) {
          const group = L.featureGroup(leafletMarkers)
          leafletMap.fitBounds(group.getBounds().pad(0.3))
        }
      })
    }

    const getZoneColor = (consumption) => {
      if (consumption <= 100) return '#10b981'
      if (consumption <= 500) return '#f59e0b'
      if (consumption <= 1000) return '#facc15'
      return '#ef4444'
    }

    // Watchers para actualizar mapa y gráficos
    watch(() => mapStore.filteredZones, (newVal) => {
      if (newVal && newVal.length > 0) {
        updateCharts()
        initMap()
      }
    }, { deep: true, immediate: true })
    watch(() => mapStore.temporalData, () => { updateCharts() }, { deep: true })
    watch(() => mapStore.parishDistribution, () => { updateCharts() }, { deep: true })

    const availableParishTypes = computed(() => {
      if (!mapStore.selectedZone) {
        return [
          { value: 'urbana', label: 'Urbana' },
          { value: 'rural', label: 'Rural' },
          { value: 'mixta', label: 'Mixta' }
        ]
      }
      const zone = mapStore.zones.find(z => z.id === parseInt(mapStore.selectedZone))
      if (!zone) return []
      return [
        { value: zone.type, label: zone.type.charAt(0).toUpperCase() + zone.type.slice(1) }
      ]
    })

    onMounted(async () => {
      await mapStore.fetchZones()
      await mapStore.fetchTemporalVariation()
      await mapStore.fetchParishDistribution()
      await mapStore.fetchSystemSummary()
    })

    return {
      zoneChart,
      temporalChart,
      parishChart,
      mapStore,
      popupStyle,
      filterByZone,
      filterByParishType,
      filterByPeriod,
      filterByConsumption,
      showZoneInfo,
      closePopup,
      viewZoneDetails,
      exportData,
      retryLoad,
      exportToExcel,
      availableParishTypes
    }
  }
}
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';
.custom-leaflet-marker {
  border: none;
  background: none;
}
/* Estilos adicionales específicos del componente */
.zone-summary {
  max-height: 300px;
  overflow-y: auto;
=======
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
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
}

.summary-item {
  display: flex;
<<<<<<< HEAD
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item:last-child {
  border-bottom: none;
}

.zone-name {
  font-weight: 600;
  color: #22223b;
  flex: 1;
}

.zone-consumption {
  font-weight: 700;
  color: #0ea5e9;
  margin: 0 10px;
}

.zone-variation {
  font-weight: 600;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 6px;
}

.zone-variation.positive {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.zone-variation.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.metric-value.positive {
  color: #10b981;
}

.metric-value.negative {
  color: #ef4444;
}

/* Indicador de carga */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  color: #0ea5e9;
}

.loading-spinner i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-spinner p {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

/* Mensaje de error */
.error-message {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 500px;
  text-align: center;
  border: 2px solid #fecaca;
}

.error-message i {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-message p {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .map-dashboard-layout {
    flex-direction: column;
  }
  
  .map-sidebar {
    width: 100%;
  }
  
  .map-panels-row {
    flex-direction: column;
  }
}

.map-panels-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  width: 100%;
}

.panel-graph {
  flex: 1 1 320px;
  min-width: 280px;
  max-width: 480px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.panel-graph canvas {
  width: 100% !important;
  max-width: 100% !important;
  height: 220px !important;
  max-height: 240px !important;
  display: block;
}

.no-zones-message {
  text-align: center;
  color: #64748b;
  font-size: 1.05rem;
  padding: 2.5rem 0;
=======
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
>>>>>>> e0ed96d6e2d6533b8bf87dff7b0dc398dc526e3d
}
</style>

