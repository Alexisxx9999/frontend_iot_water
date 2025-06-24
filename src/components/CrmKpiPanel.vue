<template>
  <section class="crm-kpi-panel">
    <div class="crm-kpi-title">KPIs de Atención</div>
    <div class="crm-kpi-list">
      <div class="crm-kpi-item">
        <div class="crm-kpi-value">{{ kpis.respuestaPromedio }} <span>min</span></div>
        <div class="crm-kpi-label">Tiempo promedio de respuesta</div>
      </div>
      <div class="crm-kpi-item">
        <div class="crm-kpi-value">{{ kpis.resueltosPrimera }}<span>%</span></div>
        <div class="crm-kpi-label">Casos resueltos en primera respuesta</div>
      </div>
      <div class="crm-kpi-item">
        <div class="crm-kpi-value">{{ kpis.nps }}</div>
        <div class="crm-kpi-label">Net Promoter Score (NPS)</div>
      </div>
      <div class="crm-kpi-item">
        <div class="crm-kpi-value">{{ kpis.satisfaccion }}<span>%</span></div>
        <div class="crm-kpi-label">Satisfacción del cliente</div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'CrmKpiPanel',
  props: {
    kpis: Object
  }
};
</script>
<style scoped>
.crm-kpi-panel {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 1.1rem 0.7rem;
  box-shadow: 0 1px 4px #2563eb11;
  min-width: 180px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
.crm-kpi-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: #2563eb;
  text-align: center;
}
.crm-kpi-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.crm-kpi-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem 0.3rem;
  box-shadow: 0 1px 2px #2563eb11;
  min-width: 70px;
}
.crm-kpi-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.1rem;
}
.crm-kpi-label {
  font-size: 0.89rem;
  color: #1e40af;
  text-align: center;
}
</style> 