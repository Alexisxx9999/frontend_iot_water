<template>
  <section class="chatbot-stats">
    <div class="chatbot-stats-title">Estadísticas de Chatbot</div>
    <div class="chatbot-stats-row">
      <div class="stat-label">Resolución Automática</div>
      <div class="stat-value">68% de consultas <span class="stat-extra">1,240/mes</span></div>
      <div class="stat-bar"><div class="stat-bar-fill" style="width:68%"></div></div>
    </div>
    <div class="chatbot-stats-row">
      <div class="stat-label">Precisión de Respuestas</div>
      <div class="stat-value">92% de aciertos <span class="stat-extra">+3% vs mes anterior</span></div>
      <div class="stat-bar stat-bar-green"><div class="stat-bar-fill" style="width:92%"></div></div>
    </div>
    <div class="chatbot-stats-row">
      <div class="stat-label">Temas más Consultados</div>
      <div class="stat-topic"><span>Facturación</span><span>42%</span></div>
      <div class="stat-bar"><div class="stat-bar-fill" style="width:42%"></div></div>
      <div class="stat-topic"><span>Cortes programados</span><span>23%</span></div>
      <div class="stat-bar"><div class="stat-bar-fill" style="width:23%"></div></div>
      <div class="stat-topic"><span>Fugas reportadas</span><span>18%</span></div>
      <div class="stat-bar stat-bar-yellow"><div class="stat-bar-fill" style="width:18%"></div></div>
    </div>
    <div class="chatbot-stats-subtitle">Etiquetas y Categorías</div>
    <div class="chatbot-tags">
      <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>
  </section>
</template>
<script setup>
const tags = [
  'Facturación', 'Reclamo', 'Consulta', 'Fugas', 'Corte', 'Pago', 'Medidor', 'Técnico'
]
</script>
<style scoped>
.chatbot-stats {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px #2563eb11;
  padding: 1.1rem 1rem 0.7rem 1rem;
  margin-bottom: 1.2rem;
}
.chatbot-stats-title {
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  color: #2563eb;
}
.chatbot-stats-row {
  margin-bottom: 0.7rem;
}
.stat-label {
  font-size: 0.97rem;
  font-weight: 600;
  color: #1e40af;
}
.stat-value {
  font-size: 0.97rem;
  margin-bottom: 0.2rem;
}
.stat-extra {
  color: #64748b;
  font-size: 0.92em;
  margin-left: 0.5em;
}
.stat-bar {
  background: #e0e7ff;
  border-radius: 6px;
  height: 8px;
  margin-bottom: 0.3rem;
  width: 100%;
  overflow: hidden;
}
.stat-bar-fill {
  background: #2563eb;
  height: 100%;
  border-radius: 6px;
}
.stat-bar-green .stat-bar-fill {
  background: #22c55e;
}
.stat-bar-yellow .stat-bar-fill {
  background: #facc15;
}
.stat-topic {
  display: flex;
  justify-content: space-between;
  font-size: 0.96rem;
  margin-top: 0.2rem;
}
.chatbot-stats-subtitle {
  font-weight: 600;
  color: #1e40af;
  margin: 0.7rem 0 0.3rem 0;
  font-size: 0.97rem;
}
.chatbot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.tag {
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  padding: 0.2rem 0.8rem;
  font-size: 0.95rem;
  font-weight: 600;
}
</style> 