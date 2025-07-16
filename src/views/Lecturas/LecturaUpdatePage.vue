<template>
  <div class="lectura-form-page">
    <div class="lectura-form-card">
      <h1>Actualizar Lectura</h1>
      <form @submit.prevent="actuali" class="lectura-form">
        <div class="form-group">
          <label>Medidor</label>
          <select v-model="form.medidorId" required>
            <option value="">Seleccione un medidor</option>
            <option v-for="m in medidores" :key="m.id" :value="m.id">{{ m.nombre }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tipo de Lectura</label>
          <select v-model="form.tipoLectura" required>
            <option value="">Seleccione tipo</option>
            <option value="consumo">Consumo</option>
            <option value="presion">Presión</option>
            <option value="caudal">Caudal</option>
            <option value="nivel">Nivel</option>
          </select>
        </div>
        <div class="form-group">
          <label>Valor de Lectura</label>
          <input v-model.number="form.valorLectura" type="number" min="0" required />
        </div>
        <div class="form-group">
          <label>Fecha de Lectura</label>
          <input v-model="form.fechaLectura" type="date" required />
        </div>
        <div v-if="error" class="form-error">{{ error }}</div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Actualizar</button>
          <router-link to="/app/lecturas" class="btn btn-secondary">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import lecturaService, { medidores } from '../../services/lectura.service'

const route = useRoute()
const router = useRouter()
const form = ref({
  medidorId: '',
  tipoLectura: '',
  valorLectura: '',
  fechaLectura: ''
})
const error = ref('')

onMounted(async () => {
  const data = await lecturaService.getLecturaById(route.params.id)
  form.value = { ...data }
})

const actualizarLectura = async () => {
  error.value = ''
  try {
    await lecturaService.updateLectura(route.params.id, {
      ...form.value,
      medidorId: Number(form.value.medidorId)
    })
    router.push('/app/lecturas')
  } catch (e) {
    error.value = e.message
  }
}
</script>
<style scoped>
.lectura-form-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}
.lectura-form-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
  padding: 36px 32px;
  max-width: 420px;
  width: 100%;
}
.lectura-form-card h1 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #23272f;
  margin-bottom: 24px;
  text-align: center;
}
.lectura-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-weight: 600;
  color: #0ea5e9;
}
.form-group input {
  padding: 0.5rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.form-group input:focus {
  border-color: #0ea5e9;
}
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 10px;
}
.btn {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
}
.btn-primary {
  background: #0ea5e9;
  color: #fff;
}
.btn-primary:hover {
  background: #0369a1;
}
.btn-secondary {
  background: #e5e7eb;
  color: #23272f;
}
.btn-secondary:hover {
  background: #cbd5e1;
}
.form-error {
  color: #ef4444;
  background: #fee2e2;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
}
@media (max-width: 600px) {
  .lectura-form-card {
    padding: 18px 6px;
  }
}
</style> 