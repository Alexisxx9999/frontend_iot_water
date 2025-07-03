<template>
  <div class="modal-overlay" @click="closeModal" v-if="isVisible">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'Editar Medidor' : 'Agregar Nuevo Medidor' }}</h3>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-grid">
          <!-- Información Básica -->
          <div class="form-section">
            <h4>Información Básica</h4>
            
            <div class="form-group">
              <label for="serialNumber">Número de Serie *</label>
              <input
                id="serialNumber"
                v-model="form.serialNumber"
                type="text"
                :class="{ 'error': errors.serialNumber }"
                placeholder="Ej: MTR001"
                required
              />
              <span class="error-message" v-if="errors.serialNumber">{{ errors.serialNumber }}</span>
            </div>

            <div class="form-group">
              <label for="model">Modelo *</label>
              <input
                id="model"
                v-model="form.model"
                type="text"
                :class="{ 'error': errors.model }"
                placeholder="Ej: SmartMeter Pro"
                required
              />
              <span class="error-message" v-if="errors.model">{{ errors.model }}</span>
            </div>

            <div class="form-group">
              <label for="manufacturer">Fabricante *</label>
              <input
                id="manufacturer"
                v-model="form.manufacturer"
                type="text"
                :class="{ 'error': errors.manufacturer }"
                placeholder="Ej: WaterTech"
                required
              />
              <span class="error-message" v-if="errors.manufacturer">{{ errors.manufacturer }}</span>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="form-section">
            <h4>Ubicación</h4>
            
            <div class="form-group">
              <label for="parishId">Parroquia *</label>
              <select
                id="parishId"
                v-model="form.parishId"
                :class="{ 'error': errors.parishId }"
                required
              >
                <option value="">Seleccionar parroquia</option>
                <option
                  v-for="parish in parishes"
                  :key="parish.id"
                  :value="parish.id"
                >
                  {{ parish.name }} ({{ parish.type }})
                </option>
              </select>
              <span class="error-message" v-if="errors.parishId">{{ errors.parishId }}</span>
            </div>

            <div class="form-group">
              <label for="address">Dirección</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                placeholder="Dirección específica"
              />
            </div>

            <div class="coordinates-group">
              <div class="form-group">
                <label for="latitude">Latitud *</label>
                <input
                  id="latitude"
                  v-model="form.coordinates[0]"
                  type="number"
                  step="0.000001"
                  :class="{ 'error': errors.coordinates }"
                  placeholder="-0.2299"
                  required
                />
              </div>

              <div class="form-group">
                <label for="longitude">Longitud *</label>
                <input
                  id="longitude"
                  v-model="form.coordinates[1]"
                  type="number"
                  step="0.000001"
                  :class="{ 'error': errors.coordinates }"
                  placeholder="-78.5249"
                  required
                />
              </div>
            </div>
            <span class="error-message" v-if="errors.coordinates">{{ errors.coordinates }}</span>
          </div>

          <!-- Configuración -->
          <div class="form-section">
            <h4>Configuración</h4>
            
            <div class="form-group">
              <label for="reportFrequency">Frecuencia de Reporte (minutos) *</label>
              <input
                id="reportFrequency"
                v-model.number="form.reportFrequency"
                type="number"
                min="1"
                :class="{ 'error': errors.reportFrequency }"
                placeholder="15"
                required
              />
              <span class="error-message" v-if="errors.reportFrequency">{{ errors.reportFrequency }}</span>
            </div>

            <div class="form-group">
              <label for="alertThreshold">Umbral de Alerta (%) *</label>
              <input
                id="alertThreshold"
                v-model.number="form.alertThreshold"
                type="number"
                min="0"
                max="100"
                :class="{ 'error': errors.alertThreshold }"
                placeholder="80"
                required
              />
              <span class="error-message" v-if="errors.alertThreshold">{{ errors.alertThreshold }}</span>
            </div>

            <div class="form-group">
              <label for="status">Estado *</label>
              <select
                id="status"
                v-model="form.status"
                :class="{ 'error': errors.status }"
                required
              >
                <option value="">Seleccionar estado</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">En Mantenimiento</option>
                <option value="fault">En Falla</option>
                <option value="disconnected">Desconectado</option>
              </select>
              <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
            </div>
          </div>

          <!-- Configuración Avanzada -->
          <div class="form-section">
            <h4>Configuración Avanzada</h4>
            
            <div class="form-group">
              <label for="firmwareVersion">Versión de Firmware</label>
              <input
                id="firmwareVersion"
                v-model="form.firmwareVersion"
                type="text"
                placeholder="v1.2.3"
              />
            </div>

            <div class="form-group">
              <label for="customConfig">Configuración Personalizada (JSON)</label>
              <textarea
                id="customConfig"
                v-model="form.customConfig"
                rows="4"
                placeholder='{"param1": "value1", "param2": "value2"}'
                :class="{ 'error': errors.customConfig }"
              ></textarea>
              <span class="error-message" v-if="errors.customConfig">{{ errors.customConfig }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            {{ isEditing ? 'Actualizar' : 'Crear' }} Medidor
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useMapStore } from '@/stores/map'

export default {
  name: 'MapMeterModal',
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
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const mapStore = useMapStore()
    
    const loading = ref(false)
    const errors = reactive({})

    // Declarar clearErrors antes del watcher
    const clearErrors = () => {
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
    }

    // Formulario reactivo
    const form = reactive({
      serialNumber: '',
      model: '',
      manufacturer: '',
      parishId: '',
      address: '',
      coordinates: [-0.2299, -78.5249],
      reportFrequency: 15,
      alertThreshold: 80,
      status: 'active',
      firmwareVersion: '',
      customConfig: ''
    })

    // Computed properties
    const isEditing = computed(() => !!props.meter)
    const parishes = computed(() => mapStore.getParishes)

    // Cargar datos del medidor si se está editando
    watch(() => props.meter, (newMeter) => {
      if (newMeter) {
        Object.assign(form, {
          serialNumber: newMeter.serialNumber || '',
          model: newMeter.model || '',
          manufacturer: newMeter.manufacturer || '',
          parishId: newMeter.parishId || '',
          address: newMeter.address || '',
          coordinates: newMeter.coordinates || [-0.2299, -78.5249],
          reportFrequency: newMeter.reportFrequency || 15,
          alertThreshold: newMeter.alertThreshold || 80,
          status: newMeter.status || 'active',
          firmwareVersion: newMeter.firmwareVersion || '',
          customConfig: newMeter.customConfig || ''
        })
      } else {
        // Resetear formulario
        Object.assign(form, {
          serialNumber: '',
          model: '',
          manufacturer: '',
          parishId: '',
          address: '',
          coordinates: [-0.2299, -78.5249],
          reportFrequency: 15,
          alertThreshold: 80,
          status: 'active',
          firmwareVersion: '',
          customConfig: ''
        })
      }
      clearErrors()
    }, { immediate: true })

    // Validaciones
    const validateForm = () => {
      clearErrors()
      let isValid = true

      // Validar número de serie
      if (!form.serialNumber.trim()) {
        errors.serialNumber = 'El número de serie es obligatorio'
        isValid = false
      } else if (form.serialNumber.length < 3) {
        errors.serialNumber = 'El número de serie debe tener al menos 3 caracteres'
        isValid = false
      }

      // Validar modelo
      if (!form.model.trim()) {
        errors.model = 'El modelo es obligatorio'
        isValid = false
      }

      // Validar fabricante
      if (!form.manufacturer.trim()) {
        errors.manufacturer = 'El fabricante es obligatorio'
        isValid = false
      }

      // Validar parroquia
      if (!form.parishId) {
        errors.parishId = 'Debe seleccionar una parroquia'
        isValid = false
      }

      // Validar coordenadas
      if (!form.coordinates[0] || !form.coordinates[1]) {
        errors.coordinates = 'Las coordenadas son obligatorias'
        isValid = false
      } else {
        const lat = parseFloat(form.coordinates[0])
        const lng = parseFloat(form.coordinates[1])
        
        if (isNaN(lat) || lat < -90 || lat > 90) {
          errors.coordinates = 'La latitud debe estar entre -90 y 90'
          isValid = false
        }
        
        if (isNaN(lng) || lng < -180 || lng > 180) {
          errors.coordinates = 'La longitud debe estar entre -180 y 180'
          isValid = false
        }
      }

      // Validar frecuencia de reporte
      if (!form.reportFrequency || form.reportFrequency < 1) {
        errors.reportFrequency = 'La frecuencia de reporte debe ser mayor a 0'
        isValid = false
      }

      // Validar umbral de alerta
      if (!form.alertThreshold || form.alertThreshold < 0 || form.alertThreshold > 100) {
        errors.alertThreshold = 'El umbral de alerta debe estar entre 0 y 100'
        isValid = false
      }

      // Validar estado
      if (!form.status) {
        errors.status = 'Debe seleccionar un estado'
        isValid = false
      }

      // Validar configuración JSON
      if (form.customConfig.trim()) {
        try {
          JSON.parse(form.customConfig)
        } catch (e) {
          errors.customConfig = 'La configuración debe ser un JSON válido'
          isValid = false
        }
      }

      return isValid
    }

    // Métodos
    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        const meterData = {
          ...form,
          coordinates: [parseFloat(form.coordinates[0]), parseFloat(form.coordinates[1])],
          customConfig: form.customConfig.trim() ? JSON.parse(form.customConfig) : null
        }

        if (isEditing.value) {
          await mapStore.updateMeterInMap(props.meter.id, meterData)
        } else {
          await mapStore.addMeterToMap(meterData)
        }

        emit('saved')
        closeModal()
      } catch (error) {
        console.error('Error saving meter:', error)
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      clearErrors()
      emit('close')
    }

    return {
      form,
      errors,
      loading,
      isEditing,
      parishes,
      handleSubmit,
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
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
  color: #1f2937;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.form-section {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section h4 {
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

.coordinates-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
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
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .coordinates-group {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 