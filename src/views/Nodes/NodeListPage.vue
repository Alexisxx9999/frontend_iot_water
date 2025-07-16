<template>
  <div class="node-list">
    <div class="header">
      <h1><i class="fas fa-network-wired"></i> Lista de Nodos</h1>
      <router-link to="/app/nodes/create" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nuevo Nodo
      </router-link>
    </div>
    <LoadingSpinner v-if="loading" message="Cargando nodos..." />
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else class="content">
      <div class="filters-section">
        <div class="search-box">
          <input v-model="filtros.codigo" type="text" placeholder="Buscar por código..." class="search-input">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-controls">
          <select v-model="filtros.tipo" class="filter-select">
            <option value="">Todos los tipos</option>
            <option value="Sensor de Temperatura">Sensor de Temperatura</option>
            <option value="Actuador de Riego">Actuador de Riego</option>
            <option value="Sensor de Humedad">Sensor de Humedad</option>
            <option value="Sensor de Presión">Sensor de Presión</option>
            <option value="Sensor de Calidad del Agua">Sensor de Calidad del Agua</option>
            <option value="Controlador de Bomba">Controlador de Bomba</option>
            <option value="Otro">Otro</option>
          </select>
          <select v-model="filtros.estado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <button @click="limpiarFiltros" class="btn btn-secondary"><i class="fas fa-times"></i> Limpiar</button>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat-item"><span class="stat-label">Total:</span><span class="stat-value">{{ nodosFiltrados.length }}</span></div>
        <div class="stat-item"><span class="stat-label">Activos:</span><span class="stat-value active">{{ nodosActivos }}</span></div>
        <div class="stat-item"><span class="stat-label">Inactivos:</span><span class="stat-value inactive">{{ nodosInactivos }}</span></div>
      </div>
      <div class="table-container">
        <table class="nodos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Fecha Instalación</th>
              <th>Batería</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nodo in nodosFiltrados" :key="nodo.id" class="nodo-row">
              <td class="codigo-cell"><strong>{{ nodo.codigo }}</strong></td>
              <td><span class="tipo-badge">{{ nodo.tipo }}</span></td>
              <td>{{ formatDate(nodo.fechaInstalacion) }}</td>
              <td class="bateria-cell">
                <div class="battery-indicator">
                  <div class="battery-level" :style="{ width: nodo.bateria + '%' }"></div>
                  <span class="battery-text">{{ nodo.bateria }}%</span>
                </div>
              </td>
              <td>
                <span :class="['status-badge', nodo.activo ? 'active' : 'inactive']">{{ nodo.activo ? 'Activo' : 'Inactivo' }}</span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <router-link :to="`/app/nodes/update/${nodo.id}`" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></router-link>
                  <button @click="openDeleteModal(nodo)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                  <button v-if="nodo.activo" @click="deactivateNode(nodo.id)" class="btn btn-secondary btn-sm"><i class="fas fa-pause"></i></button>
                  <button v-else @click="activateNode(nodo.id)" class="btn btn-success btn-sm"><i class="fas fa-play"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="nodosFiltrados.length === 0" class="no-results">
          <i class="fas fa-search"></i>
          <p>No se encontraron nodos con los filtros aplicados</p>
          <button @click="limpiarFiltros" class="btn btn-primary">Limpiar filtros</button>
        </div>
      </div>
    </div>
    <div v-if="mostrarModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres eliminar el nodo <strong>{{ nodoAEliminar?.codigo }}</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-secondary">Cancelar</button>
          <button @click="deleteNodeConfirmed" class="btn btn-danger">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { nodeService } from '../../services/node.service.js'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const nodes = ref([])
const loading = ref(true)
const error = ref(null)
const filtros = ref({ codigo: '', tipo: '', estado: '' })
const mostrarModal = ref(false)
const nodoAEliminar = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const limpiarFiltros = () => {
  filtros.value = { codigo: '', tipo: '', estado: '' }
}

const nodosFiltrados = computed(() => {
  let result = [...nodes.value]
  if (filtros.value.codigo) {
    result = result.filter(n => n.codigo.toLowerCase().includes(filtros.value.codigo.toLowerCase()))
  }
  if (filtros.value.tipo) {
    result = result.filter(n => n.tipo === filtros.value.tipo)
  }
  if (filtros.value.estado) {
    result = result.filter(n => (filtros.value.estado === 'activo' ? n.activo : !n.activo))
  }
  return result
})

const nodosActivos = computed(() => nodosFiltrados.value.filter(n => n.activo).length)
const nodosInactivos = computed(() => nodosFiltrados.value.filter(n => !n.activo).length)

const openDeleteModal = (nodo) => {
  nodoAEliminar.value = nodo
  mostrarModal.value = true
}
const closeDeleteModal = () => {
  mostrarModal.value = false
  nodoAEliminar.value = null
}
const deleteNodeConfirmed = async () => {
  try {
    await nodeService.deleteNode(nodoAEliminar.value.id)
    nodes.value = nodes.value.filter(n => n.id !== nodoAEliminar.value.id)
    closeDeleteModal()
  } catch (error) {
    closeDeleteModal()
  }
}
const deactivateNode = async (id) => {
  try {
    await nodeService.deactivateNode(id)
    const idx = nodes.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      nodes.value[idx].activo = false
      nodes.value = [...nodes.value]
    }
  } catch (error) {}
}
const activateNode = async (id) => {
  try {
    await nodeService.activateNode(id)
    const idx = nodes.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      nodes.value[idx].activo = true
      nodes.value = [...nodes.value]
    }
  } catch (error) {}
}
const loadNodes = async () => {
  try {
    loading.value = true
    nodes.value = await nodeService.getAllNodes()
  } catch (error) {
    // Notificación ya gestionada en el servicio
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  loadNodes()
})
</script>
<style scoped>
.node-list {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(34, 91, 140, 0.10);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1200px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #225b8c;
  display: flex;
  align-items: center;
  gap: 10px;
}
.filters-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.search-box {
  position: relative;
  flex: 1;
}
.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  font-size: 1rem;
  background: #f4f8fb;
  color: #222;
}
.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #66adf4;
  font-size: 18px;
}
.filter-controls {
  display: flex;
  gap: 1rem;
}
.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  background: #f4f8fb;
  font-size: 1rem;
  color: #222;
}
.stats-bar {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.stat-item {
  background: #f4f8fb;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 1.1rem;
  color: #225b8c;
  display: flex;
  align-items: center;
  gap: 8px;
}
.stat-label {
  font-weight: 500;
}
.stat-value {
  font-weight: bold;
  font-size: 1.2rem;
}
.stat-value.active {
  color: #28a745;
}
.stat-value.inactive {
  color: #dc3545;
}
.table-container {
  background: #f8f9fa;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.05);
}
.nodos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.nodos-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}
.nodos-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}
.nodo-row:hover {
  background-color: #f8f9fa;
}
.codigo-cell {
  font-weight: 600;
}
.bateria-cell {
  text-align: center;
}
.tipo-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
}
.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}
.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}
.battery-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ecf0f1;
  border-radius: 12px;
  padding: 4px 8px;
  min-width: 80px;
}
.battery-level {
  height: 8px;
  background: linear-gradient(90deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}
.battery-text {
  font-size: 0.8em;
  font-weight: 600;
  color: #2c3e50;
}
.actions-cell {
  text-align: center;
}
.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}
.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
}
.btn-warning {
  background-color: #ffc107;
  color: #212529;
}
.btn-warning:hover {
  background-color: #e0a800;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-danger:hover {
  background-color: #c82333;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.btn-secondary:hover {
  background-color: #495057;
}
.btn-success {
  background-color: #28a745;
  color: white;
}
.btn-success:hover {
  background-color: #218838;
}
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
.no-results i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #ddd;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}
.modal-header h3 {
  margin: 0;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 10px;
}
.modal-body {
  padding: 20px;
}
.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-top: 10px;
}
.modal-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  .filter-controls {
    flex-direction: column;
  }
  .stats-bar {
    flex-direction: column;
  }
  .nodos-table {
    font-size: 14px;
  }
  .nodos-table th,
  .nodos-table td {
    padding: 10px 8px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 3px;
  }
}
</style> 