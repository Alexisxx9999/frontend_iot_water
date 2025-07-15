<template>
  <div class="sector-edit-page-new">
    <div class="form-card">
      <div class="form-header">
        <h1><i class="fas fa-edit"></i> Editar Sector</h1>
        <p>Modifica la información del sector seleccionado</p>
      </div>
      <form v-if="sector" @submit.prevent="handleSubmit" class="form-body">
        <div class="input-group">
          <label for="nombreSector">Nombre del Sector *</label>
          <input
            id="nombreSector"
            v-model="form.nombreSector"
            type="text"
            :class="{ 'input-error': errors.nombreSector }"
            placeholder="Ej: Centro Histórico"
            @blur="validateField('nombreSector')"
            autocomplete="off"
          />
          <span v-if="errors.nombreSector" class="error-message">{{ errors.nombreSector }}</span>
        </div>
        <div class="input-group">
          <label for="codigoPostalSector">Código Postal *</label>
          <input
            id="codigoPostalSector"
            v-model="form.codigoPostalSector"
            type="text"
            :class="{ 'input-error': errors.codigoPostalSector }"
            placeholder="Ej: 170101"
            @blur="validateField('codigoPostalSector')"
            maxlength="6"
            autocomplete="off"
          />
          <span v-if="errors.codigoPostalSector" class="error-message">{{ errors.codigoPostalSector }}</span>
        </div>
        <div class="input-group">
          <label for="descripcionSector">Descripción *</label>
          <textarea
            id="descripcionSector"
            v-model="form.descripcionSector"
            :class="{ 'input-error': errors.descripcionSector }"
            placeholder="Describe el sector..."
            rows="3"
            @blur="validateField('descripcionSector')"
          ></textarea>
          <span v-if="errors.descripcionSector" class="error-message">{{ errors.descripcionSector }}</span>
        </div>
        <div class="input-group">
          <label for="estado">Estado</label>
          <select id="estado" v-model="form.estado" class="select-modern">
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$router.push('/app/sectors')" :disabled="loading">
            <i class="fas fa-arrow-left"></i> Cancelar
          </button>
          <button type="submit" class="btn-main" :disabled="loading || !isFormValid || !hasChanges">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
      <div v-else class="loading-container">
        <div class="spinner"></div>
        <p>Cargando información del sector...</p>
      </div>
      <div v-if="error" class="error-container">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <h3>Error al cargar el sector</h3>
        <p>{{ error }}</p>
        <button @click="loadSector" class="btn-main"><i class="fas fa-refresh"></i> Intentar de nuevo</button>
      </div>
    </div>
    <!-- Modal de éxito -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-content success-modal" @click.stop>
        <div class="modal-header">
          <i class="fas fa-check-circle success-icon"></i>
          <h3>¡Sector actualizado!</h3>
        </div>
        <div class="modal-body">
          <p>El sector <strong>{{ sector?.nombreSector }}</strong> fue actualizado correctamente.</p>
        </div>
        <div class="modal-footer">
          <button @click="goToList" class="btn-main"><i class="fas fa-list"></i> Ver lista</button>
          <button @click="showSuccessModal = false" class="btn-cancel"><i class="fas fa-edit"></i> Seguir editando</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSectorsStore } from '@/stores/sectors'
import { useToast } from '@/composables/useToast'

export default {
  name: 'SectorEditPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const sectorsStore = useSectorsStore()
    const { showToast } = useToast()

    // Estado reactivo
    const loading = ref(false)
    const error = ref(null)
    const sector = ref(null)
    const showSuccessModal = ref(false)

    // Formulario
    const form = reactive({
      nombreSector: '',
      codigoPostalSector: '',
      descripcionSector: '',
      estado: 'active'
    })

    // Formulario original para comparar cambios
    const originalForm = reactive({
      nombreSector: '',
      codigoPostalSector: '',
      descripcionSector: '',
      estado: 'active'
    })

    // Errores de validación
    const errors = reactive({
      nombreSector: '',
      codigoPostalSector: '',
      descripcionSector: ''
    })

    // Validaciones
    const validations = {
      nombreSector: (value) => {
        if (!value.trim()) return 'El nombre del sector es requerido'
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
        if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres'
        return ''
      },
      codigoPostalSector: (value) => {
        if (!value.trim()) return 'El código postal es requerido'
        if (!/^\d{6}$/.test(value.trim())) return 'El código postal debe tener 6 dígitos'
        return ''
      },
      descripcionSector: (value) => {
        if (!value.trim()) return 'La descripción es requerida'
        if (value.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres'
        if (value.trim().length > 500) return 'La descripción no puede exceder 500 caracteres'
        return ''
      }
    }

    // Validar campo específico
    const validateField = (fieldName) => {
      errors[fieldName] = validations[fieldName](form[fieldName])
    }

    // Validar todo el formulario
    const validateForm = () => {
      let isValid = true
      Object.keys(validations).forEach(field => {
        errors[field] = validations[field](form[field])
        if (errors[field]) isValid = false
      })
      return isValid
    }

    // Computed para validar si el formulario es válido
    const isFormValid = computed(() => {
      return form.nombreSector.trim() && 
             form.codigoPostalSector.trim() && 
             form.descripcionSector.trim() &&
             !errors.nombreSector &&
             !errors.codigoPostalSector &&
             !errors.descripcionSector
    })

    // Computed para verificar si hay cambios
    const hasChanges = computed(() => {
      return form.nombreSector !== originalForm.nombreSector ||
             form.codigoPostalSector !== originalForm.codigoPostalSector ||
             form.descripcionSector !== originalForm.descripcionSector ||
             form.estado !== originalForm.estado
    })

    // Cargar sector
    const loadSector = async () => {
      const sectorId = route.params.id
      if (!sectorId) {
        error.value = 'ID de sector no válido'
        return
      }

      loading.value = true
      error.value = null

      try {
        const sectorData = await sectorsStore.getItem(sectorId)
        sector.value = sectorData

        // Llenar formulario
        form.nombreSector = sectorData.nombreSector
        form.codigoPostalSector = sectorData.codigoPostalSector
        form.descripcionSector = sectorData.descripcionSector
        form.estado = sectorData.estado

        // Guardar valores originales
        originalForm.nombreSector = sectorData.nombreSector
        originalForm.codigoPostalSector = sectorData.codigoPostalSector
        originalForm.descripcionSector = sectorData.descripcionSector
        originalForm.estado = sectorData.estado

      } catch (err) {
        error.value = err.message || 'Error al cargar el sector'
        console.error('Error cargando sector:', err)
      } finally {
        loading.value = false
      }
    }

    // Manejar envío del formulario
    const handleSubmit = async () => {
      if (!validateForm()) {
        showToast('Por favor, corrige los errores en el formulario', 'error')
        return
      }

      if (!hasChanges.value) {
        showToast('No hay cambios para guardar', 'warning')
        return
      }

      loading.value = true

      try {
        const updatedSector = await sectorsStore.updateItem(route.params.id, {
          nombreSector: form.nombreSector.trim(),
          codigoPostalSector: form.codigoPostalSector.trim(),
          descripcionSector: form.descripcionSector.trim(),
          estado: form.estado
        })

        // Actualizar valores originales
        originalForm.nombreSector = updatedSector.nombreSector
        originalForm.codigoPostalSector = updatedSector.codigoPostalSector
        originalForm.descripcionSector = updatedSector.descripcionSector
        originalForm.estado = updatedSector.estado

        showSuccessModal.value = true
        showToast('Sector actualizado exitosamente', 'success')
      } catch (error) {
        showToast(error.message || 'Error al actualizar el sector', 'error')
        console.error('Error actualizando sector:', error)
      } finally {
        loading.value = false
      }
    }

    // Navegar a la lista
    const goToList = () => {
      showSuccessModal.value = false
      router.push('/app/sectors')
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      loadSector()
    })

    return {
      // Estado
      loading,
      error,
      sector,
      showSuccessModal,
      
      // Formulario
      form,
      errors,
      
      // Computed
      isFormValid,
      hasChanges,
      
      // Métodos
      validateField,
      handleSubmit,
      loadSector,
      goToList
    }
  }
}
</script>

<style scoped>
.sector-edit-page-new {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
}
.form-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(52, 152, 219, 0.10), 0 1.5px 4px #b6c6e6;
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 420px;
  width: 100%;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-header {
  text-align: center;
  margin-bottom: 1rem;
}
.form-header h1 {
  font-size: 2rem;
  color: #2563eb;
  font-weight: 800;
  margin-bottom: 0.25rem;
}
.form-header i {
  margin-right: 0.5rem;
}
.form-header p {
  color: #64748b;
  font-size: 1.05rem;
}
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.input-group label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.1rem;
}
.input-group input,
.input-group textarea {
  border: 2px solid #e0e7ef;
  border-radius: 1rem;
  padding: 0.85rem 1.1rem;
  font-size: 1.08rem;
  background: #f8fafc;
  transition: border 0.2s;
}
.input-group input:focus,
.input-group textarea:focus {
  border-color: #2563eb;
  outline: none;
  background: #fff;
}
.input-error {
  border-color: #ef4444 !important;
  background: #fff0f0 !important;
}
.select-modern {
  border: 2px solid #e0e7ef;
  border-radius: 1rem;
  padding: 0.85rem 1.1rem;
  font-size: 1.08rem;
  background: #f8fafc;
  transition: border 0.2s;
}
.select-modern:focus {
  border-color: #2563eb;
  outline: none;
  background: #fff;
}
.error-message {
  color: #ef4444;
  font-size: 0.95rem;
  margin-top: 0.1rem;
  font-weight: 500;
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
.btn-main {
  background: linear-gradient(90deg, #2563eb 60%, #38bdf8 100%);
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.85rem 1.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #2563eb22;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-main:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-main:hover:not(:disabled) {
  background: linear-gradient(90deg, #1d4ed8 60%, #0ea5e9 100%);
  transform: translateY(-2px) scale(1.03);
}
.btn-cancel {
  background: #f1f5f9;
  color: #334155;
  border: none;
  border-radius: 1rem;
  padding: 0.85rem 1.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-cancel:hover {
  background: #e2e8f0;
  color: #2563eb;
  transform: translateY(-2px) scale(1.03);
}
/* Modal de éxito */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 41, 59, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px #2563eb22;
  max-width: 350px;
  width: 100%;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  text-align: center;
}
.success-modal .modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.success-icon {
  color: #22c55e;
  font-size: 2.5rem;
  margin-bottom: 0.2rem;
}
.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.2rem;
}
.loading-container {
  text-align: center;
  padding: 2rem 0;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
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
  color: #ef4444;
  margin-top: 1.5rem;
}
.error-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
@media (max-width: 600px) {
  .form-card {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
  }
}
</style> 