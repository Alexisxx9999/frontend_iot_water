<template>
  <div class="home-edit">
    <!-- Banner de video institucional -->
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay muted loop>
        <source src="/videos/istockphoto-1438537439-640_adpp_is.mp4" type="video/mp4">
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Gestión Inteligente del Agua</h2>
        <p>Edita la información de tu empresa con tecnología IoT</p>
      </div>
    </div>

    <!-- Header -->
    <div class="header">
      <h1><i class="fas fa-edit"></i> Editar Registro</h1>
      <router-link to="/app/home" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver al listado
      </router-link>
    </div>

    <div v-if="loading" class="loading-container">
      <LoadingSpinner message="Cargando información del registro..." />
    </div>

    <div v-else-if="!item" class="error-container">
      <i class="fas fa-exclamation-triangle error-icon"></i>
      <h3>Registro no encontrado</h3>
      <p>El registro que intentas editar no existe o ha sido eliminado.</p>
      <router-link to="/app/home" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver al listado
      </router-link>
    </div>

    <div v-else class="content">
      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="home-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre de la Empresa *</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'building']" class="input-icon" />
                <input
                  id="nombre"
                  v-model="form.nombre"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.nombre }"
                  placeholder="Ingresa el nombre de la empresa"
                  @blur="validateField('nombre')"
                />
              </div>
              <span v-if="errors.nombre" class="error-message">
                {{ errors.nombre }}
              </span>
            </div>

            <div class="form-group">
              <label for="email">Correo Electrónico *</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  :class="{ 'error': errors.email }"
                  placeholder="ejemplo@empresa.com"
                  @blur="validateField('email')"
                />
              </div>
              <span v-if="errors.email" class="error-message">
                {{ errors.email }}
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="celular">Número de Celular *</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'phone']" class="input-icon" />
                <input
                  id="celular"
                  v-model="form.celular"
                  type="tel"
                  class="form-input"
                  :class="{ 'error': errors.celular }"
                  placeholder="0999999999"
                  maxlength="10"
                  @blur="validateField('celular')"
                />
              </div>
              <span v-if="errors.celular" class="error-message">
                {{ errors.celular }}
              </span>
            </div>

            <div class="form-group">
              <label for="estado">Estado *</label>
              <div class="input-icon-group">
                <font-awesome-icon :icon="['fas', 'toggle-on']" class="input-icon" />
                <select
                  id="estado"
                  v-model="form.estado"
                  class="form-input"
                  :class="{ 'error': errors.estado }"
                  @blur="validateField('estado')"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              <span v-if="errors.estado" class="error-message">
                {{ errors.estado }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="mision">Misión *</label>
            <div class="input-icon-group">
              <font-awesome-icon :icon="['fas', 'bullseye']" class="input-icon" />
              <textarea
                id="mision"
                v-model="form.mision"
                class="form-input"
                :class="{ 'error': errors.mision }"
                placeholder="Describe la misión de la empresa"
                rows="4"
                @blur="validateField('mision')"
              ></textarea>
            </div>
            <span v-if="errors.mision" class="error-message">
              {{ errors.mision }}
            </span>
          </div>

          <div class="form-group">
            <label for="vision">Visión *</label>
            <div class="input-icon-group">
              <font-awesome-icon :icon="['fas', 'eye']" class="input-icon" />
              <textarea
                id="vision"
                v-model="form.vision"
                class="form-input"
                :class="{ 'error': errors.vision }"
                placeholder="Describe la visión de la empresa"
                rows="4"
                @blur="validateField('vision')"
              ></textarea>
            </div>
            <span v-if="errors.vision" class="error-message">
              {{ errors.vision }}
            </span>
          </div>

          <div class="form-actions">
            <router-link to="/app/home" class="btn btn-cancel">
              <i class="fas fa-times"></i> Cancelar
            </router-link>
            
            <button 
              type="submit" 
              class="btn btn-submit"
              :disabled="saving || !isFormValid || !hasChanges"
            >
              <i v-if="saving" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHomeStore } from '@/stores/home'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'HomeEditPage',
  components: {
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const homeStore = useHomeStore()
    
    const loading = ref(true)
    const saving = ref(false)
    const item = ref(null)
    const message = ref(null)

    const form = reactive({
      nombre: '',
      email: '',
      celular: '',
      mision: '',
      vision: '',
      estado: ''
    })

    const originalForm = reactive({
      nombre: '',
      email: '',
      celular: '',
      mision: '',
      vision: '',
      estado: ''
    })

    const errors = reactive({
      nombre: '',
      email: '',
      celular: '',
      mision: '',
      vision: '',
      estado: ''
    })

    // Computed properties
    const isFormValid = computed(() => {
      return form.nombre && form.email && form.celular && 
             form.mision && form.vision && form.estado &&
             !Object.values(errors).some(error => error !== '')
    })

    const hasChanges = computed(() => {
      return form.nombre !== originalForm.nombre ||
             form.email !== originalForm.email ||
             form.celular !== originalForm.celular ||
             form.mision !== originalForm.mision ||
             form.vision !== originalForm.vision ||
             form.estado !== originalForm.estado
    })

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
        
        // Llenar el formulario
        Object.keys(form).forEach(key => {
          form[key] = itemData[key] || ''
          originalForm[key] = itemData[key] || ''
        })
        
      } catch (error) {
        console.error('Error cargando item:', error)
        item.value = null
      } finally {
        loading.value = false
      }
    }

    const validateField = (field) => {
      errors[field] = ''
      
      switch (field) {
        case 'nombre':
          if (!form.nombre.trim()) {
            errors.nombre = 'El nombre es obligatorio'
          } else if (/\d/.test(form.nombre)) {
            errors.nombre = 'El nombre no puede contener números'
          } else if (form.nombre.length < 3) {
            errors.nombre = 'El nombre debe tener al menos 3 caracteres'
          }
          break
          
        case 'email':
          if (!form.email.trim()) {
            errors.email = 'El email es obligatorio'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Ingresa un email válido'
          }
          break
          
        case 'celular':
          if (!form.celular.trim()) {
            errors.celular = 'El celular es obligatorio'
          } else if (!/^\d{10}$/.test(form.celular)) {
            errors.celular = 'El celular debe tener exactamente 10 dígitos'
          }
          break
          
        case 'mision':
          if (!form.mision.trim()) {
            errors.mision = 'La misión es obligatoria'
          } else if (/\d/.test(form.mision)) {
            errors.mision = 'La misión no puede contener números'
          } else if (form.mision.length < 10) {
            errors.mision = 'La misión debe tener al menos 10 caracteres'
          }
          break
          
        case 'vision':
          if (!form.vision.trim()) {
            errors.vision = 'La visión es obligatoria'
          } else if (/\d/.test(form.vision)) {
            errors.vision = 'La visión no puede contener números'
          } else if (form.vision.length < 10) {
            errors.vision = 'La visión debe tener al menos 10 caracteres'
          }
          break
          
        case 'estado':
          if (!form.estado) {
            errors.estado = 'El estado es obligatorio'
          }
          break
      }
    }

    const validateForm = () => {
      const fields = ['nombre', 'email', 'celular', 'mision', 'vision', 'estado']
      fields.forEach(field => validateField(field))
      
      return !Object.values(errors).some(error => error !== '')
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

    const handleSubmit = async () => {
      if (!validateForm()) {
        showMessage('Por favor, corrige los errores en el formulario', 'error')
        return
      }

      if (!hasChanges.value) {
        showMessage('No hay cambios para guardar', 'error')
        return
      }

      saving.value = true
      
      try {
        await homeStore.updateItem(item.value.id, form)
        showMessage('Registro actualizado exitosamente', 'success')
        
        // Actualizar el item local
        Object.assign(item.value, form)
        Object.assign(originalForm, form)
        
        // Redirigir al listado después de un breve delay
        setTimeout(() => {
          router.push('/app/home')
        }, 1500)
        
      } catch (error) {
        console.error('Error actualizando registro:', error)
        showMessage('Error al actualizar el registro. Intenta nuevamente.', 'error')
      } finally {
        saving.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      loadItem()
    })

    return {
      loading,
      saving,
      item,
      form,
      errors,
      message,
      isFormValid,
      hasChanges,
      messageIcon,
      validateField,
      handleSubmit,
      formatDate
    }
  }
}
</script>

<style scoped>
.home-edit {
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

.home-form {
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

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
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

@media (max-width: 768px) {
  .home-edit {
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