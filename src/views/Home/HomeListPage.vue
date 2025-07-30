<template>
  <div class="home-list">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-588380228-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Quienes Somos</h2>
        <p>Administra la información principal de la empresa y su misión.</p>
      </div>
    </div>
    <div class="header">
      <h1><i class="fas fa-building"></i> Gestión de Información</h1>
      <router-link to="/app/home/create" class="btn btn-primary">
        <font-awesome-icon :icon="['fas', 'plus']" /> Nuevo Registro
      </router-link>
    </div>
    <LoadingSpinner v-if="loading" message="Cargando registros..." />
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else class="content">
      <div class="filters-section">
        <div class="search-box">
          <input v-model="searchTerm" type="text" placeholder="Buscar por nombre, misión o visión..." class="search-input">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
          <button @click="refreshData" class="btn btn-secondary">
            <font-awesome-icon :icon="['fas', 'sync-alt']" /> Actualizar
          </button>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat-item"><span class="stat-label">Total:</span><span class="stat-value">{{ filteredItems.length }}</span></div>
        <div class="stat-item"><span class="stat-label">Activos:</span><span class="stat-value active">{{ activeItems }}</span></div>
        <div class="stat-item"><span class="stat-label">Inactivos:</span><span class="stat-value inactive">{{ inactiveItems }}</span></div>
      </div>
      <div class="table-container">
        <table class="home-table">
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
            <tr v-for="item in paginatedItems" :key="item.id" class="home-row">
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
                <span :class="['status-badge', item.estado === 'active' ? 'active' : 'inactive']">
                  {{ item.estado === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <router-link 
                    :to="`/app/home/detail/${item.id}`" 
                    class="btn btn-info btn-sm"
                    title="Ver detalles"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </router-link>
                  <router-link 
                    :to="`/app/home/edit/${item.id}`" 
                    class="btn btn-warning btn-sm"
                    title="Editar"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" />
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredItems.length === 0" class="no-results">
          <i class="fas fa-search"></i>
          <p>No se encontraron registros con los filtros aplicados</p>
          <button @click="refreshData" class="btn btn-primary">
            <font-awesome-icon :icon="['fas', 'refresh']" /> Limpiar filtros
          </button>
        </div>
      </div>
      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="btn btn-secondary"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <span class="page-info">
          {{ currentPage }} de {{ totalPages }}
        </span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="btn btn-secondary"
        >
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>
    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres eliminar este registro?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancelar</button>
          <button @click="confirmDelete" class="btn btn-danger">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useHomeStore } from '@/stores/home'
import logo from '@/assets/images/logo.png'
import logo1 from '@/assets/images/logo1.png'

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

    // Carrusel institucional
    const carouselSlides = [
      {
        img: logo,
        alt: 'Logo IoT Water',
        title: 'Bienvenido a IoT Water',
        text: 'Innovación y tecnología para la gestión eficiente del agua en tu ciudad.'
      },
      {
        img: logo1,
        alt: 'Logo Alternativo',
        title: 'Comprometidos con el futuro',
        text: 'Transformamos la administración del agua con soluciones inteligentes.'
      },
      {
        img: null,
        alt: '',
        title: '¡Juntos por un Ecuador más sostenible!',
        text: 'La tecnología al servicio de la comunidad y el medio ambiente.'
      }
    ]
    const currentSlide = ref(0)
    let intervalId = null
    onMounted(() => {
      intervalId = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
      }, 5000)
    })
    // Limpieza del intervalo si el componente se destruye
    // onUnmounted(() => clearInterval(intervalId))

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

    const activeItems = computed(() => 
      filteredItems.value.filter(item => item.estado === 'active').length
    )
    const inactiveItems = computed(() => 
      filteredItems.value.filter(item => item.estado === 'inactive').length
    )

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
      activeItems,
      inactiveItems,
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
.home-list {
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

.home-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.home-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}

.home-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.home-row:hover {
  background-color: #f8f9fa;
}

.name-cell strong {
  font-weight: 600;
}

.name-cell small {
  display: block;
  color: #666;
  font-size: 0.9em;
}

.text-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.page-info {
  font-size: 1.1rem;
  font-weight: 500;
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
  .home-table {
    font-size: 14px;
  }
  .home-table th,
  .home-table td {
    padding: 10px 8px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 3px;
  }
}

</style> 