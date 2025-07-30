<template>
  <div class="lectura-edit">
    <div class="institutional-video-banner">
      <video
        class="banner-video"
        autoplay
        loop
        muted
        playsinline
        poster="/src/assets/images/logo.png"
      >
        <source src="/videos/istockphoto-1438537439-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Actualizar Lectura</h2>
        <p>Modifica los datos de la lectura seleccionada.</p>
      </div>
    </div>

    <div class="header">
      <h1><font-awesome-icon :icon="['fas', 'edit']" /> Actualizar Lectura</h1>
      <router-link to="/app/lecturas" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver
      </router-link>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="content">
      <div class="form-container">
        <form @submit.prevent="actualizarLectura" class="lectura-form">
          <div class="form-row">
            <div class="form-group">
              <label for="medidorId" class="form-label">
                <font-awesome-icon :icon="['fas', 'tachometer-alt']" /> Medidor *
              </label>
              <select id="medidorId" v-model="form.medidorId" class="form-input" required>
                <option value="">Seleccione un medidor</option>
                <option v-for="m in medidores" :key="m.id" :value="m.id">{{ m.nombre }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="tipoLectura" class="form-label">
                <font-awesome-icon :icon="['fas', 'list']" /> Tipo de Lectura *
              </label>
              <select id="tipoLectura" v-model="form.tipoLectura" class="form-input" required>
                <option value="">Seleccione tipo</option>
                <option value="consumo">Consumo</option>
                <option value="presion">Presión</option>
                <option value="caudal">Caudal</option>
                <option value="nivel">Nivel</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="valorLectura" class="form-label">
                <font-awesome-icon :icon="['fas', 'calculator']" /> Valor de Lectura *
              </label>
              <input
                id="valorLectura"
                v-model.number="form.valorLectura"
                type="number"
                min="0"
                class="form-input"
                placeholder="Ingrese valor"
                required
              />
            </div>

            <div class="form-group">
              <label for="fechaLectura" class="form-label">
                <font-awesome-icon :icon="['fas', 'calendar-alt']" /> Fecha de Lectura *
              </label>
              <input
                id="fechaLectura"
                v-model="form.fechaLectura"
                type="date"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-submit">
              <font-awesome-icon :icon="['fas', 'save']" /> Actualizar
            </button>
            <router-link to="/app/lecturas" class="btn btn-cancel">
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
            </router-link>
          </div>
        </form>
      </div>
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
  try {
    const data = await lecturaService.getLecturaById(route.params.id)
    form.value = { ...data }
  } catch (e) {
    error.value = 'Error al cargar la lectura: ' + e.message
  }
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
.lectura-edit {
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

.lectura-form {
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

.form-input {
  width: 100%;
  padding: 12px 12px;
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

.error-message {
  text-align: center;
  padding: 1rem 2rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 8px;
  margin-bottom: 1rem;
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
  background: linear-gradient(90deg, rgba(20, 40, 60, 0.55) 60%, rgba(0, 0, 0, 0.35) 100%);
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
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.banner-caption p {
  font-size: 1.15rem;
  color: #e0e6f0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
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
