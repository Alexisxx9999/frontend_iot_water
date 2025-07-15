<template>
  <div class="medidor-detail">
    <div class="header">
      <h1><i class="fas fa-tint"></i> Detalle del Medidor</h1>
      <div class="header-actions">
        <router-link :to="`/app/devices/${medidorId}/edit`" class="btn btn-warning">
          <i class="fas fa-edit"></i> Editar
        </router-link>
        <button @click="confirmarEliminar" class="btn btn-danger">
          <i class="fas fa-trash"></i> Eliminar
        </button>
        <router-link to="/app/devices" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Volver a la Lista
        </router-link>
      </div>
    </div>
    <LoadingSpinner v-if="loading" message="Cargando medidor..." />
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <router-link to="/app/devices" class="btn btn-primary">
        <i class="fas fa-arrow-left"></i> Volver a la Lista
      </router-link>
    </div>
    <div v-else class="content">
      <div style="background: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
        <strong>Debug:</strong> 
        Loading: {{ loading }}, 
        Error: {{ error }}, 
        Medidor: {{ medidor ? 'Cargado' : 'No cargado' }},
        ID: {{ medidorId }}
      </div>
      <div class="main-info">
        <div class="medidor-card">
          <div class="medidor-header">
            <div class="medidor-title">
              <h2>{{ medidor?.codigo || 'Cargando...' }}</h2>
              <span v-if="medidor?.estado" :class="['status-badge', getEstadoClass(medidor.estado)]">
                {{ getEstadoText(medidor.estado) }}
              </span>
            </div>
            <div class="medidor-type">
              <span v-if="medidor?.tipo" class="type-badge">{{ getTipoText(medidor.tipo) }}</span>
            </div>
          </div>
          <div class="medidor-stats">
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
                <h4><i class="fas fa-exclamation-triangle"></i> Estado del Medidor</h4>
                <p>{{ medidor.mensajeMantenimiento }}</p>
              </div>
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
              <span class="value highlight">{{ medidor?.consumoActual?.toFixed(2) || '0.00' }} m³</span>
            </div>
            <div class="detail-item">
              <span class="label">Estado de Lectura:</span>
              <span class="value">
                <span v-if="medidor?.estado" :class="['reading-status', getReadingStatusClass(medidor.estado)]">
                  {{ getReadingStatusText(medidor.estado) }}
                </span>
                <span v-else>No disponible</span>
              </span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h3><i class="fas fa-history"></i> Información de Auditoría</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Fecha de Creación:</span>
              <span class="value">{{ formatDate(medidor?.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Última Actualización:</span>
              <span class="value">{{ formatDate(medidor?.updatedAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">ID del Medidor:</span>
              <span class="value">{{ medidor?.id || 'No disponible' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="quick-actions">
        <h3><i class="fas fa-bolt"></i> Acciones Rápidas</h3>
        <div class="actions-grid">
          <router-link :to="`/app/devices/${medidorId}/edit`" class="action-card">
            <div class="action-icon">
              <i class="fas fa-edit"></i>
            </div>
            <div class="action-content">
              <h4>Editar Medidor</h4>
              <p>Modificar información del medidor</p>
            </div>
          </router-link>
          <button @click="confirmarEliminar" class="action-card danger">
            <div class="action-icon">
              <i class="fas fa-trash"></i>
            </div>
            <div class="action-content">
              <h4>Eliminar Medidor</h4>
              <p>Eliminar este medidor del sistema</p>
            </div>
          </button>
          <router-link to="/app/devices" class="action-card">
            <div class="action-icon">
              <i class="fas fa-list"></i>
            </div>
            <div class="action-content">
              <h4>Ver Todos</h4>
              <p>Ir a la lista de medidores</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelarEliminar">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres eliminar el medidor <strong>{{ medidor?.codigo }}</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer y eliminará permanentemente todos los datos asociados.</p>
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
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import medidorService from '../../services/medidorService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
const route = useRoute()
const router = useRouter()
const medidorId = route.params.id
const medidor = ref({})
const loading = ref(false)
const error = ref(null)
onMounted(async () => { await loadMedidor() })
const loadMedidor = async () => {
  try {
    loading.value = true
    error.value = null
    const medidorData = await medidorService.getMedidorById(medidorId)
    medidor.value = medidorData
  } catch (err) {
    error.value = 'Error al cargar el medidor: ' + err.message
  } finally {
    loading.value = false
  }
}
const getTipoText = tipo => medidorService.getTiposMedidores().find(t => t.value === tipo)?.label || tipo
const getEstadoText = estado => medidorService.getEstadosMedidores().find(e => e.value === estado)?.label || estado
const getEstadoClass = estado => estado === 'activo' ? 'estado-activo' : estado === 'mantenimiento' ? 'estado-mantenimiento' : estado === 'inactivo' ? 'estado-inactivo' : 'estado-default'
const getReadingStatusText = estado => estado === 'activo' ? 'Leyendo normalmente' : estado === 'mantenimiento' ? 'Lecturas suspendidas' : estado === 'inactivo' ? 'Sin lecturas' : 'Estado desconocido'
const getReadingStatusClass = estado => estado === 'activo' ? 'reading-active' : estado === 'mantenimiento' ? 'reading-maintenance' : estado === 'inactivo' ? 'reading-inactive' : 'reading-unknown'
const getAlertClass = estado => estado === 'mantenimiento' ? 'alert-warning' : estado === 'inactivo' ? 'alert-danger' : ''
const formatDate = date => !date ? 'No disponible' : new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
</script>
<style scoped>
.medidor-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.content {
  display: block;
}

.main-info {
  margin-bottom: 30px;
}

.medidor-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 30px;
  margin-bottom: 30px;
}

.medidor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.medidor-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.medidor-title h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
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

.type-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.medidor-stats {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.maintenance-alert {
  margin-top: 20px;
}

.alert {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-content h4 {
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-content p {
  margin: 0;
  line-height: 1.5;
}

.detail-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.detail-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 25px;
}

.detail-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px 0;
}

.detail-item .label {
  color: #666;
  font-weight: 500;
}

.detail-item .value {
  color: #2c3e50;
  font-weight: 600;
}

.detail-item .highlight {
  color: #1976d2;
  font-weight: bold;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.reading-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.reading-active {
  background-color: #d4edda;
  color: #155724;
}

.reading-maintenance {
  background-color: #fff3cd;
  color: #856404;
}

.reading-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.reading-unknown {
  background-color: #e9ecef;
  color: #6c757d;
}

/* Acciones rápidas */
.quick-actions {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 25px;
}

.quick-actions h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  background: white;
  cursor: pointer;
}

.action-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.action-card.danger {
  border-color: #dc3545;
}

.action-card.danger:hover {
  border-color: #c82333;
  background-color: #f8d7da;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.action-card.danger .action-icon {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

.action-content h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 16px;
}

.action-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Modal */
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

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .medidor-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .detail-sections {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
}
</style> 