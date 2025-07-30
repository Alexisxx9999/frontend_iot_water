<template>
  <div class="device-detail">
    <!-- Banner de video institucional -->
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay muted loop>
        <source src="/videos/istockphoto-1727476237-640_adpp_is.mp4" type="video/mp4">
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Gestión Inteligente del Agua</h2>
        <p>Detalles del dispositivo IoT</p>
      </div>
    </div>

    <!-- Header -->
    <div class="header">
      <h1><i class="fas fa-tint"></i> Detalle del Dispositivo</h1>
      <div class="header-actions">
        <router-link :to="`/app/devices/${medidorId}/edit`" class="btn btn-warning">
          <i class="fas fa-sync-alt"></i> Actualizar
        </router-link>
        <button @click="confirmarEliminar" class="btn btn-danger">
          <i class="fas fa-ban"></i> Desactivar
        </button>
        <router-link to="/app/devices" class="btn btn-secondary">
          <i class="fas fa-list"></i> Lista
        </router-link>
      </div>
    </div>

    <LoadingSpinner v-if="loading" message="Cargando dispositivo..." />

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <router-link to="/app/devices" class="btn btn-secondary">
        <i class="fas fa-list"></i> Lista
      </router-link>
    </div>

    <div v-else class="content">
      <div class="form-container">
        <div class="device-info">
          <div class="info-header">
            <div class="device-title">
              <h2>{{ medidor?.codigo || 'Cargando...' }}</h2>
              <span v-if="medidor?.estado" :class="['status-badge', getEstadoClass(medidor.estado)]">
                {{ getEstadoText(medidor.estado) }}
              </span>
            </div>
            <div class="device-type">
              <span v-if="medidor?.tipo" class="type-badge">{{ getTipoText(medidor.tipo) }}</span>
            </div>
          </div>

          <div class="device-stats">
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-tint"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ medidor?.consumoActual?.toFixed(2) || '0.00' }}</span>
                <span class="stat-label">Consumo Actual (m³)</span>
              </div>
            </div>
          </div>

          <div v-if="medidor?.mensajeMantenimiento" class="maintenance-alert">
            <div class="alert" :class="getAlertClass(medidor.estado)">
              <div class="alert-content">
                <h4><i class="fas fa-exclamation-triangle"></i> Estado del Dispositivo</h4>
                <p>{{ medidor.mensajeMantenimiento }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-sections">
          <div class="detail-section">
            <h3><i class="fas fa-cogs"></i> Información Técnica</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Marca:</span>
                <span class="value">{{ medidor?.marca || 'No especificada' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Modelo:</span>
                <span class="value">{{ medidor?.modelo || 'No especificado' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Tipo:</span>
                <span class="value">{{ medidor?.tipo ? getTipoText(medidor.tipo) : 'No especificado' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Estado:</span>
                <span class="value">
                  <span v-if="medidor?.estado" :class="['status-indicator', getEstadoClass(medidor.estado)]">
                    {{ getEstadoText(medidor.estado) }}
                  </span>
                  <span v-else>No especificado</span>
                </span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3><i class="fas fa-chart-line"></i> Información de Lecturas</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Última Lectura:</span>
                <span class="value">{{ formatDate(medidor?.fechaLectura) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Consumo Actual:</span>
                <span class="value">{{ medidor?.consumoActual?.toFixed(2) || '0.00' }} m³</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3><i class="fas fa-history"></i> Información de Auditoría</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">ID del Dispositivo:</span>
                <span class="value">{{ medidor?.id || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Creado:</span>
                <span class="value">{{ formatDate(medidor?.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Última Actualización:</span>
                <span class="value">{{ formatDate(medidor?.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelarEliminar">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres eliminar el dispositivo <strong>{{ medidor?.codigo }}</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="cancelarEliminar" class="btn btn-secondary">Cancelar</button>
          <button @click="eliminarMedidor" class="btn btn-danger">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import medidorService from '@/services/medidorService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'DeviceDetailPage',
  components: {
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const medidorId = route.params.id
    const loading = ref(false)
    const error = ref(null)
    const medidor = ref(null)
    const showDeleteModal = ref(false)
    const tiposMedidores = medidorService.getTiposMedidores()
    const estadosMedidores = medidorService.getEstadosMedidores()

    const cargarMedidor = async () => {
      loading.value = true
      try {
        const data = await medidorService.getMedidorById(medidorId)
        medidor.value = data
      } catch (err) {
        error.value = 'Error al cargar el dispositivo: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const confirmarEliminar = () => {
      showDeleteModal.value = true
    }

    const cancelarEliminar = () => {
      showDeleteModal.value = false
    }

    const eliminarMedidor = async () => {
      try {
        await medidorService.deleteMedidor(medidorId)
        router.push('/app/devices')
      } catch (err) {
        error.value = 'Error al eliminar el dispositivo: ' + err.message
        showDeleteModal.value = false
      }
    }

    const getTipoText = (tipo) => {
      const tipoObj = tiposMedidores.find(t => t.value === tipo)
      return tipoObj ? tipoObj.label : tipo
    }

    const getEstadoText = (estado) => {
      const estadoObj = estadosMedidores.find(e => e.value === estado)
      return estadoObj ? estadoObj.label : estado
    }

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'activo':
          return 'active'
        case 'mantenimiento':
          return 'maintenance'
        case 'inactivo':
          return 'inactive'
        default:
          return ''
      }
    }

    const getAlertClass = (estado) => {
      switch (estado) {
        case 'mantenimiento':
          return 'alert-warning'
        case 'inactivo':
          return 'alert-danger'
        default:
          return ''
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      cargarMedidor()
    })

    return {
      medidorId,
      loading,
      error,
      medidor,
      showDeleteModal,
      confirmarEliminar,
      cancelarEliminar,
      eliminarMedidor,
      getTipoText,
      getEstadoText,
      getEstadoClass,
      getAlertClass,
      formatDate
    }
  }
}
</script>

<style scoped>
.device-detail {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(34, 91, 140, 0.10);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1400px;
  min-width: 320px;
  width: 100%;
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
  background: linear-gradient(135deg, rgba(34, 91, 140, 0.8) 0%, rgba(52, 152, 219, 0.6) 100%);
  z-index: 1;
}

.banner-caption {
  position: absolute;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 2rem;
}

.banner-caption h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-caption p {
  font-size: 1.2rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
  color: #23272f;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header h1 i {
  color: #3498db;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.header .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-warning {
  background: #3b82f6;
  color: white;
}

.btn-warning:hover {
  background: #2563eb;
}

.btn-danger {
  background: #3b82f6;
  color: white;
}

.btn-danger:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #3b82f6;
  color: white;
}

.btn-secondary:hover {
  background: #2563eb;
}

.content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.device-info {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.device-title h2 {
  margin: 0;
  color: #23272f;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
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

.status-badge.maintenance {
  background: #fff3cd;
  color: #856404;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.type-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.device-stats {
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #23272f;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.maintenance-alert {
  margin-top: 1rem;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
}

.alert-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-content h4 {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-content p {
  margin: 0;
  font-size: 0.9rem;
}

.detail-sections {
  display: grid;
  gap: 1.5rem;
}

.detail-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.detail-section h3 {
  color: #23272f;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e1e8ed;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-weight: 600;
  color: #23272f;
}

.detail-item .value {
  color: #6c757d;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-indicator.active {
  background: #d4edda;
  color: #155724;
}

.status-indicator.maintenance {
  background: #fff3cd;
  color: #856404;
}

.status-indicator.inactive {
  background: #f8d7da;
  color: #721c24;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.error-message p {
  margin-bottom: 1rem;
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
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
  .device-detail {
    padding: 1rem;
    margin: 1rem;
  }
  
  .banner-caption h2 {
    font-size: 2rem;
  }
  
  .banner-caption p {
    font-size: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .info-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .btn {
    justify-content: center;
  }
}
</style> 