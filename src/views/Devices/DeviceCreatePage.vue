<template>
  <div class="device-create">
    <!-- Banner de video institucional -->
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay muted loop>
        <source src="/videos/istockphoto-1727476237-640_adpp_is.mp4" type="video/mp4">
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Gestión Inteligente del Agua</h2>
        <p>Registra un nuevo medidor inteligente en tu red IoT</p>
      </div>
    </div>

    <!-- Header -->
    <div class="header">
      <h1><i class="fas fa-plus"></i> Crear Nuevo Dispositivo</h1>
      <router-link to="/app/devices" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver
      </router-link>
    </div>

    <LoadingSpinner v-if="loading" message="Creando dispositivo..." />

    <div v-else class="content">
      <div class="form-container">
        <form @submit.prevent="crearMedidor" class="device-form">
          <div class="form-row">
            <div class="form-group">
              <label for="codigo">Código del Dispositivo *</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'barcode']" class="input-icon" />
                <input 
                  id="codigo" 
                  v-model="formData.codigo" 
                  type="text" 
                  required 
                  placeholder="Ej: MED001" 
                  class="form-input"
                  :class="{ 'error': errors.codigo }"
                >
              </div>
              <span v-if="errors.codigo" class="error-message">{{ errors.codigo }}</span>
            </div>

            <div class="form-group">
              <label for="tipo">Tipo de Dispositivo *</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'cog']" class="input-icon" />
                <select 
                  id="tipo" 
                  v-model="formData.tipo" 
                  required 
                  class="form-input"
                  :class="{ 'error': errors.tipo }"
                >
                  <option value="">Seleccionar tipo</option>
                  <option v-for="tipo in tiposMedidores" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
                </select>
              </div>
              <span v-if="errors.tipo" class="error-message">{{ errors.tipo }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="estado">Estado *</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'toggle-on']" class="input-icon" />
                <select 
                  id="estado" 
                  v-model="formData.estado" 
                  required 
                  class="form-input"
                  :class="{ 'error': errors.estado }"
                >
                  <option value="">Seleccionar estado</option>
                  <option v-for="estado in estadosMedidores" :key="estado.value" :value="estado.value">{{ estado.label }}</option>
                </select>
              </div>
              <span v-if="errors.estado" class="error-message">{{ errors.estado }}</span>
            </div>

            <div class="form-group">
              <label for="consumoActual">Consumo Actual (m³)</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'tint']" class="input-icon" />
                <input 
                  id="consumoActual" 
                  v-model.number="formData.consumoActual" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                  class="form-input"
                  :class="{ 'error': errors.consumoActual }"
                >
              </div>
              <span v-if="errors.consumoActual" class="error-message">{{ errors.consumoActual }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="marca">Marca</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'tag']" class="input-icon" />
                <input 
                  id="marca" 
                  v-model="formData.marca" 
                  type="text" 
                  placeholder="Ej: Siemens, ABB, etc." 
                  class="form-input"
                  :class="{ 'error': errors.marca }"
                >
              </div>
              <span v-if="errors.marca" class="error-message">{{ errors.marca }}</span>
            </div>

            <div class="form-group">
              <label for="modelo">Modelo</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'microchip']" class="input-icon" />
                <input 
                  id="modelo" 
                  v-model="formData.modelo" 
                  type="text" 
                  placeholder="Ej: SITRANS F, AquaMaster, etc." 
                  class="form-input"
                  :class="{ 'error': errors.modelo }"
                >
              </div>
              <span v-if="errors.modelo" class="error-message">{{ errors.modelo }}</span>
            </div>
          </div>

          <!-- Mensaje de mantenimiento -->
          <div v-if="formData.estado === 'mantenimiento' || formData.estado === 'inactivo'" class="form-section">
            <h3><i class="fas fa-exclamation-triangle"></i> Información de Estado</h3>
            <div class="alert" :class="getAlertClass(formData.estado)">
              <div class="alert-content">
                <h4>{{ getEstadoTitle(formData.estado) }}</h4>
                <p>{{ getEstadoDescription(formData.estado) }}</p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="form-actions">
            <button type="button" @click="limpiarFormulario" class="btn btn-cancel">
              <i class="fas fa-times"></i> Cancelar
            </button>
            <button type="submit" class="btn btn-submit" :disabled="loading">
              <i class="fas fa-save"></i> Crear Dispositivo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import medidorService from '@/services/medidorService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'DeviceCreatePage',
  components: {
    LoadingSpinner
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const tiposMedidores = medidorService.getTiposMedidores()
    const estadosMedidores = medidorService.getEstadosMedidores()

    const formData = reactive({
      codigo: '',
      tipo: '',
      estado: '',
      consumoActual: 0,
      marca: '',
      modelo: ''
    })

    const errors = reactive({
      codigo: '',
      tipo: '',
      estado: '',
      consumoActual: '',
      marca: '',
      modelo: ''
    })

    const limpiarFormulario = () => {
      Object.keys(formData).forEach(key => {
        formData[key] = key === 'consumoActual' ? 0 : ''
      })
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
    }

    const validarFormulario = () => {
      let isValid = true
      
      // Validar código
      if (!formData.codigo.trim()) {
        errors.codigo = 'El código es obligatorio'
        isValid = false
      } else if (formData.codigo.length < 3) {
        errors.codigo = 'El código debe tener al menos 3 caracteres'
        isValid = false
      } else {
        errors.codigo = ''
      }

      // Validar tipo
      if (!formData.tipo) {
        errors.tipo = 'El tipo es obligatorio'
        isValid = false
      } else {
        errors.tipo = ''
      }

      // Validar estado
      if (!formData.estado) {
        errors.estado = 'El estado es obligatorio'
        isValid = false
      } else {
        errors.estado = ''
      }

      // Validar consumo actual
      if (formData.consumoActual < 0) {
        errors.consumoActual = 'El consumo no puede ser negativo'
        isValid = false
      } else {
        errors.consumoActual = ''
      }

      return isValid
    }

    const crearMedidor = async () => {
      if (!validarFormulario()) {
        return
      }

      loading.value = true
      try {
        await medidorService.createMedidor(formData)
        router.push('/app/devices')
      } catch (error) {
        console.error('Error al crear medidor:', error)
      } finally {
        loading.value = false
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

    const getEstadoTitle = (estado) => {
      switch (estado) {
        case 'mantenimiento':
          return 'Dispositivo en Mantenimiento'
        case 'inactivo':
          return 'Dispositivo Inactivo'
        default:
          return ''
      }
    }

    const getEstadoDescription = (estado) => {
      switch (estado) {
        case 'mantenimiento':
          return 'Este dispositivo está programado para mantenimiento. Se recomienda revisar su estado antes de activarlo.'
        case 'inactivo':
          return 'Este dispositivo está desactivado. No realizará lecturas hasta que sea activado.'
        default:
          return ''
      }
    }

    return {
      loading,
      formData,
      errors,
      tiposMedidores,
      estadosMedidores,
      limpiarFormulario,
      crearMedidor,
      getAlertClass,
      getEstadoTitle,
      getEstadoDescription
    }
  }
}
</script>

<style scoped>
.device-create {
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

.header .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.header .btn:hover {
  background: #495057;
  transform: translateY(-1px);
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

.device-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #23272f;
  font-size: 0.95rem;
}

.input-icon-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-input::placeholder {
  color: #adb5bd;
}

.form-input.error {
  border-color: #e74c3c;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.form-section h3 {
  color: #23272f;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
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
}

.alert-content p {
  margin: 0;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid #e1e8ed;
  margin-top: 2rem;
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
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #495057;
}

.btn-submit {
  background: #3498db;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #2980b9;
}

@media (max-width: 768px) {
  .device-create {
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
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}
</style> 