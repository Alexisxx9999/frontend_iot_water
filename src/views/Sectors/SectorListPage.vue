<template>
  <div class="sector-list">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-922769970-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Gestión de Sectores</h2>
        <p>Organiza y visualiza las zonas geográficas del sistema de agua.</p>
      </div>
    </div>
    
    <div class="header">
      <div>
        <h1><font-awesome-icon :icon="['fas', 'map-marked-alt']" /> Gestión de Sectores</h1>
        <p>Administra los sectores de la ciudad y sus códigos postales de forma eficiente.</p>
      </div>
      <router-link to="/app/sectors/create" class="btn btn-primary">
        <font-awesome-icon :icon="['fas', 'plus']" /> Nuevo Sector
      </router-link>
    </div>
    
    <div class="filters-section">
      <div class="search-box">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input 
          v-model="filtros.busqueda" 
          type="text" 
          placeholder="Buscar por nombre, código postal o descripción..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="filtros.estado" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button @click="limpiarFiltros" class="btn btn-secondary">
          <font-awesome-icon :icon="['fas', 'times']" /> Limpiar
        </button>
      </div>
    </div>
    
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-label">Total Sectores</div>
        <div class="stat-value">{{ sectoresFiltrados.length }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Activos</div>
        <div class="stat-value">{{ sectoresActivos }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Inactivos</div>
        <div class="stat-value">{{ sectoresInactivos }}</div>
      </div>
    </div>
    
    <div class="table-container">
      <table class="sectors-table">
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
          <tr v-for="sector in sectoresFiltrados" :key="sector.id" class="sector-row">
            <td>{{ sector.id }}</td>
            <td class="sector-cell">
              <div class="sector-name">{{ sector.nombreSector }}</div>
            </td>
            <td>
              <span class="postal-badge">{{ sector.codigoPostalSector }}</span>
            </td>
            <td>
              <div class="sector-description" :title="sector.descripcionSector">
                {{ truncateText(sector.descripcionSector, 60) }}
              </div>
            </td>
            <td>
              <span :class="['status-badge', getEstadoText(sector.estado).class]">
                {{ getEstadoText(sector.estado).text }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <router-link
                  :to="`/app/sectors/edit/${sector.id}`"
                  class="btn btn-warning btn-sm"
                  title="Editar sector"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </router-link>
                <button
                  @click="openDeleteModal(sector)"
                  class="btn btn-danger btn-sm"
                  title="Eliminar sector"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="sectoresFiltrados.length === 0" class="no-results">
        <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
        <p>No se encontraron sectores con los filtros aplicados</p>
        <router-link to="/app/sectors/create" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'plus']" /> Crear primer sector
        </router-link>
      </div>
    </div>
    
    <!-- Modal de confirmación de eliminación -->
    <div v-if="mostrarModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button @click="closeDeleteModal" class="btn-close">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">
            ¿Estás seguro de que deseas eliminar el sector <strong>{{ sectorAEliminar?.nombreSector }}</strong>?
          </p>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-secondary">Cancelar</button>
          <button @click="confirmarEliminacion" class="btn btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue'
import { useSectorsStore } from '@/stores/sectors'

export default {
  name: 'SectorListPage',
  setup() {
    const sectorsStore = useSectorsStore()
    
    // Estado reactivo
    const filtros = ref({
      busqueda: '',
      estado: ''
    })
    
    const mostrarModal = ref(false)
    const sectorAEliminar = ref(null)
    
    // Computed properties
    const sectoresFiltrados = computed(() => {
      let filtered = sectorsStore.items
      
      if (filtros.value.busqueda) {
        const term = filtros.value.busqueda.toLowerCase()
        filtered = filtered.filter(sector => 
          sector.nombreSector.toLowerCase().includes(term) ||
          sector.codigoPostalSector.toLowerCase().includes(term) ||
          sector.descripcionSector.toLowerCase().includes(term)
        )
      }
      
      if (filtros.value.estado) {
        filtered = filtered.filter(sector => sector.estado === filtros.value.estado)
      }
      
      return filtered
    })
    
    const sectoresActivos = computed(() => 
      sectorsStore.items.filter(sector => sector.estado === 'activo').length
    )
    
    const sectoresInactivos = computed(() => 
      sectorsStore.items.filter(sector => sector.estado === 'inactivo').length
    )
    
    // Métodos
    const loadData = async () => {
      try {
        await sectorsStore.fetchItems()
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    }
    const limpiarFiltros = () => {
      filtros.value.busqueda = ''
      filtros.value.estado = ''
    }
    
    const getEstadoText = (estado) => {
      switch (estado) {
        case 'activo':
          return { text: 'Activo', class: 'activo' }
        case 'inactivo':
          return { text: 'Inactivo', class: 'inactivo' }
        default:
          return { text: 'Desconocido', class: 'inactivo' }
      }
    }
    
    const openDeleteModal = (sector) => {
      sectorAEliminar.value = sector
      mostrarModal.value = true
    }
    
    const closeDeleteModal = () => {
      mostrarModal.value = false
      sectorAEliminar.value = null
    }
    
    const confirmarEliminacion = async () => {
      if (!sectorAEliminar.value) return
      
      try {
        await sectorsStore.deleteItem(sectorAEliminar.value.id)
        window.showSimpleToast('Sector eliminado correctamente', 'success')
        closeDeleteModal()
      } catch (error) {
        window.showSimpleToast('Error al eliminar el sector', 'error')
        console.error('Error eliminando sector:', error)
      }
    }
    
    const truncateText = (text, maxLength) => {
      if (!text || text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }
    
    onMounted(() => {
      loadData()
    })
    
    return {
      filtros,
      mostrarModal,
      sectorAEliminar,
      sectoresFiltrados,
      sectoresActivos,
      sectoresInactivos,
      loadData,
      limpiarFiltros,
      getEstadoText,
      openDeleteModal,
      closeDeleteModal,
      confirmarEliminacion,
      truncateText
    }
  }
}
</script>
<style scoped>
.sector-list {
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

.header p {
  color: #6b7280;
  margin-top: 0.5rem;
}

.filters-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #66adf4;
  box-shadow: 0 0 0 3px rgba(102, 173, 244, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #66adf4;
  font-size: 16px;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  color: #222;
  min-width: 150px;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #66adf4;
  box-shadow: 0 0 0 3px rgba(102, 173, 244, 0.1);
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
.sectors-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.sectors-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}

.sectors-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.sector-row:hover {
  background-color: #f8f9fa;
}

.sector-cell {
  font-weight: 600;
}

.sector-name {
  font-weight: 600;
  color: #225b8c;
}

.sector-description {
  color: #6b7280;
  max-width: 300px;
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

/* Elimino los estilos del carrusel institucional */
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

.page-header-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.2rem 2rem 1.2rem 2rem;
  background: linear-gradient(90deg, #e3f2fd 60%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 2px 12px #225b8c11;
}
.page-header-modern h1 {
  font-size: 2.1rem;
  font-weight: 800;
  color: #225b8c;
  margin-bottom: 0.3rem;
}
.page-header-modern .subtitle {
  color: #3b4a5a;
  font-size: 1.1rem;
  font-weight: 400;
}
.btn-lg {
  font-size: 1.1rem;
  padding: 0.7rem 1.5rem;
  border-radius: 1.2rem;
}
.filters-section-modern {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin: 2rem 0 1.5rem 0;
  padding: 0 2rem;
}
.search-box-modern {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  background: #f4f8fb;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  padding: 0.2rem 1rem;
}
.search-input-modern {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1rem;
  padding: 0.7rem 0.7rem 0.7rem 2.2rem;
  color: #222;
  outline: none;
}
.search-icon {
  position: absolute;
  left: 1rem;
  color: #66adf4;
  font-size: 18px;
}
.filter-select-modern {
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  background: #f4f8fb;
  font-size: 1rem;
  color: #222;
}
.table-container-modern {
  background: #f8f9fa;
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: 0 2px 8px #225b8c11;
  padding: 1.5rem 2rem;
}
.data-table-modern {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  font-size: 15px;
}
.data-table-modern th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}
.data-table-modern td {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px #225b8c11;
  vertical-align: middle;
}
.table-row-modern {
  transition: box-shadow 0.18s, background 0.18s;
}
.table-row-modern:hover {
  background-color: #e3f2fd33;
  box-shadow: 0 2px 8px #225b8c22;
}
.codigo-cell {
  font-weight: 600;
}
.postal-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.activo {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactivo {
  background: #f8d7da;
  color: #721c24;
}
.actions-cell {
  text-align: center;
  width: 120px;
}
.action-buttons-modern {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.no-results-modern {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
.no-results-modern .empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #b0b8c1;
}
.pagination-modern {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1.5rem;
}
.btn-page {
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.btn-page:disabled {
  background: #f4f8fb;
  color: #b0b8c1;
  cursor: not-allowed;
}
.modal-content-modern {
  background: #fff;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 10px 30px #225b8c33;
  padding: 0;
}
.modal-header-modern {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.warning-icon {
  color: #dc3545;
  font-size: 2.2rem;
}
.modal-header-modern h3 {
  margin: 0;
  color: #dc3545;
  font-size: 1.25rem;
  font-weight: 700;
}
.modal-body {
  padding: 1.5rem 2rem 0.5rem 2rem;
}
.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-top: 10px;
}
.modal-footer {
  padding: 1.2rem 2rem 1.5rem 2rem;
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
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .sectors-table {
    font-size: 14px;
  }
  
  .sectors-table th,
  .sectors-table td {
    padding: 10px 8px;
  }
  
  .banner-caption {
    padding-left: 1.5rem;
  }
  
  .banner-caption h2 {
    font-size: 1.5rem;
  }
  
  .banner-caption p {
    font-size: 1rem;
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