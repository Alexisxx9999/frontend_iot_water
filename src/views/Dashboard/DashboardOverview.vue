<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">Dashboard de Monitoreo Hídrico</h1>
    <p class="dashboard-subtitle">Métricas en tiempo real del sistema</p>

    <!-- Tarjetas de resumen -->
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-label">Gateways Activos</div>
        <div class="card-value">12 <span class="card-total">/15</span></div>
        <div class="card-status card-status-green">+3 nuevas</div>
      </div>
      <div class="dashboard-card">
        <div class="card-label">Nodos (Medidores)</div>
        <div class="card-value">1,248</div>
        <div class="card-status card-status-yellow">+12 nuevos hoy</div>
      </div>
      <div class="dashboard-card">
        <div class="card-label">Medidores con Fallas</div>
        <div class="card-value">28</div>
        <div class="card-status card-status-red">-5 desde ayer</div>
      </div>
      <div class="dashboard-card">
        <div class="card-label">Usuarios Registrados</div>
        <div class="card-value">4,372</div>
        <div class="card-status card-status-green">+24 este mes</div>
      </div>
    </div>

    <!-- Gráficas principales -->
    <div class="dashboard-main-graphs">
      <div class="dashboard-graph dashboard-graph-lg">
        <div class="graph-header">
          <span>Consumo de Agua (m³)</span>
          
        </div>
        <WaterConsumptionLineChart />
      </div>
      <div class="dashboard-graph dashboard-graph-sm">
        <div class="graph-header">
          <span>Sectores de Alto Consumo</span>
        </div>
        <HighConsumptionBarChart />
      </div>
    </div>

    <!-- Válvulas y Recaudación -->
    <div class="dashboard-row">
      <div class="dashboard-card dashboard-card-row">
        <div class="row-label">Válvulas</div>
        <div class="row-values">
          <span class="row-active">156 Activas</span>
          <span class="row-fail">9 Con Fallas</span>
        </div>
        <div class="row-bar">
          <div class="bar-green" :style="{ width: '94%' }"></div>
          <div class="bar-red" :style="{ width: '6%' }"></div>
        </div>
      </div>
      <div class="dashboard-card dashboard-card-row">
        <div class="row-label">Recaudación</div>
        <div class="row-values">
          <span class="row-collected">$128,450 Recaudado</span>
          <span class="row-pending">$42,780 Pendiente</span>
        </div>
        <div class="row-bar">
          <div class="bar-green" :style="{ width: '75%' }"></div>
          <div class="bar-yellow" :style="{ width: '25%' }"></div>
        </div>
      </div>
    </div>

    <!-- Eficiencia Hídrica -->
    <div class="dashboard-card dashboard-card-full">
      <div class="efficiency-title">Eficiencia Hídrica</div>
      <div class="efficiency-value">87%</div>
      <div class="efficiency-desc">Porcentaje de pérdidas por fugas: 13%</div>
      <div class="efficiency-graph">
        <WaterEfficiencyDoughnut />
      </div>
      <div class="efficiency-legend">
        <span class="legend-green">Eficiente</span>
        <span class="legend-red">Pérdidas</span>
      </div>
    </div>
  </div>
</template>

<script>
import WaterConsumptionLineChart from '@/components/charts/WaterConsumptionLineChart.vue'
import HighConsumptionBarChart from '@/components/charts/HighConsumptionBarChart.vue'
import WaterEfficiencyDoughnut from '@/components/charts/WaterEfficiencyDoughnut.vue'

export default {
  name: 'DashboardOverview',
  components: {
    WaterConsumptionLineChart,
    HighConsumptionBarChart,
    WaterEfficiencyDoughnut
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  background: #f7fafd;
  min-height: 100vh;
}
.dashboard-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #288aef;
  margin-bottom: 0.2rem;
}
.dashboard-subtitle {
  color: #7a8ca3;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.dashboard-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(40, 138, 239, 0.06);
  padding: 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}
.card-label {
  color: #7a8ca3;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
}
.card-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: #288aef;
}
.card-total {
  font-size: 1.1rem;
  color: #b0b8c1;
  font-weight: 400;
}
.card-status {
  font-size: 0.95rem;
  margin-top: 0.5rem;
  font-weight: 500;
}
.card-status-green {
  color: #1bc98e;
}
.card-status-yellow {
  color: #f6c343;
}
.card-status-red {
  color: #e64759;
}
.dashboard-main-graphs {
  display: grid;
  grid-template-columns: 2.5fr 1.2fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.dashboard-graph {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(40, 138, 239, 0.06);
  padding: 1.5rem 1.2rem;
  min-width: 0;
}
.dashboard-graph-lg {
  min-height: 320px;
}
.dashboard-graph-sm {
  min-height: 320px;
}
.graph-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.08rem;
  font-weight: 600;
  color: #288aef;
  margin-bottom: 1.2rem;
}
.graph-tabs {
  display: flex;
  gap: 0.5rem;
}
.graph-tabs button {
  background: none;
  border: none;
  color: #7a8ca3;
  font-weight: 500;
  font-size: 0.98rem;
  padding: 0.2rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.graph-tabs button.active, .graph-tabs button:hover {
  background: #eaf6ff;
  color: #288aef;
}
.graph-placeholder {
  background: #f4f8fb;
  border-radius: 12px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b8c1;
  font-size: 1.1rem;
  font-weight: 500;
}
.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.dashboard-card-row {
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
}
.row-label {
  color: #7a8ca3;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.row-values {
  display: flex;
  gap: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
}
.row-active {
  color: #1bc98e;
}
.row-fail {
  color: #e64759;
}
.row-collected {
  color: #1bc98e;
}
.row-pending {
  color: #f6c343;
}
.row-bar {
  display: flex;
  height: 8px;
  border-radius: 6px;
  overflow: hidden;
  background: #eaf6ff;
}
.bar-green {
  background: #1bc98e;
  height: 100%;
}
.bar-red {
  background: #e64759;
  height: 100%;
}
.bar-yellow {
  background: #f6c343;
  height: 100%;
}
.dashboard-card-full {
  margin-bottom: 2rem;
  padding: 2rem 1.2rem 2.5rem 1.2rem;
  text-align: center;
}
.efficiency-title {
  color: #7a8ca3;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.efficiency-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #288aef;
  margin-bottom: 0.2rem;
}
.efficiency-desc {
  color: #7a8ca3;
  font-size: 1.05rem;
  margin-bottom: 1.2rem;
}
.efficiency-graph {
  background: #f4f8fb;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b8c1;
  font-size: 1.1rem;
  font-weight: 500;
}
.efficiency-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}
.legend-green {
  color: #1bc98e;
  font-weight: 600;
}
.legend-red {
  color: #e64759;
  font-weight: 600;
}
@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
  .dashboard-main-graphs {
    grid-template-columns: 1fr;
  }
  .dashboard-row {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-card {
    padding: 1.1rem 0.7rem;
  }
  .dashboard-main-graphs {
    grid-template-columns: 1fr;
  }
  .dashboard-row {
    grid-template-columns: 1fr;
  }
  .dashboard-card-row {
    padding: 1.1rem 0.7rem 1.2rem 0.7rem;
  }
  .dashboard-card-full {
    padding: 1.2rem 0.7rem 1.5rem 0.7rem;
  }
}
</style>
