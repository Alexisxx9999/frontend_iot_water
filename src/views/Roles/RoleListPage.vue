<template>
  <div class="medidor-list">
    <div class="header">
      <h1><i class="fas fa-user-shield"></i> Gestión de Roles</h1>
      <router-link to="/app/roles/create" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nuevo Rol
      </router-link>
    </div>
    <LoadingSpinner v-if="loading" message="Cargando roles..." />
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else class="content">
      <div class="filters-section">
        <div class="search-box">
          <input v-model="search" type="text" placeholder="Buscar por nombre o descripción..." class="search-input">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-controls">
          <select v-model="estadoFiltro" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <button @click="limpiarFiltros" class="btn btn-secondary"><i class="fas fa-times"></i> Limpiar</button>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat-item"><span class="stat-label">Total:</span><span class="stat-value">{{ rolesFiltrados.length }}</span></div>
        <div class="stat-item"><span class="stat-label">Activos:</span><span class="stat-value active">{{ rolesActivos }}</span></div>
        <div class="stat-item"><span class="stat-label inactive">Inactivos:</span><span class="stat-value inactive">{{ rolesInactivos }}</span></div>
      </div>
      <div class="table-container">
        <table class="medidores-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rol in rolesFiltrados" :key="rol.id" class="medidor-row">
              <td class="codigo-cell"><strong>{{ rol.nombreRol }}</strong></td>
              <td>{{ rol.descripcionRol }}</td>
              <td>
                <span :class="['status-badge', rol.estadoRol === 'Activo' ? 'estado-activo' : 'estado-inactivo']">{{ rol.estadoRol }}</span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <router-link :to="`/app/roles/edit/${rol.id}`" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></router-link>
                  <button @click="confirmarEliminar(rol)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="rolesFiltrados.length === 0" class="no-results"><i class="fas fa-search"></i><p>No se encontraron roles con los filtros aplicados</p><button @click="limpiarFiltros" class="btn btn-primary">Limpiar filtros</button></div>
      </div>
    </div>
    <div v-if="mostrarModal" class="modal-overlay" @click="cancelarEliminar">
      <div class="modal-content" @click.stop>
        <div class="modal-header"><h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3></div>
        <div class="modal-body"><p>¿Estás seguro de que quieres eliminar el rol <strong>{{ rolAEliminar?.nombreRol }}</strong>?</p><p class="warning-text">Esta acción no se puede deshacer.</p></div>
        <div class="modal-footer"><button @click="cancelarEliminar" class="btn btn-secondary">Cancelar</button><button @click="eliminarRolConfirmado" class="btn btn-danger"><i class="fas fa-trash"></i> Eliminar</button></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { rolesService } from '../../services/roles.service.js'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
const roles = ref([])
const loading = ref(true)
const error = ref(null)
const mostrarModal = ref(false)
const rolAEliminar = ref(null)
const search = ref('')
const estadoFiltro = ref('')
onMounted(async () => { await loadRoles() })
const loadRoles = async () => { try { loading.value = true; roles.value = await rolesService.getRoles() } catch (err) { error.value = 'Error al cargar los roles: ' + err.message } finally { loading.value = false } }
const rolesFiltrados = computed(() => { let result = [...roles.value]; if (search.value) { const s = search.value.toLowerCase(); result = result.filter(r => r.nombreRol.toLowerCase().includes(s) || r.descripcionRol.toLowerCase().includes(s)) } if (estadoFiltro.value) { result = result.filter(r => r.estadoRol === estadoFiltro.value) } return result })
const rolesActivos = computed(() => rolesFiltrados.value.filter(r => r.estadoRol === 'Activo').length)
const rolesInactivos = computed(() => rolesFiltrados.value.filter(r => r.estadoRol === 'Inactivo').length)
function limpiarFiltros() { search.value = ''; estadoFiltro.value = '' }
function confirmarEliminar(rol) { rolAEliminar.value = rol; mostrarModal.value = true }
function cancelarEliminar() { mostrarModal.value = false; rolAEliminar.value = null }
async function eliminarRolConfirmado() { if (!rolAEliminar.value) return; try { await rolesService.deleteRole(rolAEliminar.value.id); roles.value = roles.value.filter(r => r.id !== rolAEliminar.value.id); mostrarModal.value = false; rolAEliminar.value = null } catch (err) { error.value = 'Error al eliminar el rol: ' + err.message } }
</script>
<style scoped>
.medidor-list {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(34, 91, 140, 0.10);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1400px;
  min-width: 320px;
  width: 100%;
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
.medidores-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.medidores-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}
.medidores-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}
.medidor-row:hover {
  background-color: #f8f9fa;
}
.codigo-cell {
  font-weight: 600;
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
  .medidores-table {
    font-size: 14px;
  }
  .medidores-table th,
  .medidores-table td {
    padding: 10px 8px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 3px;
  }
}
</style> 