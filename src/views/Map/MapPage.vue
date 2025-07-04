<template>
  <div class="map-page">
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
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script>
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
}

.summary-item {
  display: flex;
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
}
</style>

