<template>
  <div class="efficiency-metrics-card">
    <div class="card-header">
      <h3 class="card-title">
        <span class="icon">⚡</span>
        Resumen de Eficiencia
      </h3>
    </div>
    
    <div class="metrics-grid">
      <div class="metric-item">
        <div class="metric-value">{{ efficiencyMetrics.lossPercentage }}%</div>
        <div class="metric-label">Pérdidas por Fugas</div>
        <div class="metric-trend negative">
          <span class="icon">📈</span>
          <span>+2.1%</span>
        </div>
      </div>
      
      <div class="metric-item">
        <div class="metric-value">{{ formatNumber(efficiencyMetrics.totalConsumption) }}</div>
        <div class="metric-label">Consumo Total (m³)</div>
        <div class="metric-trend positive">
          <span class="icon">📉</span>
          <span>-1.5%</span>
        </div>
      </div>
      
      <div class="metric-item">
        <div class="metric-value">{{ formatNumber(efficiencyMetrics.totalLosses) }}</div>
        <div class="metric-label">Pérdidas Totales (m³)</div>
        <div class="metric-trend negative">
          <span class="icon">📈</span>
          <span>+3.2%</span>
        </div>
      </div>
      
      <div class="metric-item highlight">
        <div class="metric-value">{{ efficiencyMetrics.efficiencyRate }}%</div>
        <div class="metric-label">Tasa de Eficiencia</div>
        <div class="metric-trend positive">
          <span class="icon">📈</span>
          <span>+1.8%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EfficiencyMetricsCard',
  props: {
    efficiencyMetrics: {
      type: Object,
      required: true,
      default: () => ({
        lossPercentage: 0,
        totalConsumption: 0,
        totalLosses: 0,
        efficiencyRate: 0
      })
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('es-EC').format(value)
    }
  }
}
</script>

<style scoped>
.efficiency-metrics-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.5rem;
  font-size: 1.1em;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.metric-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-item.highlight {
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  border-color: #2196f3;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.metric-trend {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.metric-trend.positive {
  color: #059669;
}

.metric-trend.negative {
  color: #dc2626;
}

.metric-trend .icon {
  margin-right: 0;
  font-size: 0.8em;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .metric-value {
    font-size: 1.5rem;
  }
}
</style> 