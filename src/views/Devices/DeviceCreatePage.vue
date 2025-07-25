<template>
  <div class="medidor-create">
    <div class="header">
      <h1><i class="fas fa-plus"></i> Crear Nuevo Medidor</h1>
      <router-link to="/app/devices" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver a la Lista
      </router-link>
    </div>
    <LoadingSpinner v-if="loading" message="Creando medidor..." />
    <div v-else class="content">
      <div class="form-container">
        <form @submit.prevent="crearMedidor" class="medidor-form">
          <!-- Información básica -->
          <div class="form-section">
            <h3><i class="fas fa-info-circle"></i> Información Básica</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="codigo">Código del Medidor *</label>
                <input id="codigo" v-model="formData.codigo" type="text" required placeholder="Ej: MED001" :class="{ 'error': errors.codigo }">
                <span v-if="errors.codigo" class="error-message">{{ errors.codigo }}</span>
              </div>
              <div class="form-group">
                <label for="tipo">Tipo de Medidor *</label>
                <select id="tipo" v-model="formData.tipo" required :class="{ 'error': errors.tipo }">
                  <option value="">Seleccionar tipo</option>
                  <option v-for="tipo in tiposMedidores" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
                </select>
                <span v-if="errors.tipo" class="error-message">{{ errors.tipo }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="estado">Estado *</label>
                <select id="estado" v-model="formData.estado" required :class="{ 'error': errors.estado }">
                  <option value="">Seleccionar estado</option>
                  <option v-for="estado in estadosMedidores" :key="estado.value" :value="estado.value">{{ estado.label }}</option>
                </select>
                <span v-if="errors.estado" class="error-message">{{ errors.estado }}</span>
              </div>
              <div class="form-group">
                <label for="consumoActual">Consumo Actual (m³)</label>
                <input id="consumoActual" v-model.number="formData.consumoActual" type="number" step="0.01" min="0" placeholder="0.00" :class="{ 'error': errors.consumoActual }">
                <span v-if="errors.consumoActual" class="error-message">{{ errors.consumoActual }}</span>
              </div>
            </div>
          </div>
          <!-- Información técnica -->
          <div class="form-section">
            <h3><i class="fas fa-cogs"></i> Información Técnica</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="marca">Marca</label>
                <input id="marca" v-model="formData.marca" type="text" placeholder="Ej: Siemens, ABB, etc." :class="{ 'error': errors.marca }">
                <span v-if="errors.marca" class="error-message">{{ errors.marca }}</span>
              </div>
              <div class="form-group">
                <label for="modelo">Modelo</label>
                <input id="modelo" v-model="formData.modelo" type="text" placeholder="Ej: SITRANS F, AquaMaster, etc." :class="{ 'error': errors.modelo }">
                <span v-if="errors.modelo" class="error-message">{{ errors.modelo }}</span>
              </div>
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
            <button type="button" @click="limpiarFormulario" class="btn btn-secondary">
              <i class="fas fa-undo"></i> Limpiar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="fas fa-save"></i> Crear Medidor
            </button>
          </div>
        </form>
      </div>
      <!-- Vista previa -->
      <div class="preview-container">
        <h3><i class="fas fa-eye"></i> Vista Previa</h3>
        <div class="preview-card">
          <div class="preview-header">
            <h4>{{ formData.codigo || 'CÓDIGO' }}</h4>
            <span v-if="formData.estado" :class="['status-badge', getEstadoClass(formData.estado)]">{{ getEstadoText(formData.estado) }}</span>
          </div>
          <div class="preview-info">
            <div class="preview-item"><span class="label">Tipo:</span><span class="value">{{ getTipoText(formData.tipo) || 'No especificado' }}</span></div>
            <div class="preview-item"><span class="label">Consumo:</span><span class="value">{{ formData.consumoActual || 0 }} m³</span></div>
            <div class="preview-item"><span class="label">Marca:</span><span class="value">{{ formData.marca || 'No especificada' }}</span></div>
            <div class="preview-item"><span class="label">Modelo:</span><span class="value">{{ formData.modelo || 'No especificado' }}</span></div>
          </div>
          <div v-if="formData.estado === 'mantenimiento' || formData.estado === 'inactivo'" class="preview-message">
            <i class="fas fa-info-circle"></i>
            {{ getMensajeMantenimiento(formData.estado) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import medidorService from '../../services/medidorService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const loading = ref(false)
const errors = ref({})
const formData = ref({ codigo: '', tipo: '', consumoActual: 0, estado: 'activo', marca: '', modelo: '' })
const tiposMedidores = medidorService.getTiposMedidores()
const estadosMedidores = medidorService.getEstadosMedidores()

const validarFormulario = () => {
  errors.value = {}
  if (!formData.value.codigo.trim()) errors.value.codigo = 'El código es requerido'
  else if (formData.value.codigo.length < 3) errors.value.codigo = 'El código debe tener al menos 3 caracteres'
  if (!formData.value.tipo) errors.value.tipo = 'El tipo es requerido'
  if (!formData.value.estado) errors.value.estado = 'El estado es requerido'
  if (formData.value.consumoActual < 0) errors.value.consumoActual = 'El consumo no puede ser negativo'
  return Object.keys(errors.value).length === 0
}
const crearMedidor = async () => {
  if (!validarFormulario()) return
  try {
    loading.value = true
    const nuevoMedidor = await medidorService.createMedidor(formData.value)
    router.push(`/app/devices/${nuevoMedidor.id}`)
  } catch (err) {
    if (err.response?.data?.errors) errors.value = { ...errors.value, ...err.response.data.errors }
  } finally {
    loading.value = false
  }
}
const limpiarFormulario = () => {
  formData.value = { codigo: '', tipo: '', consumoActual: 0, estado: 'activo', marca: '', modelo: '' }
  errors.value = {}
}
const getTipoText = tipo => tiposMedidores.find(t => t.value === tipo)?.label || tipo
const getEstadoText = estado => estadosMedidores.find(e => e.value === estado)?.label || estado
const getEstadoClass = estado => estado === 'activo' ? 'estado-activo' : estado === 'mantenimiento' ? 'estado-mantenimiento' : estado === 'inactivo' ? 'estado-inactivo' : 'estado-default'
const getEstadoTitle = estado => estado === 'mantenimiento' ? 'Medidor en Mantenimiento' : estado === 'inactivo' ? 'Medidor Inactivo' : ''
const getEstadoDescription = estado => estado === 'mantenimiento' ? 'Este medidor estará en mantenimiento programado. Las lecturas pueden no estar disponibles durante este período.' : estado === 'inactivo' ? 'Este medidor está fuera de servicio y requiere revisión técnica antes de poder registrar lecturas.' : ''
const getMensajeMantenimiento = estado => getEstadoDescription(estado)
</script>

<style scoped>
@use '@/assets/styles/main.scss' as *;

.medidor-create {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: var(--bg-primary);
  font-family: 'Inter', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: var(--primary-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 2rem;
  font-weight: var(--font-weight-bold, 700);
  font-family: 'Inter', sans-serif;
}

.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* Formulario */
.form-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.medidor-form {
  padding: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.error,
.form-group select.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

/* Alertas */
.alert {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-content h4 {
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-content p {
  margin: 0;
  line-height: 1.5;
}

/* Botones de acción */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

/* Vista previa */
.preview-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.preview-container h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.preview-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.estado-activo {
  background-color: #d4edda;
  color: #155724;
}

.estado-mantenimiento {
  background-color: #fff3cd;
  color: #856404;
}

.estado-inactivo {
  background-color: #f8d7da;
  color: #721c24;
}

.preview-info {
  margin-bottom: 15px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px 0;
}

.preview-item .label {
  color: #666;
  font-weight: 500;
}

.preview-item .value {
  color: #2c3e50;
  font-weight: 600;
}

.preview-message {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  color: #856404;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .preview-container {
    position: static;
  }
}
</style> 