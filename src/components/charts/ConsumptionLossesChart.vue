<template>
  <div class="consumption-losses-chart">
    <div class="chart-header">
      <h3 class="chart-title">
        <span class="icon">📊</span>
        Consumo y Pérdidas
      </h3>
      <div class="chart-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['chart-tab', { active: selectedTab === tab.key }]"
          @click="changePeriod(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <div class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color consumption"></div>
        <span>Consumo (m³)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color losses"></div>
        <span>Pérdidas (m³)</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend)

export default {
  name: 'ConsumptionLossesChart',
  components: { Line },
  props: {
    consumptionData: {
      type: Object,
      required: true,
      default: () => ({
        daily: [],
        weekly: [],
        monthly: [],
        yearly: []
      })
    }
  },
  setup(props) {
    const tabs = [
      { key: 'daily', label: 'Día' },
      { key: 'weekly', label: 'Semana' },
      { key: 'monthly', label: 'Mes' },
      { key: 'yearly', label: 'Año' }
    ]
    
    const selectedTab = ref('daily')

    const chartData = computed(() => {
      const data = props.consumptionData[selectedTab.value] || []
      
      if (data.length === 0) {
        return {
          labels: [],
          datasets: []
        }
      }

      const labels = data.map(item => {
        if (selectedTab.value === 'daily') return item.time
        if (selectedTab.value === 'weekly') return item.day
        if (selectedTab.value === 'monthly') return item.date
        if (selectedTab.value === 'yearly') return item.month
        return ''
      })

      const consumptionValues = data.map(item => item.consumption)
      const lossesValues = data.map(item => item.losses)

      return {
        labels,
        datasets: [
          {
            label: 'Consumo (m³)',
            data: consumptionValues,
            borderColor: '#288aef',
            backgroundColor: 'rgba(40, 138, 239, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#288aef',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2
          },
          {
            label: 'Pérdidas (m³)',
            data: lossesValues,
            borderColor: '#e64759',
            backgroundColor: 'rgba(230, 71, 89, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#e64759',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2
          }
        ]
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString('es-EC')} m³`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#e5e7eb',
            drawBorder: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12
            },
            callback: function(value) {
              return value.toLocaleString('es-EC')
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }

    const changePeriod = (period) => {
      selectedTab.value = period
    }

    return {
      tabs,
      selectedTab,
      chartData,
      chartOptions,
      changePeriod
    }
  }
}
</script>

<style scoped>
.consumption-losses-chart {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-title {
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

.chart-tabs {
  display: flex;
  gap: 0.5rem;
}

.chart-tab {
  background: none;
  border: none;
  color: #7a8ca3;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chart-tab.active, .chart-tab:hover {
  background: #eaf6ff;
  color: #288aef;
}

.chart-container {
  height: 300px;
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.consumption {
  background: #288aef;
}

.legend-color.losses {
  background: #e64759;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-tabs {
    width: 100%;
    justify-content: space-between;
  }
  
  .chart-tab {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .chart-legend {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}
</style> 