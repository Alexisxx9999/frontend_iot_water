<template>
  <div class="medidor-list">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-1727476237-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Gestión de Dispositivos</h2>
        <p>Controla y administra todos los medidores inteligentes de tu red.</p>
      </div>
    </div>
    <div class="header">
      <h1 class="heading-1"><font-awesome-icon icon="list" /> Lista de Medidores</h1>
      <router-link to="/app/devices/create" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nuevo Medidor
      </router-link>
    </div>
    <LoadingSpinner v-if="loading" message="Cargando medidores..." />
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
            <option v-for="tipo in tiposMedidores" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
          </select>
          <select v-model="filtros.estado" class="filter-select">
            <option value="">Todos los estados</option>
            <option v-for="estado in estadosMedidores" :key="estado.value" :value="estado.value">{{ estado.label }}</option>
          </select>
          <select v-model="ordenamiento" class="filter-select">
            <option value="codigo">Ordenar por Código</option>
            <option value="tipo">Ordenar por Tipo</option>
            <option value="estado">Ordenar por Estado</option>
            <option value="consumoActual">Ordenar por Consumo</option>
            <option value="fechaLectura">Ordenar por Fecha</option>
          </select>
          <button @click="limpiarFiltros" class="btn btn-secondary"><i class="fas fa-times"></i> Limpiar</button>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat-item"><span class="text-body">Total:</span><span class="stat-value">{{ medidoresFiltrados.length }}</span></div>
        <div class="stat-item"><span class="stat-label">Activos:</span><span class="stat-value active">{{ medidoresActivos }}</span></div>
        <div class="stat-item"><span class="stat-label">Mantenimiento:</span><span class="stat-value maintenance">{{ medidoresMantenimiento }}</span></div>
        <div class="stat-item"><span class="stat-label">Inactivos:</span><span class="stat-value inactive">{{ medidoresInactivos }}</span></div>
      </div>
      <div class="table-container">
        <table class="medidores-table">
          <thead>
            <tr>
              <th class="subtitle">Código</th>
              <th class="subtitle">Tipo</th>
              <th class="subtitle">Consumo Actual (m³)</th>
              <th class="subtitle">Estado</th>
              <th class="subtitle">Marca</th>
              <th class="subtitle">Modelo</th>
              <th class="subtitle">Última Lectura</th>
              <th class="subtitle">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medidor in medidoresOrdenados" :key="medidor.id" class="medidor-row">
              <td class="codigo-cell"><strong>{{ medidor.codigo }}</strong></td>
              <td><span class="tipo-badge">{{ getTipoText(medidor.tipo) }}</span></td>
              <td class="consumo-cell"><span class="consumo-value">{{ medidor.consumoActual.toFixed(2) }}</span></td>
              <td>
                <span :class="['status-badge', getEstadoClass(medidor.estado)]">{{ getEstadoText(medidor.estado) }}</span>
                <div v-if="medidor.mensajeMantenimiento" class="mensaje-mantenimiento"><i class="fas fa-info-circle"></i>{{ medidor.mensajeMantenimiento }}</div>
              </td>
              <td>{{ medidor.marca }}</td>
              <td>{{ medidor.modelo }}</td>
              <td>{{ formatDate(medidor.fechaLectura) }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <router-link :to="`/app/devices/${medidor.id}`" class="btn btn-info btn-sm">
                    <font-awesome-icon icon="eye" />
                  </router-link>
                  <router-link :to="`/app/devices/${medidor.id}/edit`" class="btn btn-warning btn-sm"><font-awesome-icon icon="edit" /></router-link>
                  <button @click="confirmarEliminar(medidor)" class="btn btn-danger btn-sm"><font-awesome-icon icon="trash" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="medidoresFiltrados.length === 0" class="no-results"><i class="fas fa-search"></i><p>No se encontraron medidores con los filtros aplicados</p><button @click="limpiarFiltros" class="btn btn-primary">Limpiar filtros</button></div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelarEliminar">
      <div class="modal-content" @click.stop>
        <div class="modal-header"><h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3></div>
        <div class="modal-body"><p>¿Estás seguro de que quieres eliminar el medidor <strong>{{ medidorAEliminar?.codigo }}</strong>?</p><p class="warning-text">Esta acción no se puede deshacer.</p></div>
        <div class="modal-footer"><button @click="cancelarEliminar" class="btn btn-secondary">Cancelar</button><button @click="eliminarMedidor" class="btn btn-danger"><i class="fas fa-trash"></i> Eliminar</button></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import medidorService from '@/services/medidorService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import logo from '@/assets/images/logo.png'
import logo1 from '@/assets/images/logo1.png'
const router = useRouter()
const medidores = ref([])
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const medidorAEliminar = ref(null)
const filtros = ref({ codigo: '', tipo: '', estado: '' })
const ordenamiento = ref('codigo')
const tiposMedidores = medidorService.getTiposMedidores()
const estadosMedidores = medidorService.getEstadosMedidores()
onMounted(async () => { await loadMedidores() })
const loadMedidores = async () => { try { loading.value = true; medidores.value = await medidorService.getAllMedidores() } catch (err) { error.value = 'Error al cargar los medidores: ' + err.message } finally { loading.value = false } }
const medidoresFiltrados = computed(() => { let resultados = [...medidores.value]; if (filtros.value.codigo) { resultados = resultados.filter(m => m.codigo.toLowerCase().includes(filtros.value.codigo.toLowerCase())) } if (filtros.value.tipo) { resultados = resultados.filter(m => m.tipo === filtros.value.tipo) } if (filtros.value.estado) { resultados = resultados.filter(m => m.estado === filtros.value.estado) } return resultados })
const medidoresOrdenados = computed(() => { const ordenados = [...medidoresFiltrados.value]; ordenados.sort((a, b) => { switch (ordenamiento.value) { case 'codigo': return a.codigo.localeCompare(b.codigo); case 'tipo': return a.tipo.localeCompare(b.tipo); case 'estado': return a.estado.localeCompare(b.estado); case 'consumoActual': return b.consumoActual - a.consumoActual; case 'fechaLectura': return new Date(b.fechaLectura) - new Date(a.fechaLectura); default: return 0 } }); return ordenados })
const medidoresActivos = computed(() => medidoresFiltrados.value.filter(m => m.estado === 'activo').length)
const medidoresMantenimiento = computed(() => medidoresFiltrados.value.filter(m => m.estado === 'mantenimiento').length)
const medidoresInactivos = computed(() => medidoresFiltrados.value.filter(m => m.estado === 'inactivo').length)
function getTipoText(tipo) { const tipoObj = tiposMedidores.find(t => t.value === tipo); return tipoObj ? tipoObj.label : tipo }
function getEstadoText(estado) { const estadoObj = estadosMedidores.find(e => e.value === estado); return estadoObj ? estadoObj.label : estado }
function getEstadoClass(estado) { switch (estado) { case 'activo': return 'active'; case 'mantenimiento': return 'maintenance'; case 'inactivo': return 'inactive'; default: return '' } }
function formatDate(fecha) { if (!fecha) return ''; const date = new Date(fecha); return date.toLocaleString('es-EC', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
function limpiarFiltros() { filtros.value = { codigo: '', tipo: '', estado: '' } }
function confirmarEliminar(medidor) { medidorAEliminar.value = medidor; showDeleteModal.value = true }
function cancelarEliminar() { showDeleteModal.value = false; medidorAEliminar.value = null }
async function eliminarMedidor() { if (!medidorAEliminar.value) return; try { await medidorService.deleteMedidor(medidorAEliminar.value.id); medidores.value = medidores.value.filter(m => m.id !== medidorAEliminar.value.id); showDeleteModal.value = false; medidorAEliminar.value = null } catch (err) { error.value = 'Error al eliminar el medidor: ' + err.message } }
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
  font-weight: var(--font-weight-bold, 700);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
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
  border: 1px solid var(--border-color);
  font-size: 1rem;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}
.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  font-size: 18px;
}
.filter-controls {
  display: flex;
  gap: 1rem;
}
.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  font-size: 1rem;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}
.stats-bar {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  background: #f4f8fb;
  border-radius: 10px;
  padding: 12px 0;
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
  color: var(--success-color);
}
.stat-value.maintenance {
  color: var(--warning-color);
}
.stat-value.inactive {
  color: var(--danger-color);
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
  font-family: 'Inter', sans-serif;
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
.consumo-cell {
  text-align: center;
}
.consumo-value {
  font-weight: bold;
  color: #007bff;
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
.estado-activo {
  background-color: #d4edda;
  color: #155724;
}
.estado-mantenimiento {
  background-color: #fff3cd;
  color: #856404;
}
.estado-inactivo {
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
/* Botones personalizados para DeviceListPage */
.btn-warning {
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-warning:hover {
  background: #e0a800;
}
.btn-danger {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-danger:hover {
  background: #c82333;
}
.btn-info {
  background: #b2ebf2 !important;
  color: #1976d2 !important;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-info:hover {
  background: #81d4fa !important;
  color: #0d47a1 !important;
}
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}
.no-results i {
  font-size: 48px;
  margin-bottom: 20px;
  color: var(--border-color);
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
  background: var(--bg-primary);
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-strong);
}
.modal-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}
.modal-header h3 {
  margin: 0;
  color: var(--danger-color);
  display: flex;
  align-items: center;
  gap: 10px;
}
.modal-body {
  padding: 20px;
}
.warning-text {
  color: var(--danger-color);
  font-weight: 500;
  margin-top: 10px;
}
.modal-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
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