<template>
  <div class="dashboard-overview">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">
          <span class="icon">📊</span>
          Dashboard IoT Water
        </h1>
        <p class="dashboard-subtitle">
          Panel de control y monitoreo del sistema de gestión hídrica
        </p>
      </div>
      <div class="header-actions">
        <button 
          class="refresh-btn"
          @click="refreshData"
          :disabled="loading"
        >
          <span class="icon" :class="{ 'spinning': loading }">🔄</span>
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>
    </div>

    <!-- Indicador de carga y error -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <span class="icon spinning">⏳</span>
        <p>Cargando datos del dashboard...</p>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <span class="icon">⚠️</span>
      {{ error }}
      <button @click="refreshData" class="retry-btn">Reintentar</button>
    </div>

    <!-- Contenido principal del dashboard -->
    <div v-if="!loading && !error" class="dashboard-content">
      <!-- RF14.1: Cards de Resumen -->
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">📈</span>
          Resumen del Sistema
        </h2>
        <SummaryCardsGrid 
          :summary-cards="summaryCards"
        />
      </section>

      <!-- RF13.1: Resumen de Eficiencia -->
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">⚡</span>
          Métricas de Eficiencia
        </h2>
        <EfficiencyMetricsCard :efficiency-metrics="efficiencyMetrics" />
      </section>

      <!-- RF13.2: Estadísticas de Componentes -->
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">🔧</span>
          Estado de Componentes
        </h2>
        <ComponentStatsCard 
          :component-stats="componentStats"
          :valve-health-rate="valveHealthRate"
          :device-health-rate="deviceHealthRate"
        />
      </section>

      <!-- RF13.3 y RF14.2: Gráficos de Consumo y Pérdidas -->
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">📊</span>
          Análisis de Consumo y Pérdidas
        </h2>
        <div class="charts-grid">
          <div class="chart-container">
            <ConsumptionLossesChart :consumption-data="consumptionData" />
          </div>
          <div class="chart-container">
            <WaterEfficiencyDoughnut />
          </div>
        </div>
      </section>

      <!-- RF14.3: Sectores de Alto Consumo -->
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">📊</span>
          Sectores de Alto Consumo
        </h2>
        <div class="sectors-container">
          <HighConsumptionBarChart />
          <div class="sectors-list">
            <h4 class="sectors-title">Top 5 Sectores</h4>
            <div class="sector-item" v-for="(sector, index) in highConsumptionSectors" :key="index">
              <div class="sector-rank">{{ index + 1 }}</div>
              <div class="sector-info">
                <div class="sector-name">{{ sector.sector }}</div>
                <div class="sector-stats">
                  <span class="sector-consumption">{{ formatNumber(sector.consumption) }} m³</span>
                  <span class="sector-percentage">{{ sector.percentage }}%</span>
                </div>
              </div>
              <div class="sector-bar">
                <div 
                  class="sector-fill" 
                  :style="{ width: sector.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Centro de Atajos - Enlaces a secciones principales -->
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">⚡</span>
          Acceso Rápido
        </h2>
        <div class="shortcuts-description">
          <p class="description-text">
            Acceso directo a las secciones más importantes del sistema de gestión hídrica.
          </p>
        </div>
        <div class="shortcuts-grid">
          <router-link to="/devices" class="shortcut-card">
            <div class="shortcut-icon devices">
              <span class="icon">💻</span>
            </div>
            <div class="shortcut-content">
              <h3 class="shortcut-title">Dispositivos</h3>
              <p class="shortcut-description">Gestión y monitoreo de válvulas, sensores y equipos</p>
              <div class="shortcut-stats">
                <span class="stat-item">
                  <span class="stat-number">{{ componentStats.totalDevices }}</span>
                  <span class="stat-label">Total</span>
                </span>
                <span class="stat-item">
                  <span class="stat-number">{{ componentStats.failedValves }}</span>
                  <span class="stat-label">Con Fallas</span>
                </span>
              </div>
            </div>
            <div class="shortcut-arrow">
              <span class="icon">➡️</span>
            </div>
          </router-link>

          <router-link to="/map" class="shortcut-card">
            <div class="shortcut-icon map">
              <span class="icon">🗺️</span>
            </div>
            <div class="shortcut-content">
              <h3 class="shortcut-title">Mapa</h3>
              <p class="shortcut-description">Visualización geográfica y análisis territorial</p>
              <div class="shortcut-stats">
                <span class="stat-item">
                  <span class="stat-number">{{ summaryCards.meters.total }}</span>
                  <span class="stat-label">Medidores</span>
                </span>
                <span class="stat-item">
                  <span class="stat-number">{{ summaryCards.gateways.active }}</span>
                  <span class="stat-label">Gateways</span>
                </span>
              </div>
            </div>
            <div class="shortcut-arrow">
              <span class="icon">➡️</span>
            </div>
          </router-link>

          <router-link to="/incidents" class="shortcut-card">
            <div class="shortcut-icon incidents">
              <span class="icon">🚨</span>
            </div>
            <div class="shortcut-content">
              <h3 class="shortcut-title">Incidentes</h3>
              <p class="shortcut-description">Gestión y seguimiento de problemas y alertas</p>
              <div class="shortcut-stats">
                <span class="stat-item">
                  <span class="stat-number">{{ summaryCards.meters.failed }}</span>
                  <span class="stat-label">Activos</span>
                </span>
                <span class="stat-item">
                  <span class="stat-number">5</span>
                  <span class="stat-label">Críticos</span>
                </span>
              </div>
            </div>
            <div class="shortcut-arrow">
              <span class="icon">➡️</span>
            </div>
          </router-link>

          <router-link to="/personnel" class="shortcut-card">
            <div class="shortcut-icon personnel">
              <span class="icon">👥</span>
            </div>
            <div class="shortcut-content">
              <h3 class="shortcut-title">Personal</h3>
              <p class="shortcut-description">Administración de equipos y asignaciones</p>
              <div class="shortcut-stats">
                <span class="stat-item">
                  <span class="stat-number">{{ summaryCards.users.registered }}</span>
                  <span class="stat-label">Usuarios</span>
                </span>
                <span class="stat-item">
                  <span class="stat-number">12</span>
                  <span class="stat-label">Equipos</span>
                </span>
              </div>
            </div>
            <div class="shortcut-arrow">
              <span class="icon">➡️</span>
            </div>
          </router-link>

          <router-link to="/complaints" class="shortcut-card">
            <div class="shortcut-icon complaints">
              <span class="icon">📝</span>
            </div>
            <div class="shortcut-content">
              <h3 class="shortcut-title">Denuncias</h3>
              <p class="shortcut-description">Gestión de reportes y quejas de usuarios</p>
              <div class="shortcut-stats">
                <span class="stat-item">
                  <span class="stat-number">28</span>
                  <span class="stat-label">Pendientes</span>
                </span>
                <span class="stat-item">
                  <span class="stat-number">156</span>
                  <span class="stat-label">Resueltas</span>
                </span>
              </div>
            </div>
            <div class="shortcut-arrow">
              <span class="icon">➡️</span>
            </div>
          </router-link>

          <router-link to="/crm" class="shortcut-card">
            <div class="shortcut-icon crm">
              <span class="icon">💬</span>
            </div>
            <div class="shortcut-content">
              <h3 class="shortcut-title">CRM</h3>
              <p class="shortcut-description">Gestión de relaciones con clientes</p>
              <div class="shortcut-stats">
                <span class="stat-item">
                  <span class="stat-number">45</span>
                  <span class="stat-label">Chats</span>
                </span>
                <span class="stat-item">
                  <span class="stat-number">92%</span>
                  <span class="stat-label">Satisfacción</span>
                </span>
              </div>
            </div>
            <div class="shortcut-arrow">
              <span class="icon">➡️</span>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import SummaryCardsGrid from '@/components/charts/SummaryCardsGrid.vue'
import EfficiencyMetricsCard from '@/components/charts/EfficiencyMetricsCard.vue'
import ComponentStatsCard from '@/components/charts/ComponentStatsCard.vue'
import ConsumptionLossesChart from '@/components/charts/ConsumptionLossesChart.vue'
import WaterEfficiencyDoughnut from '@/components/charts/WaterEfficiencyDoughnut.vue'
import HighConsumptionBarChart from '@/components/charts/HighConsumptionBarChart.vue'

export default {
  name: 'DashboardOverview',
  components: {
    SummaryCardsGrid,
    EfficiencyMetricsCard,
    ComponentStatsCard,
    ConsumptionLossesChart,
    WaterEfficiencyDoughnut,
    HighConsumptionBarChart
  },
  setup() {
    const dashboardStore = useDashboardStore()

    // Computed properties para acceder a los datos del store
    const loading = computed(() => dashboardStore.loading)
    const error = computed(() => dashboardStore.error)
    const efficiencyMetrics = computed(() => dashboardStore.efficiencyMetrics)
    const componentStats = computed(() => dashboardStore.componentStats)
    const consumptionData = computed(() => dashboardStore.consumptionData)
    const summaryCards = computed(() => dashboardStore.summaryCards)
    const highConsumptionSectors = computed(() => dashboardStore.highConsumptionSectors)
    const valveHealthRate = computed(() => dashboardStore.valveHealthRate)
    const deviceHealthRate = computed(() => dashboardStore.deviceHealthRate)

    // Métodos
    const refreshData = () => {
      dashboardStore.fetchAllDashboardData()
    }

    const formatNumber = (value) => {
      return new Intl.NumberFormat('es-EC').format(value)
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      dashboardStore.fetchAllDashboardData()
    })

    return {
      loading,
      error,
      efficiencyMetrics,
      componentStats,
      consumptionData,
      summaryCards,
      highConsumptionSectors,
      valveHealthRate,
      deviceHealthRate,
      refreshData,
      formatNumber
    }
  }
}
</script>

<style scoped>
.dashboard-overview {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.dashboard-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn {
  background: #288aef;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
  color: #288aef;
}

.loading-spinner .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.75rem;
  font-size: 1.2em;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.sectors-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.sectors-list {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
}

.sectors-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.sector-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.sector-item:last-child {
  border-bottom: none;
}

.sector-rank {
  width: 24px;
  height: 24px;
  background: #288aef;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.sector-info {
  flex: 1;
  min-width: 0;
}

.sector-name {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.sector-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.sector-bar {
  width: 80px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}

.sector-fill {
  height: 100%;
  background: linear-gradient(90deg, #288aef, #1d4ed8);
  border-radius: 3px;
  transition: width 0.3s ease;
}



@media (max-width: 1024px) {
  .charts-grid,
  .sectors-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-overview {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .analysis-links {
    grid-template-columns: 1fr;
  }
  
  .sector-stats {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.shortcuts-description {
  margin-bottom: 1.5rem;
}

.description-text {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.shortcut-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: #374151;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.shortcut-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(40, 138, 239, 0.05) 0%, rgba(40, 138, 239, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.shortcut-card:hover {
  border-color: #288aef;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(40, 138, 239, 0.15);
}

.shortcut-card:hover::before {
  opacity: 1;
}

.shortcut-card:hover .shortcut-arrow {
  transform: translateX(4px);
  opacity: 1;
}

.shortcut-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.shortcut-icon.devices {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.shortcut-icon.map {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.shortcut-icon.incidents {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
}

.shortcut-icon.personnel {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.shortcut-icon.complaints {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #374151;
}

.shortcut-icon.crm {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.shortcut-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.shortcut-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.shortcut-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.shortcut-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.25rem;
}

.shortcut-arrow {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
  opacity: 0.7;
  position: relative;
  z-index: 1;
}

.shortcut-card:hover .shortcut-arrow {
  background: #288aef;
  color: white;
}

@media (max-width: 1024px) {
  .shortcuts-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .shortcuts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .shortcut-card {
    padding: 1.25rem;
  }
  
  .shortcut-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .shortcut-stats {
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.1rem;
  }
}
</style>
