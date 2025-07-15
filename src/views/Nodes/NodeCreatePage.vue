<template>
  <div class="node-create">
    <div class="header">
      <router-link to="/app/nodes" class="btn-back">
        ← Volver a la lista
      </router-link>
      <h1>Crear Nuevo Nodo</h1>
    </div>

    <div class="form-container">
      <form @submit.prevent="createNode" class="node-form">
        <div class="form-group">
          <label for="codigo">Código del Nodo *</label>
          <input
            id="codigo"
            v-model="form.codigo"
            type="text"
            placeholder="Ej: NODO-001"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="tipo">Tipo de Nodo *</label>
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

        <div class="form-group">
          <label for="fechaInstalacion">Fecha de Instalación *</label>
          <input
            id="fechaInstalacion"
            v-model="form.fechaInstalacion"
            type="date"
            required
            class="form-input"
          />
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

        <div class="form-actions">
          <button type="button" @click="$router.push('/app/nodes')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Creando...</span>
            <span v-else>Crear Nodo</span>
          </button>
        </div>
      </form>
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
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.btn-back {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(74, 144, 226, 0.1);
}

.btn-back:hover {
  background: rgba(74, 144, 226, 0.2);
  transform: translateX(-3px);
  text-decoration: none;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.node-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-weight: 700;
  color: #34495e;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.form-input {
  padding: 15px 20px;
  border: 2px solid #e8f4fd;
  border-radius: 12px;
  font-size: 1.1em;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  transform: translateY(-2px);
}

.form-input::placeholder {
  color: #95a5a6;
  font-style: italic;
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
  gap: 20px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e8f4fd;
}

.btn-cancel, .btn-submit {
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 140px;
}

.btn-cancel {
  background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%);
  color: #7f8c8d;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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