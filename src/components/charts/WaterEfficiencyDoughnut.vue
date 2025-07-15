<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend)

export default {
  name: 'WaterEfficiencyDoughnut',
  components: { Doughnut },
  data() {
    return {
      chartData: {
        labels: ['Eficiente', 'Pérdidas'],
        datasets: [
          {
            data: [87, 13],
            backgroundColor: [
              '#1bc98e',
              '#e64759'
            ],
            borderWidth: 0,
            hoverOffset: 8
          }
        ]
      },
      chartOptions: {
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      }
    }
  }
}
</script> 