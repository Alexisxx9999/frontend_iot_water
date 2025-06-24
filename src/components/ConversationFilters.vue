<template>
  <section class="conversation-filters">
    <div class="filters-title">Filtrar Conversaciones</div>
    <div class="filters-group">
      <label>Estado</label>
      <select v-model="estado">
        <option>Nuevo</option>
        <option>En proceso</option>
        <option>Escalado</option>
        <option>Resuelto</option>
      </select>
    </div>
    <div class="filters-group">
      <label>Etiquetas</label>
      <select v-model="etiqueta">
        <option>Reclamo</option>
        <option>Consulta</option>
        <option>Fugas</option>
        <option>Facturación</option>
      </select>
    </div>
    <div class="filters-group">
      <label>Buscar</label>
      <div class="filters-search">
        <input v-model="busqueda" type="text" placeholder="Buscar conversaciones..." />
        <button><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/></svg></button>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from 'vue'
const estado = ref('Nuevo')
const etiqueta = ref('Reclamo')
const busqueda = ref('')
</script>
<style scoped>
.conversation-filters {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px #2563eb11;
  padding: 1.1rem 1rem 0.7rem 1rem;
  margin-bottom: 1.2rem;
}
.filters-title {
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  color: #2563eb;
}
.filters-group {
  margin-bottom: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
label {
  font-size: 0.97rem;
  font-weight: 600;
  color: #1e40af;
}
select, input[type="text"] {
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.7rem;
  font-size: 0.97rem;
  color: #2563eb;
  background: #f8fafc;
}
.filters-search {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.filters-search button {
  background: #f1f5fd;
  border: 1px solid #2563eb;
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.filters-search button:hover {
  background: #2563eb;
}
.filters-search button:hover svg path {
  stroke: #fff;
}
</style> 