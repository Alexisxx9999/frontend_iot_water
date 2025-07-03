<template>
  <div class="chart-container">
    <div class="chart-header">
      <h4>Consumo por Administración Zonal</h4>
      <div class="chart-legend">
        <div class="legend-item" v-for="(range, key) in consumptionRanges" :key="key">
          <div class="legend-color" :style="{ backgroundColor: range.color }"></div>
          <span class="legend-label">{{ range.label }}</span>
        </div>
      </div>
    </div>
    
    <div class="chart-content" ref="chartContainer">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
      
      <div v-else-if="!chartData.length" class="empty-state">
        <i class="fas fa-chart-bar"></i>
        <p>No hay datos disponibles</p>
      </div>
      
      <div v-else class="chart-bars">
        <div 
          v-for="(item, index) in chartData" 
          :key="index"
          class="chart-bar-item"
        >
          <div class="bar-label">{{ item.zonalAdmin }}</div>
          <div class="bar-container">
            <div 
              class="bar-fill"
              :style="{ 
                width: `${getBarWidth(item.consumption)}%`,
                backgroundColor: getConsumptionColor(item.consumption)
              }"
            ></div>
            <div class="bar-value">{{ item.consumption.toFixed(1) }} m³</div>
          </div>
          <div class="bar-info">
            <span class="parishes-count">{{ item.parishes }} parroquias</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-footer">
      <div class="total-consumption">
        <span class="total-label">Consumo Total:</span>
        <span class="total-value">{{ totalConsumption.toFixed(1) }} m³</span>
      </div>
      <div class="average-consumption">
        <span class="average-label">Promedio:</span>
        <span class="average-value">{{ averageConsumption.toFixed(1) }} m³</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { CONSUMPTION_RANGES } from '@/services/map.service'

export default {
  name: 'MapConsumptionChart',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const chartContainer = ref(null)
    const consumptionRanges = CONSUMPTION_RANGES

    // Computed properties
    const chartData = computed(() => {
      if (!props.data || !props.data.length) return []
      
      // Ordenar por consumo descendente
      return [...props.data].sort((a, b) => b.consumption - a.consumption)
    })

    const totalConsumption = computed(() => {
      return chartData.value.reduce((sum, item) => sum + item.consumption, 0)
    })

    const averageConsumption = computed(() => {
      if (!chartData.value.length) return 0
      return totalConsumption.value / chartData.value.length
    })

    const maxConsumption = computed(() => {
      if (!chartData.value.length) return 0
      return Math.max(...chartData.value.map(item => item.consumption))
    })

    // Métodos
    const getBarWidth = (consumption) => {
      if (maxConsumption.value === 0) return 0
      return (consumption / maxConsumption.value) * 100
    }

    const getConsumptionColor = (consumption) => {
      const percentage = (consumption / maxConsumption.value) * 100
      
      if (percentage <= 25) return consumptionRanges.BAJO.color
      if (percentage <= 50) return consumptionRanges.MEDIO.color
      if (percentage <= 75) return consumptionRanges.ALTO.color
      return consumptionRanges.MUY_ALTO.color
    }

    return {
      chartContainer,
      consumptionRanges,
      chartData,
      totalConsumption,
      averageConsumption,
      maxConsumption,
      getBarWidth,
      getConsumptionColor
    }
  }
}
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.chart-header h4 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-legend {
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

.chart-content {
  padding: 20px;
  min-height: 300px;
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

.empty-state {
  text-align: center;
  color: #9ca3af;
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

.chart-bars {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-bar-item {
  display: grid;
  grid-template-columns: 120px 1fr 100px;
  gap: 16px;
  align-items: center;
}

.bar-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.bar-container {
  position: relative;
  height: 32px;
  background: #f3f4f6;
  border-radius: 16px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 16px;
  transition: width 0.5s ease;
  position: relative;
}

.bar-value {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.bar-info {
  text-align: right;
}

.parishes-count {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 12px;
}

.chart-footer {
  padding: 16px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-consumption,
.average-consumption {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-label,
.average-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.total-value,
.average-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.total-value {
  color: #059669;
}

.average-value {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .chart-header {
    padding: 16px;
  }
  
  .chart-content {
    padding: 16px;
  }
  
  .chart-bars {
    gap: 12px;
  }
  
  .chart-bar-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .bar-label {
    text-align: center;
  }
  
  .bar-info {
    text-align: center;
  }
  
  .chart-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .chart-legend {
    justify-content: center;
  }
}
</style> 