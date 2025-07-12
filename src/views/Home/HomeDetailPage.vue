<template>
  <div class="home-detail-page">
    <div class="page-header">
      <div class="header-content">
        <router-link to="/app/home" class="back-link">
          <i class="fas fa-arrow-left"></i> Volver al listado
        </router-link>
        <h1>Detalles del Registro</h1>
        <p>Información completa del registro seleccionado</p>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando información del registro...</p>
    </div>

    <div v-else-if="!item" class="error-container">
      <i class="fas fa-exclamation-triangle error-icon"></i>
      <h3>Registro no encontrado</h3>
      <p>El registro que intentas ver no existe o ha sido eliminado.</p>
      <router-link to="/app/home" class="btn btn-primary">
        <i class="fas fa-arrow-left"></i> Volver al listado
      </router-link>
    </div>

    <div v-else class="detail-container">
      <!-- Información principal -->
      <div class="main-info-card">
        <div class="card-header">
          <div class="header-content">
            <h2>{{ item.nombre }}</h2>
            <span :class="['status-badge', item.estado]">
              {{ item.estado === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <div class="header-actions">
            <router-link 
              :to="`/app/home/edit/${item.id}`" 
              class="btn btn-primary"
            >
              <i class="fas fa-edit"></i> Editar
            </router-link>
            <button 
              @click="showDeleteModal = true" 
              class="btn btn-danger"
            >
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="info-grid">
            <div class="info-section">
              <h3>Información de Contacto</h3>
              <div class="info-item">
                <i class="fas fa-envelope"></i>
                <div class="info-content">
                  <label>Correo Electrónico</label>
                  <span>{{ item.email }}</span>
                </div>
              </div>
              <div class="info-item">
                <i class="fas fa-phone"></i>
                <div class="info-content">
                  <label>Número de Celular</label>
                  <span>{{ item.celular }}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Misión y Visión</h3>
              <div class="info-item">
                <i class="fas fa-bullseye"></i>
                <div class="info-content">
                  <label>Misión</label>
                  <p>{{ item.mision }}</p>
                </div>
              </div>
              <div class="info-item">
                <i class="fas fa-eye"></i>
                <div class="info-content">
                  <label>Visión</label>
                  <p>{{ item.vision }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del sistema -->
      <div class="system-info-card">
        <h3>Información del Sistema</h3>
        <div class="system-grid">
          <div class="system-item">
            <label>ID del Registro</label>
            <span class="system-value">{{ item.id }}</span>
          </div>
          <div class="system-item">
            <label>Fecha de Creación</label>
            <span class="system-value">{{ formatDate(item.createdAt) }}</span>
          </div>
          <div class="system-item">
            <label>Última Actualización</label>
            <span class="system-value">{{ formatDate(item.updatedAt) }}</span>
          </div>
          <div class="system-item">
            <label>Estado Actual</label>
            <span :class="['system-value', 'status-text', item.estado]">
              {{ item.estado === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="quick-actions-card">
        <h3>Acciones Rápidas</h3>
        <div class="actions-grid">
          <router-link 
            :to="`/app/home/edit/${item.id}`" 
            class="action-item"
          >
            <i class="fas fa-edit"></i>
            <span>Editar Registro</span>
          </router-link>
          
          <button 
            @click="duplicateItem" 
            class="action-item"
            :disabled="duplicating"
          >
            <i v-if="duplicating" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-copy"></i>
            <span>{{ duplicating ? 'Duplicando...' : 'Duplicar Registro' }}</span>
          </button>
          
          <button 
            @click="toggleStatus" 
            class="action-item"
            :disabled="updatingStatus"
          >
            <i v-if="updatingStatus" class="fas fa-spinner fa-spin"></i>
            <i v-else :class="item.estado === 'active' ? 'fas fa-pause' : 'fas fa-play'"></i>
            <span>{{ updatingStatus ? 'Actualizando...' : (item.estado === 'active' ? 'Desactivar' : 'Activar') }}</span>
          </button>
          
          <router-link to="/app/home" class="action-item">
            <i class="fas fa-list"></i>
            <span>Ver Todos los Registros</span>
          </router-link>
        </div>
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
          <p>¿Estás seguro de que deseas eliminar el registro <strong>"{{ item.nombre }}"</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="confirmDelete" class="btn btn-danger">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Mensajes de éxito/error -->
    <div v-if="message" :class="['message', message.type]">
      <i :class="messageIcon"></i>
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHomeStore } from '@/stores/home'

export default {
  name: 'HomeDetailPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const homeStore = useHomeStore()
    
    const loading = ref(true)
    const item = ref(null)
    const message = ref(null)
    const showDeleteModal = ref(false)
    const duplicating = ref(false)
    const updatingStatus = ref(false)

    // Computed properties
    const messageIcon = computed(() => {
      if (!message.value) return ''
      return message.value.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
    })

    // Métodos
    const loadItem = async () => {
      const id = parseInt(route.params.id)
      if (!id) {
        router.push('/app/home')
        return
      }

      try {
        const itemData = await homeStore.getItem(id)
        if (!itemData) {
          item.value = null
          return
        }

        item.value = itemData
        
      } catch (error) {
        console.error('Error cargando item:', error)
        item.value = null
      } finally {
        loading.value = false
      }
    }

    const showMessage = (text, type = 'success') => {
      message.value = { text, type }
      setTimeout(() => {
        message.value = null
      }, 5000)
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

    const confirmDelete = async () => {
      if (!item.value) return
      
      try {
        await homeStore.deleteItem(item.value.id)
        showMessage('Registro eliminado exitosamente', 'success')
        showDeleteModal.value = false
        
        // Redirigir al listado después de un breve delay
        setTimeout(() => {
          router.push('/app/home')
        }, 1500)
        
      } catch (error) {
        console.error('Error eliminando item:', error)
        showMessage('Error al eliminar el registro', 'error')
      }
    }

    const duplicateItem = async () => {
      if (!item.value) return
      
      duplicating.value = true
      
      try {
        const duplicatedItem = {
          ...item.value,
          id: undefined,
          nombre: `${item.value.nombre} (Copia)`,
          createdAt: undefined,
          updatedAt: undefined
        }
        
        await homeStore.createItem(duplicatedItem)
        showMessage('Registro duplicado exitosamente', 'success')
        
        // Redirigir al listado después de un breve delay
        setTimeout(() => {
          router.push('/app/home')
        }, 1500)
        
      } catch (error) {
        console.error('Error duplicando item:', error)
        showMessage('Error al duplicar el registro', 'error')
      } finally {
        duplicating.value = false
      }
    }

    const toggleStatus = async () => {
      if (!item.value) return
      
      updatingStatus.value = true
      
      try {
        const newStatus = item.value.estado === 'active' ? 'inactive' : 'active'
        await homeStore.updateItem(item.value.id, { estado: newStatus })
        
        item.value.estado = newStatus
        showMessage(`Registro ${newStatus === 'active' ? 'activado' : 'desactivado'} exitosamente`, 'success')
        
      } catch (error) {
        console.error('Error actualizando estado:', error)
        showMessage('Error al actualizar el estado', 'error')
      } finally {
        updatingStatus.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      loadItem()
    })

    return {
      loading,
      item,
      message,
      showDeleteModal,
      duplicating,
      updatingStatus,
      messageIcon,
      showMessage,
      formatDate,
      confirmDelete,
      duplicateItem,
      toggleStatus
    }
  }
}
</script>

<style scoped>
.home-detail-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #2980b9;
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

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
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

.error-container {
  text-align: center;
  padding: 4rem 2rem;
}

.error-icon {
  font-size: 4rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.error-container h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.error-container p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.main-info-card,
.system-info-card,
.quick-actions-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e1e8ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
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

.header-actions {
  display: flex;
  gap: 1rem;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
}

.card-body {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.info-section h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e1e8ed;
}

.info-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item i {
  color: #3498db;
  font-size: 1.2rem;
  margin-top: 0.25rem;
  width: 20px;
  text-align: center;
}

.info-content label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.info-content span,
.info-content p {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

/* Información del sistema */
.system-info-card {
  padding: 1.5rem;
}

.system-info-card h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e1e8ed;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.system-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.system-item label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.system-value {
  color: #7f8c8d;
  font-size: 1rem;
}

.status-text.active {
  color: #27ae60;
  font-weight: 500;
}

.status-text.inactive {
  color: #e74c3c;
  font-weight: 500;
}

/* Acciones rápidas */
.quick-actions-card {
  padding: 1.5rem;
}

.quick-actions-card h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e1e8ed;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.action-item:hover {
  border-color: #3498db;
  background: #f8f9fa;
  transform: translateY(-2px);
}

.action-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.action-item i {
  font-size: 1.5rem;
  color: #3498db;
}

.action-item span {
  font-weight: 500;
  color: #2c3e50;
  text-align: center;
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
  color: #e74c3c;
  font-weight: 500;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e1e8ed;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

/* Mensajes */
.message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #27ae60;
}

.message.error {
  background: #e74c3c;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .home-detail-page {
    padding: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .system-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style> 