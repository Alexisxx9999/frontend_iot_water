<template>
  <div class="role-list">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-1438537439-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Gestión de Roles</h2>
        <p>Administra los permisos y perfiles de usuario en el sistema.</p>
      </div>
    </div>
    <div class="header">
      <h1><i class="fas fa-user-shield"></i> Lista de Roles</h1>
      <router-link to="/app/roles/create" class="btn btn-primary">
        <font-awesome-icon :icon="['fas', 'plus']" /> Nuevo Rol
      </router-link>
    </div>
    <LoadingSpinner v-if="loading" message="Cargando roles..." />
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else class="content">
      <div class="filters-section">
        <div class="search-box">
          <input v-model="filtros.nombre" type="text" placeholder="Buscar por nombre..." class="search-input">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-controls">
          <select v-model="filtros.estado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <button @click="limpiarFiltros" class="btn btn-secondary">
            <font-awesome-icon :icon="['fas', 'times']" /> Limpiar
          </button>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat-item"><span class="stat-label">Total:</span><span class="stat-value">{{ rolesFiltrados.length }}</span></div>
        <div class="stat-item"><span class="stat-label">Activos:</span><span class="stat-value active">{{ rolesActivos }}</span></div>
        <div class="stat-item"><span class="stat-label">Inactivos:</span><span class="stat-value inactive">{{ rolesInactivos }}</span></div>
      </div>
      <div class="table-container">
        <table class="roles-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Permisos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in rolesFiltrados" :key="role.id" class="role-row">
              <td class="nombre-cell"><strong>{{ role.nombreRol || role.name }}</strong></td>
              <td>{{ role.descripcionRol || role.description || '-' }}</td>
              <td>
                <div class="permissions-container">
                  <span v-for="perm in (role.permissions || [])" :key="perm" class="permission-badge">{{ perm }}</span>
                  <span v-if="!role.permissions || role.permissions.length === 0" class="no-permissions">Sin permisos</span>
                </div>
              </td>
              <td>
                <span :class="['status-badge', (role.estadoRol || role.status) === 'Activo' ? 'active' : 'inactive']">
                  {{ role.estadoRol || role.status || 'Activo' }}
                </span>
              </td>
              <td class="actions-cell"> 
                <div class="action-buttons">
                  <router-link :to="`/app/roles/${role.id}/edit`" class="btn btn-warning btn-sm" title="Editar rol">
                    <font-awesome-icon :icon="['fas', 'edit']" />
                  </router-link>
                  <button @click="openDeleteModal(role)" class="btn btn-danger btn-sm" title="Eliminar rol">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                  <button v-if="(role.estadoRol || role.status) === 'Activo'" @click="deactivateRole(role.id)" class="btn btn-secondary btn-sm" title="Desactivar rol">
                    <font-awesome-icon :icon="['fas', 'pause']" />
                  </button>
                  <button v-else @click="activateRole(role.id)" class="btn btn-success btn-sm" title="Activar rol">
                    <font-awesome-icon :icon="['fas', 'play']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="rolesFiltrados.length === 0" class="no-results">
          <i class="fas fa-search"></i>
          <p>No se encontraron roles con los filtros aplicados</p>
          <button @click="limpiarFiltros" class="btn btn-primary">
            <font-awesome-icon :icon="['fas', 'refresh']" /> Limpiar filtros
          </button>
        </div>
      </div>
    </div>
    <div v-if="mostrarModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres eliminar el rol <strong>{{ rolAEliminar?.nombreRol || rolAEliminar?.name }}</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-secondary">Cancelar</button>
          <button @click="deleteRoleConfirmed" class="btn btn-danger">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rolesService from '@/services/roles.service.js'
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'RoleListPage',
  components: {
    LoadingSpinner
  },
  setup() {
    const roles = ref([])
    const loading = ref(true)
    const error = ref(null)
    const filtros = ref({ nombre: '', estado: '' })
    const mostrarModal = ref(false)
    const rolAEliminar = ref(null)

    const limpiarFiltros = () => {
      filtros.value = { nombre: '', estado: '' }
    }

    const rolesFiltrados = computed(() => {
      let result = [...roles.value]
      if (filtros.value.nombre) {
        result = result.filter(r => 
          (r.nombreRol || r.name || '').toLowerCase().includes(filtros.value.nombre.toLowerCase())
        )
      }
      if (filtros.value.estado) {
        result = result.filter(r => (r.estadoRol || r.status) === filtros.value.estado)
      }
      return result
    })

    const rolesActivos = computed(() => 
      rolesFiltrados.value.filter(r => (r.estadoRol || r.status) === 'Activo').length
    )
    const rolesInactivos = computed(() => 
      rolesFiltrados.value.filter(r => (r.estadoRol || r.status) === 'Inactivo').length
    )

    const openDeleteModal = (role) => {
      rolAEliminar.value = role
      mostrarModal.value = true
    }

    const closeDeleteModal = () => {
      mostrarModal.value = false
      rolAEliminar.value = null
    }

    const deleteRoleConfirmed = async () => {
      try {
        await rolesService.deleteRole(rolAEliminar.value.id)
        roles.value = roles.value.filter(r => r.id !== rolAEliminar.value.id)
        closeDeleteModal()
      } catch (error) {
        closeDeleteModal()
      }
    }

    const deactivateRole = async (id) => {
      try {
        await rolesService.updateRole(id, { estadoRol: 'Inactivo' })
        const idx = roles.value.findIndex(r => r.id === id)
        if (idx !== -1) {
          roles.value[idx].estadoRol = 'Inactivo'
          roles.value = [...roles.value]
        }
      } catch (error) {}
    }

    const activateRole = async (id) => {
      try {
        await rolesService.updateRole(id, { estadoRol: 'Activo' })
        const idx = roles.value.findIndex(r => r.id === id)
        if (idx !== -1) {
          roles.value[idx].estadoRol = 'Activo'
          roles.value = [...roles.value]
        }
      } catch (error) {}
    }

    const fetchRoles = async () => {
      try {
        loading.value = true
        const response = await rolesService.getRoles()
        roles.value = response.data || response || []
      } catch (err) {
        error.value = 'Error al cargar los roles: ' + err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchRoles)

    return { 
      roles, 
      loading, 
      error, 
      filtros, 
      rolesFiltrados, 
      rolesActivos, 
      rolesInactivos,
      mostrarModal,
      rolAEliminar,
      limpiarFiltros,
      openDeleteModal,
      closeDeleteModal,
      deleteRoleConfirmed,
      deactivateRole,
      activateRole
    }
  }
}
</script>

<style scoped>
.role-list {
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

.roles-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.roles-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}

.roles-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.role-row:hover {
  background-color: #f8f9fa;
}

.nombre-cell {
  font-weight: 600;
}

.permissions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 300px;
}

.permission-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.no-permissions {
  color: #6c757d;
  font-style: italic;
  font-size: 12px;
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

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #495057;
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

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
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

.institutional-video-banner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2.5rem auto;
  position: relative;
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(34, 91, 140, 0.10);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-video {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 18px;
  z-index: 0;
  display: block;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(20,40,60,0.55) 60%, rgba(0,0,0,0.35) 100%);
  z-index: 1;
}

.banner-caption {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-left: 2.5rem;
  z-index: 2;
}

.banner-caption h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.banner-caption p {
  font-size: 1.15rem;
  color: #e0e6f0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
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
  .roles-table {
    font-size: 14px;
  }
  .roles-table th,
  .roles-table td {
    padding: 10px 8px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 3px;
  }
}
</style> 