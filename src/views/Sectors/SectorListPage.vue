<template>
  <div class="sector-list-page">
    <div class="page-header">
      <h1>Gestión de Sectores</h1>
      <p>Administra los sectores de la ciudad y sus códigos postales</p>
    </div>
    <!-- Filtros y búsqueda -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar por nombre, código postal o descripción..."
          class="search-input"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="filter-actions">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <button @click="refreshData" class="btn btn-secondary">
          <i class="fas fa-refresh"></i> Actualizar
        </button>
        <router-link to="/app/sectors/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Nuevo Sector
        </router-link>
      </div>
    </div>
    <!-- Tabla de registros -->
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando sectores...</p>
      </div>
      <div v-else-if="filteredItems.length === 0" class="empty-state">
        <i class="fas fa-map-marker-alt empty-icon"></i>
        <h3>No se encontraron sectores</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay sectores disponibles' }}</p>
        <router-link to="/app/sectors/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Crear primer sector
        </router-link>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Sector</th>
            <th>Código Postal</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.id" class="table-row">
            <td>{{ item.id }}</td>
            <td><strong>{{ item.nombreSector }}</strong></td>
            <td><span class="postal-code">{{ item.codigoPostalSector }}</span></td>
            <td><div class="text-cell" :title="item.descripcionSector">{{ truncateText(item.descripcionSector, 60) }}</div></td>
            <td>
              <span class="state-dot" :class="item.estado === 'active' ? 'dot-active' : 'dot-inactive'"></span>
              <span class="state-text" :class="item.estado === 'active' ? 'text-active' : 'text-inactive'">
                {{ item.estado === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <router-link
                  :to="`/app/sectors/edit/${item.id}`"
                  class="btn-action btn-edit"
                  title="Editar sector"
                >
                  <span class="emoji">✏️</span> Editar
                </router-link>
                <button
                  @click="deleteItem(item.id)"
                  class="btn-action btn-delete"
                  :title="'Eliminar sector'"
                >
                  <span class="emoji">🗑️</span> Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn-page">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn-page">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>¿Eliminar sector?</h3>
          <button @click="showDeleteModal = false" class="btn-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar este sector?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancelar</button>
          <button @click="confirmDelete" class="btn btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue'
import { useSectorsStore } from '@/stores/sectors'
import { showToast } from '@/composables/useToast'

export default {
  name: 'SectorListPage',
  setup() {
    const sectorsStore = useSectorsStore()
    // Estado reactivo
    const loading = ref(false)
    const searchTerm = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const showDeleteModal = ref(false)
    const itemToDelete = ref(null)
    // Computed properties
    const filteredItems = computed(() => {
      let filtered = sectorsStore.items
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.nombreSector.toLowerCase().includes(term) ||
          item.codigoPostalSector.toLowerCase().includes(term) ||
          item.descripcionSector.toLowerCase().includes(term)
        )
      }
      if (statusFilter.value) {
        filtered = filtered.filter(item => item.estado === statusFilter.value)
      }
      return filtered
    })
    const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value))
    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredItems.value.slice(start, end)
    })
    // Métodos
    const loadData = async () => {
      loading.value = true
      try {
        await sectorsStore.fetchItems()
      } catch (error) {
        showToast('Error al cargar los sectores', 'error')
        console.error('Error cargando datos:', error)
      } finally {
        loading.value = false
      }
    }
    const refreshData = () => {
      currentPage.value = 1
      loadData()
    }
    const deleteItem = (id) => {
      itemToDelete.value = id
      showDeleteModal.value = true
    }
    const confirmDelete = async () => {
      if (!itemToDelete.value) return
      try {
        await sectorsStore.deleteItem(itemToDelete.value)
        window.showSimpleToast('Sector eliminado correctamente', 'success')
        showDeleteModal.value = false
        itemToDelete.value = null
      } catch (error) {
        window.showSimpleToast('Error al eliminar el sector', 'error')
        console.error('Error eliminando sector:', error)
      }
    }
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }
    onMounted(() => {
      loadData()
    })
    return {
      loading,
      searchTerm,
      statusFilter,
      currentPage,
      showDeleteModal,
      filteredItems,
      totalPages,
      paginatedItems,
      loadData,
      refreshData,
      deleteItem,
      confirmDelete,
      truncateText
    }
  }
}
</script>
<style scoped>
.sector-list-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #d5dbdb;
}

.btn-danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading-container {
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e1e8ed;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e1e8ed;
}

.table-row:hover {
  background: #f8f9fa;
}

.name-cell strong {
  color: #2c3e50;
  font-weight: 600;
}

.postal-code {
  background: #e8f4fd;
  color: #2980b9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 600;
}

.text-cell {
  max-width: 300px;
  color: #7f8c8d;
  line-height: 1.4;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.actions-cell {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  align-items: center;
}
.btn-action {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  border-radius: 1.2rem;
  font-size: 0.98rem;
  font-weight: 600;
  padding: 0.32rem 0.85rem;
  cursor: pointer;
  background: #f1f5f9;
  color: #334155;
  box-shadow: 0 1px 4px #2563eb11;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.12s;
  position: relative;
  outline: none;
  min-height: 28px;
}
.btn-action:focus {
  outline: 2px solid #2563eb;
}
.btn-action:hover {
  background: #e0e7ff;
  color: #2563eb;
  box-shadow: 0 2px 8px #2563eb22;
  transform: scale(1.03);
}
.btn-edit {
  background: #fef9c3;
  color: #b45309;
  border: 1.2px solid #fde68a;
}
.btn-edit:hover {
  background: #fde68a;
  color: #a16207;
  border-color: #fbbf24;
}
.btn-delete {
  background: #fee2e2;
  color: #b91c1c;
  border: 1.2px solid #fecaca;
}
.btn-delete:hover {
  background: #fecaca;
  color: #991b1b;
  border-color: #ef4444;
}
.btn-action .emoji {
  font-size: 1.08em;
  margin-right: 0.15em;
}
.btn-action i {
  font-size: 1.25rem;
}
.btn-action[title]:hover:after {
  content: attr(title);
  position: absolute;
  bottom: -2.2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #334155;
  color: #fff;
  padding: 0.25rem 0.7rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0.95;
  z-index: 10;
  box-shadow: 0 2px 8px #0002;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
}

.btn-page {
  width: 40px;
  height: 40px;
  border: 2px solid #e1e8ed;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-page:hover:not(:disabled) {
  border-color: #3498db;
  color: #3498db;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #7f8c8d;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e1e8ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #95a5a6;
}

.modal-body {
  padding: 1.5rem;
}

.warning-text {
  color: #e74c3c;
  font-weight: 600;
  margin-top: 0.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e1e8ed;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.state-dot {
  display: inline-block;
  width: 0.85em;
  height: 0.85em;
  border-radius: 50%;
  margin-right: 0.45em;
  vertical-align: middle;
  box-shadow: 0 1px 3px #0001;
}
.dot-active {
  background: #22c55e;
}
.dot-inactive {
  background: #ef4444;
}
.state-text {
  font-weight: 600;
  font-size: 1.01em;
  vertical-align: middle;
}
.text-active {
  color: #15803d;
}
.text-inactive {
  color: #b91c1c;
}

@media (max-width: 768px) {
  .sector-list-page {
    padding: 1rem;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-actions {
    justify-content: center;
  }
  
  .data-table {
    font-size: 0.875rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
<!--
// Servicio listo para backend:
// En src/services/sectors.service.js cambia los métodos por peticiones HTTP reales (fetch o axios):
// Ejemplo:
// import axios from 'axios';
// const API_URL = 'https://tu-backend.com/api/sectors';
// getItems: () => axios.get(API_URL),
// createItem: (data) => axios.post(API_URL, data),
// updateItem: (id, data) => axios.put(`${API_URL}/${id}`, data),
// deleteItem: (id) => axios.delete(`${API_URL}/${id}`)
--> 