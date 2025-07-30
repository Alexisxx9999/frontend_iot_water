<template>
  <div class="node-create">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-588380228-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Crear Nuevo Nodo</h2>
        <p>Registra un nuevo nodo inteligente en tu red IoT.</p>
      </div>
    </div>
    <div class="header">
      <h1><i class="fas fa-plus"></i> Crear Nuevo Nodo</h1>
      <router-link to="/app/nodes" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver
      </router-link>
    </div>
    <div class="content">
      <div class="form-container">
        <form @submit.prevent="createNode" class="node-form">
          <div class="form-row">
            <div class="form-group">
              <label for="codigo">Código del Nodo *</label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'tag']" /></span>
                <input
                  id="codigo"
                  v-model="form.codigo"
                  type="text"
                  placeholder="Ej: NODO-001"
                  required
                  class="form-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="tipo">Tipo de Nodo *</label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'network-wired']" /></span>
                <select
                  id="tipo"
                  v-model="form.tipo"
                  required
                  class="form-input"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Sensor de Temperatura">Sensor de Temperatura</option>
                  <option value="Sensor de Humedad">Sensor de Humedad</option>
                  <option value="Sensor de Presión">Sensor de Presión</option>
                  <option value="Actuador de Riego">Actuador de Riego</option>
                  <option value="Sensor de Calidad del Agua">Sensor de Calidad del Agua</option>
                  <option value="Controlador de Bomba">Controlador de Bomba</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="fechaInstalacion">Fecha de Instalación *</label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'calendar']" /></span>
                <input
                  id="fechaInstalacion"
                  v-model="form.fechaInstalacion"
                  type="date"
                  required
                  class="form-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="bateria">Nivel de Batería (%) *</label>
              <div class="battery-input-container">
                <input
                  id="bateria"
                  v-model.number="form.bateria"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="battery-slider"
                />
                <span class="battery-value">{{ form.bateria }}%</span>
              </div>
              <div class="battery-visual">
                <div class="battery-bar">
                  <div 
                    class="battery-fill" 
                    :style="{ width: form.bateria + '%' }"
                    :class="getBatteryClass(form.bateria)"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="$router.push('/app/nodes')" class="btn btn-cancel">
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
            </button>
            <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
              <font-awesome-icon :icon="['fas', 'save']" />
              <span v-if="isSubmitting">Creando...</span>
              <span v-else>Crear Nodo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { nodeService } from '../../services/node.service.js'

const router = useRouter()
const isSubmitting = ref(false)

const form = ref({
  codigo: '',
  tipo: '',
  fechaInstalacion: new Date().toISOString().split('T')[0],
  bateria: 100,
  activo: true
})

const getBatteryClass = (level) => {
  if (level <= 20) return 'battery-low'
  if (level <= 50) return 'battery-medium'
  return 'battery-high'
}

const createNode = async () => {
  isSubmitting.value = true
  
  try {
    // Si no se proporciona código, generar uno automáticamente
    if (!form.value.codigo.trim()) {
      form.value.codigo = nodeService.generateNodeCode()
    }
    
    const newNode = await nodeService.createNode(form.value)
    console.log('Nodo creado:', newNode)
    
    alert('Nodo creado exitosamente')
    router.push('/app/nodes')
  } catch (error) {
    console.error('Error al crear nodo:', error)
    alert('Error al crear el nodo. Inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Generar código automático al cargar el formulario
  form.value.codigo = nodeService.generateNodeCode()
})
</script>

<style scoped>
.node-create {
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

.node-form {
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

.battery-input-container {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(248, 249, 250, 0.8);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.battery-slider {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e9ecef 0%, #dee2e6 100%);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.battery-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
}

.battery-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.6);
}

.battery-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.battery-value {
  font-weight: 700;
  color: #2c3e50;
  min-width: 60px;
  text-align: center;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.battery-visual {
  margin-top: 15px;
}

.battery-bar {
  height: 25px;
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid #dee2e6;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.battery-fill {
  height: 100%;
  transition: all 0.5s ease;
  border-radius: 12px;
}

.battery-high {
  background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
  box-shadow: 0 0 10px rgba(39, 174, 96, 0.3);
}

.battery-medium {
  background: linear-gradient(90deg, #f39c12 0%, #f1c40f 100%);
  box-shadow: 0 0 10px rgba(243, 156, 18, 0.3);
}

.battery-low {
  background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
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

@media (max-width: 768px) {
  .node-create {
    padding: 20px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    text-align: center;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
  
  .form-container {
    padding: 25px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    flex: none;
  }

  .input-icon-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .input-icon {
    font-size: 1em;
  }

  .form-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .battery-input-container {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .battery-value {
    text-align: center;
  }
}
</style> 