<template>
  <div class="personnel-create">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-922769970-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Crear Nuevo Personal</h2>
        <p>Registra nuevos usuarios en el sistema IoT Water.</p>
      </div>
    </div>
    <div class="header">
      <h1><font-awesome-icon :icon="['fas', 'user-plus']" /> Crear Personal</h1>
      <router-link to="/app/personnel" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver al Listado
      </router-link>
    </div>
    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="personnel-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name" class="form-label">
              <font-awesome-icon :icon="['fas', 'user']" /> Nombre Completo *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'user']" /></span>
              <input 
                id="name" 
                v-model="form.name" 
                type="text" 
                class="form-input" 
                placeholder="Ej: Juan Pérez García" 
                required 
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">
              <font-awesome-icon :icon="['fas', 'envelope']" /> Email *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></span>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                class="form-input" 
                placeholder="juan.perez@empresa.com" 
                required 
              />
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="roleId" class="form-label">
              <font-awesome-icon :icon="['fas', 'user-tag']" /> Rol *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'shield-alt']" /></span>
              <select id="roleId" v-model="form.roleId" class="form-input" required>
                <option value="">Selecciona un rol</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.nombreRol || role.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="status" class="form-label">
              <font-awesome-icon :icon="['fas', 'toggle-on']" /> Estado *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'power-off']" /></span>
              <select id="status" v-model="form.status" class="form-input" required>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">
            <font-awesome-icon :icon="['fas', 'lock']" /> Contraseña *
          </label>
          <div class="input-icon-group">
            <span class="input-icon"><font-awesome-icon :icon="['fas', 'key']" /></span>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              class="form-input" 
              placeholder="Contraseña segura" 
              required 
            />
          </div>
          <small class="form-help">
            <font-awesome-icon :icon="['fas', 'info-circle']" /> Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números
          </small>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-cancel">
            <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
          </button>
          <button type="submit" class="btn btn-submit">
            <font-awesome-icon :icon="['fas', 'save']" /> Crear Personal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import personnelService from '@/services/personnel.service.js'
import rolesService from '@/services/roles.service.js'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PersonnelCreatePage',
  setup() {
    const router = useRouter()
    const roles = ref([])
    const form = ref({
      name: '',
      email: '',
      roleId: '',
      status: 'Activo',
      password: ''
    })

    const handleSubmit = async () => {
      try {
        await personnelService.createPersonnel(form.value)
        router.push('/app/personnel')
      } catch (error) {
        console.error('Error al crear personal:', error)
      }
    }

    const goBack = () => {
      router.push('/app/personnel')
    }

    const fetchRoles = async () => {
      try {
        const response = await rolesService.getRoles()
        roles.value = response.data || response || []
      } catch (err) {
        console.error('Error al cargar roles:', err)
      }
    }

    onMounted(() => {
      fetchRoles()
    })

    return { 
      form, 
      roles, 
      handleSubmit, 
      goBack 
    }
  }
}
</script>

<style scoped>
.personnel-create {
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

.form-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.05);
}

.personnel-form {
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
  display: flex;
  align-items: center;
  gap: 8px;
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
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #66adf4;
  box-shadow: 0 0 0 3px rgba(102, 173, 244, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-help {
  color: #666;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-submit {
  background-color: #007bff;
  color: white;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #495057;
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