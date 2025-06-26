<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

export default {
  name: 'HighConsumptionBarChart',
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: ['Doméstico', 'Comercial', 'Industrial', 'Público', 'Agrícola'],
        datasets: [
          {
            label: 'Consumo (m³)',
            data: [420, 320, 510, 280, 390],
            backgroundColor: [
              '#288aef',
              '#a78bfa',
              '#1bc98e',
              '#f6c343',
              '#e64759'
            ],
            borderRadius: 8,
            barPercentage: 0.6
          }
        ]
      },
      chartOptions: {
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
    }
  }
}
</script> 