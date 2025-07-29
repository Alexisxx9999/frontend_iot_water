<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1>Panel de Control</h1>
      <p class="dashboard-desc">Resumen general del sistema IoT Water</p>
    </div>
    <SummaryCardsGrid />
    <div class="dashboard-charts">
      <div class="chart-main">
        <WaterConsumptionLineChart />
      </div>
      <div class="chart-side">
        <WaterEfficiencyDoughnut />
        <EfficiencyMetricsCard />
      </div>
    </div>
    <div class="dashboard-bottom">
      <HighConsumptionBarChart />
      <ConsumptionLossesChart />
    </div>
  </div>
</template>

<script setup>
import SummaryCardsGrid from '@/components/charts/SummaryCardsGrid.vue'
import WaterConsumptionLineChart from '@/components/charts/WaterConsumptionLineChart.vue'
import WaterEfficiencyDoughnut from '@/components/charts/WaterEfficiencyDoughnut.vue'
import EfficiencyMetricsCard from '@/components/charts/EfficiencyMetricsCard.vue'
import HighConsumptionBarChart from '@/components/charts/HighConsumptionBarChart.vue'
import ConsumptionLossesChart from '@/components/charts/ConsumptionLossesChart.vue'
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  background: #f4f8fb;
  min-height: 100vh;
}
.dashboard-header {
  margin-bottom: 2.2rem;
  text-align: left;
}
.dashboard-header h1 {
  font-size: 2.3rem;
  font-weight: 800;
  color: #225b8c;
  margin-bottom: 0.3rem;
}
.dashboard-desc {
  color: #3b4a5a;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.dashboard-charts {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.chart-main {
  flex: 2 1 500px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #225b8c11;
  padding: 2rem 1.5rem;
  min-width: 350px;
}
.chart-side {
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.chart-side > * {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #225b8c11;
  padding: 1.2rem 1rem;
}
.dashboard-bottom {
  display: flex;
  gap: 2.5rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}
.dashboard-bottom > * {
  flex: 1 1 400px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #225b8c11;
  padding: 1.5rem 1.2rem;
  min-width: 320px;
}
@media (max-width: 1100px) {
  .dashboard-charts, .dashboard-bottom {
    flex-direction: column;
    gap: 1.2rem;
  }
  .chart-main, .chart-side, .dashboard-bottom > * {
    min-width: unset;
  }
}
</style> 