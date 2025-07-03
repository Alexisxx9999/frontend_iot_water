<template>
  <div class="modal-overlay" @click="closeModal" v-if="isVisible">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Eliminar Medidor</h3>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="warning-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        
        <div class="warning-message">
          <h4>¿Está seguro que desea eliminar este medidor?</h4>
          <p>Esta acción no se puede deshacer. El medidor será eliminado permanentemente del mapa y del sistema.</p>
        </div>

        <div class="meter-info">
          <div class="info-item">
            <span class="label">Número de Serie:</span>
            <span class="value">{{ meter?.serialNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">Modelo:</span>
            <span class="value">{{ meter?.model }}</span>
          </div>
          <div class="info-item">
            <span class="label">Ubicación:</span>
            <span class="value">{{ getParishName(meter?.parishId) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Estado:</span>
            <span class="value status-badge" :class="getStatusClass(meter?.status)">
              {{ getStatusLabel(meter?.status) }}
            </span>
          </div>
        </div>

        <div class="confirmation-input">
          <label for="confirmText">Para confirmar, escriba "ELIMINAR" en el campo de abajo:</label>
          <input
            id="confirmText"
            v-model="confirmText"
            type="text"
            placeholder="ELIMINAR"
            :class="{ 'error': showConfirmError }"
          />
          <span class="error-message" v-if="showConfirmError">
            Debe escribir "ELIMINAR" para confirmar la eliminación
          </span>
        </div>

        <div class="consequences">
          <h5>Consecuencias de esta acción:</h5>
          <ul>
            <li>El medidor será eliminado permanentemente</li>
            <li>Se perderán todos los datos históricos asociados</li>
            <li>No se podrá recuperar la información</li>
            <li>Se deberá registrar un nuevo medidor si es necesario</li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">
          Cancelar
        </button>
        <button 
          type="button" 
          class="btn btn-danger" 
          @click="handleDelete"
          :disabled="loading || confirmText !== 'ELIMINAR'"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <i v-else class="fas fa-trash"></i>
          Eliminar Medidor
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useMapStore } from '@/stores/map'

export default {
  name: 'DeleteMeterModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    meter: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'deleted'],
  setup(props, { emit }) {
    const mapStore = useMapStore()
    
    const loading = ref(false)
    const confirmText = ref('')
    const showConfirmError = ref(false)

    // Computed properties
    const parishes = computed(() => mapStore.getParishes)

    // Métodos
    const getParishName = (parishId) => {
      const parish = parishes.value.find(p => p.id === parishId)
      return parish ? parish.name : 'N/A'
    }

    const getStatusLabel = (status) => {
      const statusLabels = {
        active: 'Activo',
        inactive: 'Inactivo',
        maintenance: 'En Mantenimiento',
        fault: 'En Falla',
        disconnected: 'Desconectado'
      }
      return statusLabels[status] || 'Desconocido'
    }

    const getStatusClass = (status) => {
      const statusClasses = {
        active: 'status-active',
        inactive: 'status-inactive',
        maintenance: 'status-maintenance',
        fault: 'status-fault',
        disconnected: 'status-disconnected'
      }
      return statusClasses[status] || 'status-unknown'
    }

    const handleDelete = async () => {
      if (confirmText.value !== 'ELIMINAR') {
        showConfirmError.value = true
        return
      }

      if (!props.meter) {
        console.error('No meter provided for deletion')
        return
      }

      loading.value = true
      showConfirmError.value = false

      try {
        await mapStore.deleteMeterFromMap(props.meter.id)
        emit('deleted', props.meter.id)
        closeModal()
      } catch (error) {
        console.error('Error deleting meter:', error)
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      confirmText.value = ''
      showConfirmError.value = false
      emit('close')
    }

    return {
      loading,
      confirmText,
      showConfirmError,
      parishes,
      getParishName,
      getStatusLabel,
      getStatusClass,
      handleDelete,
      closeModal
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #dc2626;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.warning-icon {
  text-align: center;
  margin-bottom: 20px;
}

.warning-icon i {
  font-size: 3rem;
  color: #f59e0b;
}

.warning-message {
  text-align: center;
  margin-bottom: 24px;
}

.warning-message h4 {
  margin: 0 0 12px 0;
  color: #dc2626;
  font-size: 1.125rem;
}

.warning-message p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.meter-info {
  background: #f9fafb;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 500;
  color: #374151;
}

.info-item .value {
  color: #6b7280;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f3f4f6;
  color: #374151;
}

.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-fault {
  background: #fee2e2;
  color: #991b1b;
}

.status-disconnected {
  background: #fed7aa;
  color: #c2410c;
}

.confirmation-input {
  margin-bottom: 24px;
}

.confirmation-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.confirmation-input input {
  width: 100%;
  padding: 12px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
  font-weight: 600;
  transition: border-color 0.2s;
}

.confirmation-input input:focus {
  outline: none;
  border-color: #dc2626;
}

.confirmation-input input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 8px;
  display: block;
}

.consequences {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
}

.consequences h5 {
  margin: 0 0 12px 0;
  color: #dc2626;
  font-size: 1rem;
}

.consequences ul {
  margin: 0;
  padding-left: 20px;
  color: #6b7280;
}

.consequences li {
  margin-bottom: 6px;
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-danger:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style> 