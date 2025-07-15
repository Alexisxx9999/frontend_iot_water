<template>
  <div>
    <div class="chart-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['chart-tab', { active: selectedTab === tab.key }]"
        @click="selectedTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
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

const chartDataSets = {
  day: {
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    data: [220, 180, 120, 90, 110, 160, 200, 140]
  },
  week: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    data: [1200, 980, 1100, 900, 1300, 1500, 1400]
  },
  month: {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    data: [4000, 4200, 3900, 4100, 4300, 4400, 4200]
  },
  year: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    data: [48000, 47000, 50000, 52000, 51000, 53000, 54000, 52000, 51000, 50000, 49000, 48000]
  }
}

export default {
  name: 'WaterConsumptionLineChart',
  components: { Line },
  setup() {
    const tabs = [
      { key: 'day', label: 'Día' },
      { key: 'week', label: 'Semana' },
      { key: 'month', label: 'Mes' },
      { key: 'year', label: 'Año' }
    ]
    const selectedTab = ref('day')

    const chartData = computed(() => {
      const { labels, data } = chartDataSets[selectedTab.value]
      return {
        labels,
        datasets: [
          {
            label: 'Consumo de Agua (m³)',
            data,
            borderColor: '#288aef',
            backgroundColor: 'rgba(40, 138, 239, 0.08)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#288aef',
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      }
    })

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#eaf6ff'
          }
        }
      }
    }

    return {
      tabs,
      selectedTab,
      chartData,
      chartOptions
    }
  }
}
</script>

<style scoped>
.chart-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}
.chart-tab {
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
.chart-tab.active, .chart-tab:hover {
  background: #eaf6ff;
  color: #288aef;
}
</style> 