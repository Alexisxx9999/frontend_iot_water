<template>
  <div class="home-create-page">
    <div class="page-header">
      <div class="header-content">
        <router-link to="/app/home" class="back-link">
          <i class="fas fa-arrow-left"></i> Volver al listado
        </router-link>
        <h1>Crear Nuevo Registro</h1>
        <p>Completa la información para crear un nuevo registro</p>
      </div>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="create-form">
        <div class="form-section">
          <h3>Información Básica</h3>
          
          <div class="form-group">
            <label for="nombre">Nombre de la Empresa *</label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              :class="['form-input', { 'error': errors.nombre }]"
              placeholder="Ingresa el nombre de la empresa"
              @blur="validateField('nombre')"
            />
            <span v-if="errors.nombre" class="error-message">
              {{ errors.nombre }}
            </span>
          </div>

          <div class="form-group">
            <label for="email">Correo Electrónico *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :class="['form-input', { 'error': errors.email }]"
              placeholder="ejemplo@empresa.com"
              @blur="validateField('email')"
            />
            <span v-if="errors.email" class="error-message">
              {{ errors.email }}
            </span>
          </div>

          <div class="form-group">
            <label for="celular">Número de Celular *</label>
            <input
              id="celular"
              v-model="form.celular"
              type="tel"
              :class="['form-input', { 'error': errors.celular }]"
              placeholder="0999999999"
              maxlength="10"
              @blur="validateField('celular')"
            />
            <span v-if="errors.celular" class="error-message">
              {{ errors.celular }}
            </span>
          </div>
        </div>

        <div class="form-section">
          <h3>Misión y Visión</h3>
          
          <div class="form-group">
            <label for="mision">Misión *</label>
            <textarea
              id="mision"
              v-model="form.mision"
              :class="['form-textarea', { 'error': errors.mision }]"
              placeholder="Describe la misión de la empresa"
              rows="4"
              @blur="validateField('mision')"
            ></textarea>
            <span v-if="errors.mision" class="error-message">
              {{ errors.mision }}
            </span>
          </div>

          <div class="form-group">
            <label for="vision">Visión *</label>
            <textarea
              id="vision"
              v-model="form.vision"
              :class="['form-textarea', { 'error': errors.vision }]"
              placeholder="Describe la visión de la empresa"
              rows="4"
              @blur="validateField('vision')"
            ></textarea>
            <span v-if="errors.vision" class="error-message">
              {{ errors.vision }}
            </span>
          </div>
        </div>

        <div class="form-section">
          <h3>Configuración</h3>
          
          <div class="form-group">
            <label for="estado">Estado *</label>
            <select
              id="estado"
              v-model="form.estado"
              :class="['form-select', { 'error': errors.estado }]"
              @blur="validateField('estado')"
            >
              <option value="">Selecciona un estado</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
            <span v-if="errors.estado" class="error-message">
              {{ errors.estado }}
            </span>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/app/home" class="btn btn-secondary">
            <i class="fas fa-times"></i> Cancelar
          </router-link>
          
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading || !isFormValid"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ loading ? 'Creando...' : 'Crear Registro' }}
          </button>
        </div>
      </form>

      <!-- Vista previa en tiempo real -->
      <div class="preview-section">
        <h3>Vista Previa</h3>
        <div class="preview-card">
          <div class="preview-header">
            <h4>{{ form.nombre || 'Nombre de la Empresa' }}</h4>
            <span :class="['status-badge', form.estado]">
              {{ form.estado === 'active' ? 'Activo' : form.estado === 'inactive' ? 'Inactivo' : 'Sin estado' }}
            </span>
          </div>
          
          <div class="preview-content">
            <div class="preview-item">
              <strong>Email:</strong>
              <span>{{ form.email || 'No especificado' }}</span>
            </div>
            
            <div class="preview-item">
              <strong>Celular:</strong>
              <span>{{ form.celular || 'No especificado' }}</span>
            </div>
            
            <div class="preview-item">
              <strong>Misión:</strong>
              <p>{{ form.mision || 'No especificada' }}</p>
            </div>
            
            <div class="preview-item">
              <strong>Visión:</strong>
              <p>{{ form.vision || 'No especificada' }}</p>
            </div>
          </div>
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
.home-create-page {
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

.form-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.create-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e1e8ed;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3498db;
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #e74c3c;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
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
  padding-top: 2rem;
  border-top: 1px solid #e1e8ed;
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

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

/* Vista previa */
.preview-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
}

.preview-section h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.preview-card {
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  background: #f8f9fa;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e8ed;
}

.preview-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
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

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.preview-content {
  padding: 1rem;
}

.preview-item {
  margin-bottom: 1rem;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.preview-item strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.preview-item span,
.preview-item p {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
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
@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
  }
  
  .preview-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .home-create-page {
    padding: 1rem;
  }
  
  .create-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}
</style> 