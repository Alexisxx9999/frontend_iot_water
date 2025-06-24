<template>
  <section class="case-details">
    <div class="case-details-title">Detalles del Caso</div>
    <div class="case-details-main">
      <div class="case-details-info">
        <div class="case-details-subtitle">Información del Cliente</div>
        <div><b>Nombre:</b> {{ cliente.nombre }}</div>
        <div><b>ID Cliente:</b> {{ cliente.id }}</div>
        <div><b>Plan:</b> {{ cliente.plan }}</div>
        <div><b>Zona:</b> {{ cliente.zona }}</div>
      </div>
      <div class="case-details-history">
        <div class="case-details-subtitle">Historial Reciente</div>
        <ul>
          <li v-for="(item, i) in historial" :key="i">
            <span v-if="item.tipo === 'ok'" class="ok">✔️</span>
            <span v-else-if="item.tipo === 'alerta'" class="alerta">⚠️</span>
            {{ item.texto }}
          </li>
        </ul>
      </div>
    </div>
    <div class="case-details-notas">
      <div class="case-details-subtitle">Notas Internas</div>
      <textarea v-model="nota" rows="2" />
    </div>
  </section>
</template>
<script setup>
import { ref } from 'vue'
const cliente = ref({
  nombre: 'Juan López',
  id: '458792',
  plan: 'Residencial Plus',
  zona: 'Sector Norte'
})
const historial = ref([
  { tipo: 'ok', texto: 'Consulta facturación - Resuelto (15/05)' },
  { tipo: 'ok', texto: 'Cambio de titular - Resuelto (02/04)' },
  { tipo: 'alerta', texto: 'Reclamo por fuga - Escalado (12/03)' }
])
const nota = ref('Cliente con posible fuga no detectada. Solicitar revisión técnica.')
</script>
<style scoped>
.case-details {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px #2563eb11;
  padding: 1.1rem 1rem 0.7rem 1rem;
  margin-bottom: 1.2rem;
}
.case-details-title {
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  color: #2563eb;
}
.case-details-main {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.7rem;
}
.case-details-info, .case-details-history {
  flex: 1;
  font-size: 1rem;
  color: #1e40af;
}
.case-details-subtitle {
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #2563eb;
}
.case-details-info b, .case-details-history b {
  color: #2563eb;
  font-weight: 700;
}
.ok { color: #059669; margin-right: 0.2em; }
.alerta { color: #f59e42; margin-right: 0.2em; }
.case-details-notas {
  margin-top: 0.7rem;
}
.case-details-notas textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 0.5rem;
  font-size: 0.97rem;
  background: #f8fafc;
  resize: vertical;
  color: #1e40af;
  font-weight: 600;
}
</style> 