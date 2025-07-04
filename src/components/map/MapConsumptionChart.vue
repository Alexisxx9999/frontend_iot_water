<template>
  <div class="chart-container">
    <h4>Consumo por Zona</h4>
    <div v-for="item in data" :key="item.zonalAdmin" class="bar-row">
      <span>{{ item.zonalAdmin }}</span>
      <div class="bar" :style="{ width: `${item.consumption}%` }"></div>
      <span>{{ item.consumption }} m³</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MapConsumptionChart',
  props: {
    data: { type: Array, default: () => [] }
  }
};
</script>
<style scoped>
.chart-container { background: #fff; border-radius: 8px; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.bar-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
.bar { height: 16px; background: #4f8cff; border-radius: 8px; transition: width 0.3s; }
</style> 