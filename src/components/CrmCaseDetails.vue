<template>
  <section class="crm-case-details">
    <div class="crm-case-title">Detalles del Caso</div>
    <div class="crm-case-info">
      <div><b>Cliente:</b> {{ client.nombre }}</div>
      <div><b>ID Cliente:</b> {{ client.id }}</div>
      <div><b>Plan:</b> {{ client.plan }}</div>
      <div><b>Sector:</b> {{ client.sector }}</div>
    </div>
    <div class="crm-case-info">
      <div><b>Asunto:</b> {{ caseDetails.asunto }}</div>
      <div><b>Estado:</b> {{ caseDetails.estado }}</div>
      <div><b>Prioridad:</b> {{ caseDetails.prioridad }}</div>
    </div>
    <div class="crm-case-notes">
      <b>Notas Internas:</b>
      <div class="crm-case-notes-box">{{ caseDetails.notas }}</div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'CrmCaseDetails',
  props: {
    client: Object,
    caseDetails: Object
  }
};
</script>
<style scoped>
.crm-case-details {
  background: #f7f7f7;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 2px #0001;
}
.crm-case-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: #117a62;
}
.crm-case-info {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.crm-case-notes {
  margin-top: 0.7rem;
}
.crm-case-notes-box {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.7rem;
  font-size: 0.98rem;
  color: #333;
  margin-top: 0.2rem;
}
</style> 