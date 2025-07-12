<template>
  <div class="home-list-page">
    <div class="page-header">
      <h1>Gestión de Información Home</h1>
      <p>Administra la información principal de la empresa</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar por nombre, misión o visión..."
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
        
        <router-link to="/app/home/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Nuevo Registro
        </router-link>
      </div>
    </div>

    <!-- Tabla de registros -->
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando registros...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="empty-state">
        <i class="fas fa-inbox empty-icon"></i>
        <h3>No se encontraron registros</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay registros disponibles' }}</p>
        <router-link to="/app/home/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Crear primer registro
        </router-link>
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Misión</th>
            <th>Visión</th>
            <th>Celular</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.id" class="table-row">
            <td>{{ item.id }}</td>
            <td>
              <div class="name-cell">
                <strong>{{ item.nombre }}</strong>
                <small>{{ item.email }}</small>
              </div>
            </td>
            <td>
              <div class="text-cell" :title="item.mision">
                {{ truncateText(item.mision, 50) }}
              </div>
            </td>
            <td>
              <div class="text-cell" :title="item.vision">
                {{ truncateText(item.vision, 50) }}
              </div>
            </td>
            <td>{{ item.celular }}</td>
            <td>
              <span :class="['status-badge', item.estado]">
                {{ item.estado === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <router-link 
                  :to="`/app/home/detail/${item.id}`" 
                  class="btn-icon btn-view"
                  title="Ver detalles"
                >
                  <i class="fas fa-eye"></i>
                </router-link>
                
                <router-link 
                  :to="`/app/home/edit/${item.id}`" 
                  class="btn-icon btn-edit"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </router-link>
                
                <button 
                  @click="deleteItem(item.id)" 
                  class="btn-icon btn-delete"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="btn-page"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="btn-page"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar eliminación</h3>
          <button @click="showDeleteModal = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar este registro?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="confirmDelete" class="btn btn-danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useHomeStore } from '@/stores/home'

export default {
  name: 'HomeListPage',
  setup() {
    const homeStore = useHomeStore()
    
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
      let filtered = homeStore.items

      // Filtro por búsqueda
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.nombre.toLowerCase().includes(term) ||
          item.mision.toLowerCase().includes(term) ||
          item.vision.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term)
        )
      }

      // Filtro por estado
      if (statusFilter.value) {
        filtered = filtered.filter(item => item.estado === statusFilter.value)
      }

      return filtered
    })

    const totalPages = computed(() => 
      Math.ceil(filteredItems.value.length / itemsPerPage.value)
    )

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredItems.value.slice(start, end)
    })

    // Métodos
    const loadData = async () => {
      loading.value = true
      try {
        await homeStore.fetchItems()
      } catch (error) {
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
        await homeStore.deleteItem(itemToDelete.value)
        showDeleteModal.value = false
        itemToDelete.value = null
      } catch (error) {
        console.error('Error eliminando item:', error)
      }
    }

    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }

    // Lifecycle
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
.home-list-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
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
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
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
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
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
  vertical-align: middle;
}

.table-row:hover {
  background: #f8f9fa;
}

.name-cell strong {
  display: block;
  color: #2c3e50;
}

.name-cell small {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.text-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
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
  gap: 0.5rem;
  justify-content: center;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-view {
  background: #17a2b8;
  color: white;
}

.btn-view:hover {
  background: #138496;
}

.btn-edit {
  background: #ffc107;
  color: #212529;
}

.btn-edit:hover {
  background: #e0a800;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  border-top: 1px solid #e1e8ed;
}

.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid #e1e8ed;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-page:hover:not(:disabled) {
  background: #f8f9fa;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #7f8c8d;
  font-weight: 500;
}

/* Modal */
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
  color: #7f8c8d;
}

.modal-body {
  padding: 1.5rem;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e1e8ed;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

/* Responsive */
@media (max-width: 768px) {
  .home-list-page {
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
    font-size: 0.9rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style> 