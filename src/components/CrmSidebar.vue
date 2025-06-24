<template>
  <div class="h-full w-full flex flex-col bg-white rounded-2xl border border-blue-200 shadow-md p-3">
    <div class="flex items-center justify-between mb-3">
      <span class="font-semibold text-blue-800 text-lg">Bandeja de Entrada</span>
      <span class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{{ conversations.length }}</span>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div v-for="c in conversations" :key="c.id" @click="$emit('selectConversation', c.id)"
        :class="['flex items-center gap-3 px-2 py-2 mb-1 rounded-lg cursor-pointer transition', c.id === selectedConversationId ? 'bg-blue-100' : 'hover:bg-blue-50']">
        <div :style="{ background: getAvatarColor(c.id) }" class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-base">
          {{ c.nombre.charAt(0) }}
        </div>
        <div class="flex-1">
          <span :class="['font-bold', c.id === selectedConversationId ? 'text-blue-800' : 'text-gray-800']">{{ c.nombre }}</span>
        </div>
        <span class="text-xs font-semibold" :class="estadoColor(c.estado)">{{ c.estado }}</span>
      </div>
    </div>
    <div class="crm-sidebar-filters">
      <input type="text" placeholder="Buscar conversaciones..." class="crm-search" />
      <!-- Filtros simulados -->
      <select><option>Nuevo</option><option>En proceso</option><option>Escalado</option><option>Resuelto</option></select>
      <select><option>Reclamo</option><option>Consulta</option></select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  conversations: Array,
  selectedConversationId: [String, Number]
})

function getAvatarColor(id) {
  const colors = [
    '#2563eb', '#0ea5e9', '#6366f1', '#f59e42', '#10b981', '#f43f5e', '#a21caf', '#eab308', '#14b8a6', '#64748b'
  ]
  return colors[id % colors.length]
}
function estadoColor(estado) {
  if (estado === 'Activo') return 'text-green-600'
  if (estado === 'Inactivo') return 'text-gray-400'
  if (estado === 'Pendiente') return 'text-yellow-500'
  return 'text-blue-600'
}
</script>

<style scoped>
.h-full { height: 100%; }
.crm-sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.6rem 0.3rem;
}
.crm-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.7rem;
  color: #2563eb; /* Azul fuerte */
}
.crm-badge {
  background: #2563eb;
  color: #fff;
  border-radius: 12px;
  padding: 0.1rem 0.5rem;
  font-size: 0.85rem;
}
.crm-conversation-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.7rem 0;
  flex: 1;
}
.crm-conversation-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.2rem;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.89rem;
}
.crm-conversation-item.selected, .crm-conversation-item:hover {
  background: #dbeafe;
}
.crm-conv-avatar {
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.98rem;
  font-weight: 700;
  box-shadow: 0 2px 8px #2563eb22;
}
.crm-conv-info {
  flex: 1;
}
.crm-conv-title {
  font-size: 0.93rem;
  font-weight: 600;
  color: #1e40af; /* Azul más oscuro */
}
.crm-conv-subtitle {
  font-size: 0.85rem;
  color: #2563eb;
}
.crm-conv-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}
.crm-conv-time {
  font-size: 0.75rem;
  color: #2563eb;
}
.crm-conv-status {
  font-size: 0.85rem;
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
  text-transform: capitalize;
}
.crm-conv-status.nuevo { background: #dbeafe; color: #2563eb; }
.crm-conv-status.en\ proceso { background: #e0e7ff; color: #6366f1; }
.crm-conv-status.escalado { background: #fef9c3; color: #f59e42; }
.crm-conv-status.resuelto { background: #bbf7d0; color: #059669; }
.crm-sidebar-filters {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.crm-search {
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  border: 1px solid #2563eb;
  color: #2563eb;
}
select {
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #2563eb;
  color: #2563eb;
}
</style> 