<template>
  <div class="home-create">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-922769970-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Crear Nuevo Registro</h2>
        <p>Completa la información para crear un nuevo registro institucional.</p>
      </div>
    </div>
    <div class="header">
      <h1><i class="fas fa-plus"></i> Crear Nuevo Registro</h1>
      <router-link to="/app/home" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver
      </router-link>
    </div>
    <div class="content">
      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="home-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre de la Empresa *</label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'building']" /></span>
                <input
                  id="nombre"
                  v-model="form.nombre"
                  type="text"
                  :class="['form-input', { 'error': errors.nombre }]"
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
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></span>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  :class="['form-input', { 'error': errors.email }]"
                  placeholder="ejemplo@empresa.com"
                  @blur="validateField('email')"
                />
              </div>
              <span v-if="errors.email" class="error-message">
                {{ errors.email }}
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="celular">Número de Celular *</label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'phone']" /></span>
              <input
                id="celular"
                v-model="form.celular"
                type="tel"
                :class="['form-input', { 'error': errors.celular }]"
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
            <label for="mision">Misión *</label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'bullseye']" /></span>
              <textarea
                id="mision"
                v-model="form.mision"
                :class="['form-input', { 'error': errors.mision }]"
                placeholder="Describe la misión de la empresa"
                rows="3"
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
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'eye']" /></span>
              <textarea
                id="vision"
                v-model="form.vision"
                :class="['form-input', { 'error': errors.vision }]"
                placeholder="Describe la visión de la empresa"
                rows="3"
                @blur="validateField('vision')"
              ></textarea>
            </div>
            <span v-if="errors.vision" class="error-message">
              {{ errors.vision }}
            </span>
          </div>
          
          <div class="form-group">
            <label for="estado">Estado *</label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'toggle-on']" /></span>
              <select
                id="estado"
                v-model="form.estado"
                :class="['form-input', { 'error': errors.estado }]"
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

          <div class="form-actions">
            <button type="button" @click="$router.push('/app/home')" class="btn btn-cancel">
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-submit"
              :disabled="loading || !isFormValid"
            >
              <font-awesome-icon :icon="['fas', 'save']" />
              {{ loading ? 'Creando...' : 'Crear Registro' }}
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
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useHomeStore } from '@/stores/home'

export default {
  name: 'HomeCreatePage',
  setup() {
    const router = useRouter()
    const homeStore = useHomeStore()
    
    const loading = ref(false)
    const message = ref(null)

    const form = reactive({
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

    // Validaciones
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

    const isFormValid = computed(() => {
      return form.nombre && form.email && form.celular && 
             form.mision && form.vision && form.estado &&
             !Object.values(errors).some(error => error !== '')
    })

    const messageIcon = computed(() => {
      if (!message.value) return ''
      return message.value.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
    })

    const showMessage = (text, type = 'success') => {
      message.value = { text, type }
      setTimeout(() => {
        message.value = null
      }, 5000)
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        showMessage('Por favor, corrige los errores en el formulario', 'error')
        return
      }

      loading.value = true
      
      try {
        await homeStore.createItem(form)
        showMessage('Registro creado exitosamente', 'success')
        
        // Redirigir al listado después de un breve delay
        setTimeout(() => {
          router.push('/home')
        }, 1500)
        
      } catch (error) {
        console.error('Error creando registro:', error)
        showMessage('Error al crear el registro. Intenta nuevamente.', 'error')
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      form,
      errors,
      message,
      isFormValid,
      messageIcon,
      validateField,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.home-create {
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

.header .btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.header .btn-secondary {
  background: #95a5a6;
  color: white;
}

.header .btn-secondary:hover {
  background: #7f8c8d;
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

.home-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
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

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #66adf4;
  box-shadow: 0 0 0 3px rgba(102, 173, 244, 0.1);
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #dc3545;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  padding-left: 40px;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.9rem;
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

.btn-cancel:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.btn-submit {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #495057;
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