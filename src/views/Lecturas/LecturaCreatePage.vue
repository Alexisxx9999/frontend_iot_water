<template>
  <div class="lectura-create">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-1438537439-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Crear Nueva Lectura</h2>
        <p>Registra una nueva lectura de medidor con sus detalles correspondientes.</p>
      </div>
    </div>

    <div class="header">
      <h1><font-awesome-icon :icon="['fas', 'plus-circle']" /> Crear Nueva Lectura</h1>
      <router-link to="/app/lecturas" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver
      </router-link>
    </div>

    <div class="content">
      <div class="form-container">
        <form @submit.prevent="crearLectura" class="lectura-form">
          <div class="form-group">
            <label for="medidor" class="form-label">
              <font-awesome-icon :icon="['fas', 'tachometer-alt']" /> Medidor *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'tachometer-alt']" /></span>
              <select id="medidor" v-model="form.medidorId" class="form-input" required>
                <option value="" disabled>Seleccione un medidor</option>
                <option v-for="m in medidores" :key="m.id" :value="m.id">{{ m.nombre }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="tipoLectura" class="form-label">
              <font-awesome-icon :icon="['fas', 'list-alt']" /> Tipo de Lectura *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'list-alt']" /></span>
              <select id="tipoLectura" v-model="form.tipoLectura" class="form-input" required>
                <option value="" disabled>Seleccione tipo</option>
                <option value="consumo">Consumo</option>
                <option value="presion">Presión</option>
                <option value="caudal">Caudal</option>
                <option value="nivel">Nivel</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="valorLectura" class="form-label">
              <font-awesome-icon :icon="['fas', 'hashtag']" /> Valor de Lectura *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'hashtag']" /></span>
              <input
                id="valorLectura"
                v-model.number="form.valorLectura"
                type="number"
                min="0"
                class="form-input"
                placeholder="Ingrese el valor"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="fechaLectura" class="form-label">
              <font-awesome-icon :icon="['fas', 'calendar-alt']" /> Fecha de Lectura *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'calendar-alt']" /></span>
              <input
                id="fechaLectura"
                v-model="form.fechaLectura"
                type="date"
                class="form-input"
                required
              />
            </div>
          </div>

          <div v-if="error" class="form-error">{{ error }}</div>

          <div class="form-actions">
            <button type="button" @click="goBack" class="btn btn-cancel">
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
            </button>
            <button type="submit" class="btn btn-submit">
              <font-awesome-icon :icon="['fas', 'save']" /> Crear Lectura
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import lecturaService, { medidores } from '../../services/lectura.service'

const router = useRouter()
const form = ref({
  medidorId: '',
  tipoLectura: '',
  valorLectura: null,
  fechaLectura: ''
})
const error = ref('')

const crearLectura = async () => {
  error.value = ''
  try {
    await lecturaService.createLectura({
      ...form.value,
      medidorId: Number(form.value.medidorId)
    })
    router.push('/app/lecturas')
  } catch (e) {
    error.value = e.message || 'Error al crear lectura'
  }
}

const goBack = () => {
  router.push('/app/lecturas')
}
</script>

<style scoped>
.lectura-create {
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
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.05);
}

.lectura-form {
  display: flex;
  flex-direction: column;
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

select.form-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;utf8,<svg fill="%2366adf4" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 12px center;
  background-size: 16px 16px;
  cursor: pointer;
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
