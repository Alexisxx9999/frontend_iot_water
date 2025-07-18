<template>
  <div class="sector-list-page">
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
      <h1>Gestión de Sectores</h1>
      <p>Administra los sectores de la ciudad y sus códigos postales</p>
    </div>
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
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <button @click="refreshData" class="btn btn-secondary">
          <i class="fas fa-rotate-right"></i> Actualizar
        </button>
      </div>
    </div>
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando sectores...</p>
      </div>
      <div v-else-if="filteredItems.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>No se encontraron sectores con los filtros aplicados</p>
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
            <td class="codigo-cell"><strong>{{ item.nombreSector }}</strong></td>
            <td><span class="tipo-badge">{{ item.codigoPostalSector }}</span></td>
            <td><div class="text-cell" :title="item.descripcionSector">{{ truncateText(item.descripcionSector, 60) }}</div></td>
            <td>
              <span :class="['status-badge', item.estado === 'active' ? 'active' : 'inactive']">
                {{ item.estado === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <router-link
                  :to="`/app/sectors/edit/${item.id}`"
                  class="btn btn-warning btn-sm"
                  title="Editar sector"
                >
                  <i class="fas fa-edit"></i>
                </router-link>
                <button
                  @click="deleteItem(item.id)"
                  class="btn btn-danger btn-sm"
                  :title="'Eliminar sector'"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalPages > 1" class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn-page">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">{{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn-page">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
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
import logo from '@/assets/images/logo.png'
import logo1 from '@/assets/images/logo1.png'

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
    // Carrusel institucional
    const carouselSlides = [
      {
        img: logo,
        alt: 'Logo IoT Water',
        title: 'Gestión de Sectores',
        text: 'Administra los sectores y códigos postales de tu ciudad con IoT Water.'
      },
      {
        img: logo1,
        alt: 'Logo Alternativo',
        title: 'Organización y eficiencia',
        text: 'Optimiza la gestión territorial y sectorial con tecnología.'
      },
      {
        img: null,
        alt: '',
        title: '¡Crecimiento para tu comunidad!',
        text: 'La administración inteligente de sectores impulsa el desarrollo.'
      }
    ]
    const currentSlide = ref(0)
    let intervalId = null
    onMounted(() => {
      intervalId = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
      }, 5000)
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
.medidor-list {
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
.filter-controls, .filter-actions {
  display: flex;
  gap: 1rem;
}
.filter-select, .custom-select {
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
.stat-value.maintenance {
  color: #ffc107;
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
.data-table, .medidores-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.data-table th, .medidores-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}
.data-table td, .medidores-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}
.table-row:hover, .medidor-row:hover {
  background-color: #f8f9fa;
}
.codigo-cell, .name-cell strong {
  font-weight: 600;
}
.consumo-cell {
  text-align: center;
}
.consumo-value {
  font-weight: bold;
  color: #007bff;
}
.tipo-badge, .postal-code {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
}
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
  text-transform: none;
}
.status-badge.active, .dot-active {
  background-color: #d4edda;
  color: #155724;
}
.status-badge.maintenance {
  background-color: #fff3cd;
  color: #856404;
}
.status-badge.inactive, .dot-inactive {
  background-color: #f8d7da;
  color: #721c24;
}
.mensaje-mantenimiento {
  font-size: 11px;
  color: #856404;
  margin-top: 5px;
}
.actions-cell {
  text-align: center;
  width: 120px;
}
.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
}
.btn-sm, .btn-action {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 1.2rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: #f1f5f9;
  color: #334155;
  box-shadow: 0 1px 4px #2563eb11;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.12s;
  position: relative;
  outline: none;
  min-height: 28px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.btn-sm:focus, .btn-action:focus {
  outline: 2px solid #2563eb;
}
.btn-sm:hover, .btn-action:hover {
  background: #e0e7ff;
  color: #2563eb;
  box-shadow: 0 2px 8px #2563eb22;
  transform: scale(1.03);
}
.btn-warning {
  background-color: #ffc107;
  color: #212529;
}
.btn-warning:hover {
  background-color: #e0a800;
}
.btn-danger, .btn-delete {
  background-color: #dc3545;
  color: white;
}
.btn-danger:hover, .btn-delete:hover {
  background-color: #c82333;
}
.btn-info {
  background-color: #17a2b8;
  color: white;
}
.btn-info:hover {
  background-color: #138496;
}
.no-results, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
.no-results i, .empty-icon {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #95a5a6;
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

.btn-modern {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-weight: 600;
  border: none;
  border-radius: 0.7em;
  padding: 0.55em 1.3em;
  font-size: 1.05em;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #0001;
  outline: none;
}
.btn-blue {
  background: #2563eb;
  color: #fff;
}
.btn-blue:hover {
  background: #1d4ed8;
}
.btn-green {
  background: #22c55e;
  color: #fff;
}
.btn-green:hover {
  background: #16a34a;
}
.custom-select {
  border-radius: 0.7em;
  padding: 0.5em 1.2em;
  font-size: 1.05em;
  border: 1.5px solid #d1d5db;
  background: #f9fafb;
  color: #222;
  margin-right: 0.7em;
  transition: border 0.18s;
}
.custom-select:focus {
  border: 1.5px solid #2563eb;
  outline: none;
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

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  .filter-controls, .filter-actions {
    flex-direction: column;
  }
  .stats-bar {
    flex-direction: column;
  }
  .data-table, .medidores-table {
    font-size: 14px;
  }
  .data-table th, .data-table td, .medidores-table th, .medidores-table td {
    padding: 10px 8px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 3px;
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