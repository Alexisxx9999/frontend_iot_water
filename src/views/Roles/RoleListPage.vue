<template>
  <div class="role-list">
    <div class="header">
      <h1><i class="fas fa-user-shield"></i> Gestión de Roles</h1>
      <router-link to="/app/roles/create" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nuevo Rol
      </router-link>
    </div>
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
      <table class="roles-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rol in rolesFiltrados" :key="rol.id">
            <td><strong>{{ rol.nombreRol }}</strong></td>
            <td>{{ rol.descripcionRol }}</td>
            <td>
              <span :class="['status-badge', rol.estadoRol === 'Activo' ? 'active' : 'inactive']">{{ rol.estadoRol }}</span>
            </td>
            <td class="actions-cell">
              <router-link :to="`/app/roles/edit/${rol.id}`" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></router-link>
              <button @click="confirmarEliminar(rol)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="rolesFiltrados.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>No se encontraron roles con los filtros aplicados</p>
        <button @click="limpiarFiltros" class="btn btn-primary">Limpiar filtros</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { rolesService } from '../../services/roles.service.js'

const roles = ref([])
const search = ref('')
const estadoFiltro = ref('')
const eliminarId = ref(null)

onMounted(async () => {
  roles.value = await rolesService.getRoles()
})

const rolesFiltrados = computed(() => {
  let result = [...roles.value]
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(r =>
      r.nombreRol.toLowerCase().includes(s) ||
      r.descripcionRol.toLowerCase().includes(s)
    )
  }
  if (estadoFiltro.value) {
    result = result.filter(r => r.estadoRol === estadoFiltro.value)
  }
  return result
})

const rolesActivos = computed(() => rolesFiltrados.value.filter(r => r.estadoRol === 'Activo').length)
const rolesInactivos = computed(() => rolesFiltrados.value.filter(r => r.estadoRol === 'Inactivo').length)

function limpiarFiltros() {
  search.value = ''
  estadoFiltro.value = ''
}

function confirmarEliminar(rol) {
  if (confirm(`¿Seguro que deseas eliminar el rol "${rol.nombreRol}"?`)) {
    eliminarRol(rol.id)
  }
}

async function eliminarRol(id) {
  await rolesService.deleteRole(id)
  roles.value = await rolesService.getRoles()
}
</script>

<style scoped>
.role-list {
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
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  font-size: 1rem;
  text-decoration: none;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 10px 22px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
}
.btn-primary:hover {
  background: #764ba2;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.18);
}
.btn-secondary {
  background: #ecf0f1;
  color: #7f8c8d;
  padding: 10px 18px;
}
.btn-secondary:hover {
  background: #bdc3c7;
}
.btn-warning {
  background: #f1c40f;
  color: #fff;
  padding: 8px 16px;
}
.btn-warning:hover {
  background: #f39c12;
}
.btn-sm {
  font-size: 0.98em;
  padding: 7px 12px;
  border-radius: 6px;
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
  font-weight: 600;
}
.stat-value.active {
  color: #27ae60;
}
.stat-value.inactive {
  color: #e74c3c;
}
.table-container {
  margin-top: 1.5rem;
}
.roles-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.07);
}
.roles-table th, .roles-table td {
  border: 1px solid #e1e5e9;
  padding: 12px 14px;
  text-align: left;
}
.status-badge {
  display: inline-block;
  padding: 5px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.98em;
  background: #f4f8fb;
}
.status-badge.active {
  color: #27ae60;
  background: #eafaf1;
}
.status-badge.inactive {
  color: #e74c3c;
  background: #faeaea;
}
.actions-cell {
  display: flex;
  gap: 8px;
}
.no-results {
  text-align: center;
  margin: 2rem 0;
  color: #888;
}
.no-results i {
  font-size: 2rem;
  margin-bottom: 8px;
}
.btn-danger {
  background: #e74c3c;
  color: #fff;
  padding: 8px 16px;
}
.btn-danger:hover {
  background: #c0392b;
}
</style> 