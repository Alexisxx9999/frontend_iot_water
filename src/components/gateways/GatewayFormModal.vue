<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>{{ isEditing ? 'Editar Gateway' : 'Crear Gateway' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Código</label>
          <input v-model="form.code" required maxlength="30" />
        </div>
        <div class="form-group">
          <label>Dirección (no exacta)</label>
          <input v-model="form.address" required maxlength="100" />
        </div>
        <div class="form-group">
          <label>Latitud</label>
          <input v-model.number="form.latitude" type="number" step="any" required min="-90" max="90" />
        </div>
        <div class="form-group">
          <label>Longitud</label>
          <input v-model.number="form.longitude" type="number" step="any" required min="-180" max="180" />
        </div>
        <div class="form-group">
          <label>Altitud</label>
          <input v-model.number="form.altitude" type="number" step="any" required min="-500" max="9000" />
        </div>
        <div class="form-group">
          <label>Fecha de instalación</label>
          <input v-model="form.installationDate" type="date" required />
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select v-model="form.state" required>
            <option value="activo">Activo</option>
            <option value="desactivado">Desactivado</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
const props = defineProps({
  gateway: Object,
  isEditing: Boolean
})
const emit = defineEmits(['close', 'saved'])
const form = ref({
  code: '',
  address: '',
  latitude: '',
  longitude: '',
  altitude: '',
  installationDate: '',
  state: 'activo'
})
watch(() => props.gateway, (gw) => {
  if (gw) form.value = { ...gw }
  else form.value = { code: '', address: '', latitude: '', longitude: '', altitude: '', installationDate: '', state: 'activo' }
}, { immediate: true })
const handleSubmit = () => {
  // Validaciones extra si hace falta
  if (!form.value.code || !form.value.address) return
  emit('saved', { ...form.value })
  emit('close')
}
</script>
<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0008; display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 8px; padding: 2rem; min-width: 350px; max-width: 95vw; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
input, select { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd; }
.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
</style> 