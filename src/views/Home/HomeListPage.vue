<template>
  <div class="home-list-page">
    <div class="institutional-carousel">
      <div class="carousel-slide" v-for="(slide, idx) in carouselSlides" :key="idx" v-show="currentSlide === idx">
        <img v-if="slide.img" :src="slide.img" class="carousel-img" :alt="slide.alt" />
        <div class="carousel-caption">
          <h2>{{ slide.title }}</h2>
          <p>{{ slide.text }}</p>
        </div>
      </div>
      <div class="carousel-controls">
        <button v-for="(slide, idx) in carouselSlides" :key="idx" :class="['carousel-dot', {active: currentSlide === idx}]" @click="currentSlide = idx"></button>
      </div>
    </div>
    <div class="page-header">
      <h1>Gestión de Información Home</h1>
      <p>Administra la información principal de la empresa</p>
    </div>
    <!-- Filtros y búsqueda -->
    <div class="filters-section unified-filters">
      <div class="search-box unified-search-box">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar por nombre, misión o visión..."
          class="search-input unified-search-input"
        />
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon unified-search-icon" />
      </div>
      <div class="filter-actions unified-filter-actions">
        <select v-model="statusFilter" class="filter-select unified-filter-select">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <button @click="refreshData" class="btn btn-secondary unified-btn">
          <font-awesome-icon :icon="['fas', 'sync-alt']" /> Actualizar
        </button>
        <router-link to="/app/home/create" class="btn btn-primary unified-btn">
          <font-awesome-icon :icon="['fas', 'plus']" /> Nuevo Registro
        </router-link>
      </div>
    </div>
    <!-- Tabla de registros -->
    <div class="table-container unified-table-container">
      <div v-if="loading" class="loading-container unified-loading-container">
        <div class="spinner"></div>
        <p>Cargando registros...</p>
      </div>
      <div v-else-if="filteredItems.length === 0" class="empty-state unified-empty-state">
        <font-awesome-icon :icon="['fas', 'inbox']" class="empty-icon unified-empty-icon" />
        <h3>No se encontraron registros</h3>
        <p>{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay registros disponibles' }}</p>
        <router-link to="/app/home/create" class="btn btn-primary unified-btn">
          <font-awesome-icon :icon="['fas', 'plus']" /> Crear primer registro
        </router-link>
      </div>
      <table v-else class="data-table unified-table">
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
          <tr v-for="item in paginatedItems" :key="item.id" class="table-row unified-table-row">
            <td>{{ item.id }}</td>
            <td>
              <div class="name-cell unified-name-cell">
                <strong>{{ item.nombre }}</strong>
                <small>{{ item.email }}</small>
              </div>
            </td>
            <td>
              <div class="text-cell unified-text-cell" :title="item.mision">
                {{ truncateText(item.mision, 50) }}
              </div>
            </td>
            <td>
              <div class="text-cell unified-text-cell" :title="item.vision">
                {{ truncateText(item.vision, 50) }}
              </div>
            </td>
            <td>{{ item.celular }}</td>
            <td>
              <span :class="['status-badge unified-status-badge', item.estado === 'active' ? 'estado-activo' : 'estado-inactivo']">
                {{ item.estado === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="actions-cell unified-actions-cell">
              <div class="action-buttons unified-action-buttons">
                <router-link 
                  :to="`/app/home/detail/${item.id}`" 
                  class="btn-icon btn-view unified-btn-icon"
                  title="Ver detalles"
                >
                  <font-awesome-icon :icon="['fas', 'eye']" />
                </router-link>
                <router-link 
                  :to="`/app/home/edit/${item.id}`" 
                  class="btn-icon btn-edit unified-btn-icon"
                  title="Editar"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </router-link>
                <!-- Eliminar (opcional) -->
                <!--
                <button 
                  @click="deleteItem(item.id)" 
                  class="btn-icon btn-delete unified-btn-icon"
                  title="Eliminar"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
                -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination unified-pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="btn-page unified-btn-page"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <span class="page-info">
          {{ currentPage }} de {{ totalPages }}
        </span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="btn-page unified-btn-page"
        >
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>
    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay unified-modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content unified-modal-content" @click.stop>
        <div class="modal-header unified-modal-header">
          <h3>Confirmar eliminación</h3>
          <button @click="showDeleteModal = false" class="btn-close unified-btn-close">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body unified-modal-body">
          <p>¿Estás seguro de que deseas eliminar este registro?</p>
          <p class="warning-text unified-warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer unified-modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary unified-btn">
            Cancelar
          </button>
          <button @click="confirmDelete" class="btn btn-danger unified-btn">
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
      truncateText,
      carouselSlides,
      currentSlide
    }
  }
}
</script>

<style scoped>
.unified-list-container {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(34, 91, 140, 0.10);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1200px;
}
.unified-header {
  margin-bottom: 2rem;
}
.unified-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #225b8c;
}
.unified-filters {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.unified-search-box {
  position: relative;
  flex: 1;
}
.unified-search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  font-size: 1rem;
  background: #f4f8fb;
  color: #222;
}
.unified-search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #66adf4;
  font-size: 18px;
}
.unified-filter-actions {
  display: flex;
  gap: 1rem;
}
.unified-filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  background: #f4f8fb;
  font-size: 1rem;
  color: #222;
}
.unified-btn {
  font-weight: 600;
  border-radius: 8px;
  font-size: 1rem;
  padding: 10px 22px;
  transition: background 0.2s, box-shadow 0.2s;
}
.unified-table-container {
  background: #f8f9fa;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.05);
}
.unified-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.unified-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}
.unified-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}
.unified-table-row:hover {
  background-color: #f8f9fa;
}
.unified-name-cell strong {
  font-weight: 600;
}
.unified-status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
}
.estado-activo {
  background-color: #d4edda;
  color: #155724;
}
.estado-inactivo {
  background-color: #f8d7da;
  color: #721c24;
}
.unified-action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}
.unified-btn-icon {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 6px;
}
.unified-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
.unified-empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #ddd;
}
.unified-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.unified-btn-page {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
}
.unified-page-info {
  font-size: 1.1rem;
  font-weight: 500;
}
.unified-modal-overlay {
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
.unified-modal-content {
  background: white;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.unified-modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.unified-btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
.unified-modal-body {
  padding: 20px;
}
.unified-warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-top: 10px;
}
.unified-modal-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
@media (max-width: 768px) {
  .unified-header h1 {
    font-size: 1.3rem;
  }
  .unified-table th,
  .unified-table td {
    padding: 10px 8px;
    font-size: 0.95rem;
  }
  .unified-action-buttons {
    flex-direction: column;
    gap: 3px;
  }
}
.institutional-carousel {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2.5rem auto;
  position: relative;
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(34, 91, 140, 0.10);
  background: linear-gradient(90deg, #e3f2fd 60%, #f8fafc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-slide {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 2.2rem 2.5rem;
  animation: fadeIn 0.7s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.carousel-img {
  height: 110px;
  width: auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(34, 91, 140, 0.10);
  background: #fff;
  padding: 0.5rem;
}
.carousel-caption {
  flex: 1;
  text-align: left;
}
.carousel-caption h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #225b8c;
  margin-bottom: 0.5rem;
}
.carousel-caption p {
  font-size: 1.15rem;
  color: #3b4a5a;
  margin-bottom: 0;
}
.carousel-controls {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}
.carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #b0b8c1;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.carousel-dot.active {
  background: #225b8c;
}
</style> 