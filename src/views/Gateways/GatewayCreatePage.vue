<template>
  <div class="gateway-create">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-1487086951-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Crear Nuevo Gateway</h2>
        <p>Define un nuevo dispositivo de comunicación para la red IoT.</p>
      </div>
    </div>
    
    <div class="header">
      <h1><font-awesome-icon :icon="['fas', 'network-wired']" /> Crear Nuevo Gateway</h1>
      <router-link to="/app/gateways" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver
      </router-link>
    </div>
    
    <div class="content">
      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="gateway-form">
          <div class="form-row">
            <div class="form-group">
              <label for="code" class="form-label">
                <font-awesome-icon :icon="['fas', 'tag']" /> Código del Gateway *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'network-wired']" /></span>
                <input 
                  id="code" 
                  v-model="form.code" 
                  type="text" 
                  class="form-input" 
                  placeholder="Ej: GW-001, GW-002, GW-003" 
                  required 
                />
              </div>
              <p v-if="errors.code" class="form-error">{{ errors.code }}</p>
            </div>
            
            <div class="form-group">
              <label for="state" class="form-label">
                <font-awesome-icon :icon="['fas', 'toggle-on']" /> Estado *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'power-off']" /></span>
                <select id="state" v-model="form.state" class="form-input" required>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="address" class="form-label">
              <font-awesome-icon :icon="['fas', 'map-marker-alt']" /> Dirección *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></span>
              <input 
                id="address" 
                v-model="form.address" 
                type="text" 
                class="form-input" 
                placeholder="Ej: Av. Principal 123, Quito, Ecuador"
                required
              />
            </div>
            <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="latitude" class="form-label">
                <font-awesome-icon :icon="['fas', 'globe']" /> Latitud *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'map']" /></span>
                <input 
                  id="latitude" 
                  v-model="form.latitude" 
                  type="number" 
                  step="any"
                  class="form-input" 
                  placeholder="Ej: -0.1807"
                  required
                />
              </div>
              <p v-if="errors.latitude" class="form-error">{{ errors.latitude }}</p>
            </div>
            
            <div class="form-group">
              <label for="longitude" class="form-label">
                <font-awesome-icon :icon="['fas', 'globe']" /> Longitud *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'map']" /></span>
                <input 
                  id="longitude" 
                  v-model="form.longitude" 
                  type="number" 
                  step="any"
                  class="form-input" 
                  placeholder="Ej: -78.4678"
                  required
                />
              </div>
              <p v-if="errors.longitude" class="form-error">{{ errors.longitude }}</p>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="altitude" class="form-label">
                <font-awesome-icon :icon="['fas', 'mountain']" /> Altitud (msnm)
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'arrow-up']" /></span>
                <input 
                  id="altitude" 
                  v-model="form.altitude" 
                  type="number" 
                  step="any"
                  class="form-input" 
                  placeholder="Ej: 2850"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="installationDate" class="form-label">
                <font-awesome-icon :icon="['fas', 'calendar']" /> Fecha de Instalación *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'calendar-day']" /></span>
                <input 
                  id="installationDate" 
                  v-model="form.installationDate" 
                  type="date" 
                  class="form-input" 
                  required
                />
              </div>
              <p v-if="errors.installationDate" class="form-error">{{ errors.installationDate }}</p>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">
              <font-awesome-icon :icon="['fas', 'align-left']" /> Descripción
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'comment']" /></span>
              <textarea 
                id="description" 
                v-model="form.description" 
                class="form-input" 
                placeholder="Describe las características y ubicación del gateway"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="goBack" class="btn btn-cancel">
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
            </button>
            <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
              <font-awesome-icon :icon="['fas', 'save']" /> {{ isSubmitting ? 'Creando...' : 'Crear Gateway' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useGatewaysStore } from '@/stores/gateways'

export default {
  name: 'GatewayCreatePage',
  setup() {
    const router = useRouter()
    const { showToast } = useToast()
    const gatewaysStore = useGatewaysStore()
    
    const isSubmitting = ref(false)
    const errors = reactive({})
    
    const form = reactive({
      code: '',
      address: '',
      latitude: '',
      longitude: '',
      altitude: '',
      installationDate: '',
      state: 'activo',
      description: '',
      dataUrl: ''
    })

    const validateForm = () => {
      errors.code = ''
      errors.address = ''
      errors.latitude = ''
      errors.longitude = ''
      errors.installationDate = ''
      
      if (!form.code.trim()) {
        errors.code = 'El código es requerido'
      }
      
      if (!form.address.trim()) {
        errors.address = 'La dirección es requerida'
      }

      if (!form.latitude) {
        errors.latitude = 'La latitud es requerida'
      }

      if (!form.longitude) {
        errors.longitude = 'La longitud es requerida'
      }

      if (!form.installationDate) {
        errors.installationDate = 'La fecha de instalación es requerida'
      }
      
      return !errors.code && !errors.address && !errors.latitude && !errors.longitude && !errors.installationDate
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      isSubmitting.value = true
      
      try {
        const newGateway = { ...form, id: Date.now() }
        await gatewaysStore.createItem(newGateway)
        // Actualizar el array global para el mock
        if (window && window.__GATEWAYS__) {
          window.__GATEWAYS__.push(newGateway)
        } else if (window) {
          window.__GATEWAYS__ = [newGateway]
        }
        window.showSimpleToast('Gateway creado correctamente', 'success')
        router.push('/app/gateways')
      } catch (error) {
        window.showSimpleToast('Error al crear el gateway', 'error')
      } finally {
        isSubmitting.value = false
      }
    }

    const goBack = () => {
      router.push('/app/gateways')
    }

    return {
      form,
      errors,
      isSubmitting,
      handleSubmit,
      goBack
    }
  }
}
</script>

<style scoped>
.gateway-create {
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

.gateway-form {
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
  color: #dc3545;
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

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
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