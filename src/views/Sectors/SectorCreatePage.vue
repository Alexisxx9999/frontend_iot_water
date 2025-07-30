<template>
  <div class="sector-create">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-1438537439-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Crear Nuevo Sector</h2>
        <p>Registra un nuevo sector con su información principal</p>
      </div>
    </div>

    <div class="header">
      <h1><font-awesome-icon :icon="['fas', 'map-marker-alt']" /> Crear Nuevo Sector</h1>
      <router-link to="/app/sectors" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver
      </router-link>
    </div>

    <div class="content">
      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="sector-form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="nombreSector" class="form-label">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" /> Nombre del Sector *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'map-marker-alt']" /></span>
                <input
                  id="nombreSector"
                  v-model="form.nombreSector"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.nombreSector }"
                  placeholder="Ej: Centro Histórico"
                  @blur="validateField('nombreSector')"
                  required
                  autocomplete="off"
                />
              </div>
              <small v-if="errors.nombreSector" class="form-error">{{ errors.nombreSector }}</small>
            </div>

            <div class="form-group">
              <label for="codigoPostalSector" class="form-label">
                <font-awesome-icon :icon="['fas', 'barcode']" /> Código Postal *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'barcode']" /></span>
                <input
                  id="codigoPostalSector"
                  v-model="form.codigoPostalSector"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.codigoPostalSector }"
                  placeholder="Ej: 170101"
                  maxlength="6"
                  @blur="validateField('codigoPostalSector')"
                  required
                  autocomplete="off"
                />
              </div>
              <small v-if="errors.codigoPostalSector" class="form-error">{{ errors.codigoPostalSector }}</small>
            </div>
          </div>

          <div class="form-group">
            <label for="descripcionSector" class="form-label">
              <font-awesome-icon :icon="['fas', 'align-left']" /> Descripción *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'comment']" /></span>
              <textarea
                id="descripcionSector"
                v-model="form.descripcionSector"
                class="form-input"
                :class="{ 'input-error': errors.descripcionSector }"
                placeholder="Describe el sector..."
                rows="3"
                @blur="validateField('descripcionSector')"
                required
              ></textarea>
            </div>
            <small v-if="errors.descripcionSector" class="form-error">{{ errors.descripcionSector }}</small>
          </div>

          <div class="form-group">
            <label for="estado" class="form-label">
              <font-awesome-icon :icon="['fas', 'toggle-on']" /> Estado
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'power-off']" /></span>
              <select
                id="estado"
                v-model="form.estado"
                class="form-input"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="goBack"
              class="btn btn-cancel"
              :disabled="loading"
            >
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-submit"
              :disabled="loading || !isFormValid"
            >
              <font-awesome-icon v-if="loading" :icon="['fas', 'spinner']" spin /> 
              <font-awesome-icon v-else :icon="['fas', 'save']" /> 
              {{ loading ? 'Creando...' : 'Crear Sector' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de éxito -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-content success-modal" @click.stop>
        <div class="modal-header">
          <font-awesome-icon class="success-icon" :icon="['fas', 'check-circle']" />
          <h3>¡Sector creado!</h3>
        </div>
        <div class="modal-body">
          <p>El sector <strong>{{ createdSector?.nombreSector }}</strong> fue registrado correctamente.</p>
        </div>
        <div class="modal-footer">
          <button @click="goToList" class="btn btn-submit">
            <font-awesome-icon :icon="['fas', 'list']" /> Ver lista
          </button>
          <button @click="createAnother" class="btn btn-cancel">
            <font-awesome-icon :icon="['fas', 'plus']" /> Nuevo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSectorsStore } from '@/stores/sectors'
import { useToast } from '@/composables/useToast'

export default {
  name: 'SectorCreatePage',
  setup() {
    const router = useRouter()
    const sectorsStore = useSectorsStore()
    const { showToast } = useToast()

    const loading = ref(false)
    const showSuccessModal = ref(false)
    const createdSector = ref(null)

    const form = reactive({
      nombreSector: '',
      codigoPostalSector: '',
      descripcionSector: '',
      estado: 'active'
    })

    const errors = reactive({
      nombreSector: '',
      codigoPostalSector: '',
      descripcionSector: ''
    })

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

    const validateField = (fieldName) => {
      errors[fieldName] = validations[fieldName](form[fieldName])
    }

    const validateForm = () => {
      let isValid = true
      Object.keys(validations).forEach(field => {
        errors[field] = validations[field](form[field])
        if (errors[field]) isValid = false
      })
      return isValid
    }

    const isFormValid = computed(() => {
      return form.nombreSector.trim() &&
             form.codigoPostalSector.trim() &&
             form.descripcionSector.trim() &&
             !errors.nombreSector &&
             !errors.codigoPostalSector &&
             !errors.descripcionSector
    })

    const handleSubmit = async () => {
      if (!validateForm()) {
        showToast('Por favor, corrige los errores en el formulario', 'error')
        return
      }
      loading.value = true
      try {
        const newSector = await sectorsStore.createItem({
          nombreSector: form.nombreSector.trim(),
          codigoPostalSector: form.codigoPostalSector.trim(),
          descripcionSector: form.descripcionSector.trim(),
          estado: form.estado
        })
        createdSector.value = newSector
        showSuccessModal.value = true
        showToast('Sector creado exitosamente', 'success')
      } catch (error) {
        showToast(error.message || 'Error al crear el sector', 'error')
        console.error('Error creando sector:', error)
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.push('/app/sectors')
    }

    const goToList = () => {
      showSuccessModal.value = false
      router.push('/app/sectors')
    }

    const createAnother = () => {
      showSuccessModal.value = false
      Object.keys(form).forEach(key => {
        if (key !== 'estado') form[key] = ''
      })
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
    }

    return {
      form,
      errors,
      loading,
      showSuccessModal,
      createdSector,
      isFormValid,
      validateField,
      handleSubmit,
      goBack,
      goToList,
      createAnother,
    }
  }
}
</script>

<style scoped>
.sector-create {
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

.content {
  display: flex;
  justify-content: center;
}

.form-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.05);
}

.sector-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #225b8c;
  font-size: 1rem;
}

.input-icon-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #66adf4;
  font-size: 16px;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #66adf4;
  box-shadow: 0 0 0 3px rgba(102, 173, 244, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
  padding-left: 40px;
}

.form-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e7ef;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  border: 2px solid #d1d5db;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.btn-submit {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #495057;
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

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
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
