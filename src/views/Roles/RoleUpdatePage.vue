<template>
  <div class="role-edit">
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-1438537439-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Editar Rol</h2>
        <p>Modifica los permisos y configuración del rol seleccionado.</p>
      </div>
    </div>
    <div class="header">
      <h1><font-awesome-icon :icon="['fas', 'user-edit']" /> Editar Rol</h1>
      <router-link to="/app/roles" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver
      </router-link>
      </div>
    <LoadingSpinner v-if="loading" message="Cargando datos del rol..." />
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="form" class="content">
      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="role-form">
          <div class="form-row">
      <div class="form-group">
              <label for="nombreRol" class="form-label">
                <font-awesome-icon :icon="['fas', 'user-tag']" /> Nombre del Rol *
              </label>
        <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'tag']" /></span>
                <input 
                  id="nombreRol" 
                  v-model="form.nombreRol" 
                  type="text" 
                  class="form-input" 
                  placeholder="Ej: Administrador, Usuario, Supervisor" 
                  required 
                />
        </div>
      </div>
            
      <div class="form-group">
              <label for="estadoRol" class="form-label">
                <font-awesome-icon :icon="['fas', 'toggle-on']" /> Estado *
              </label>
        <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'power-off']" /></span>
                <select id="estadoRol" v-model="form.estadoRol" class="form-input" required>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
        </div>
      </div>
          
      <div class="form-group">
            <label for="descripcionRol" class="form-label">
              <font-awesome-icon :icon="['fas', 'align-left']" /> Descripción *
            </label>
        <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'comment']" /></span>
              <textarea 
                id="descripcionRol" 
                v-model="form.descripcionRol" 
                class="form-input" 
                placeholder="Describe las responsabilidades y alcance del rol"
                rows="3"
                required
              ></textarea>
        </div>
      </div>
          
          <div class="form-group">
            <label for="permisos" class="form-label">
              <font-awesome-icon :icon="['fas', 'key']" /> Permisos
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'shield-alt']" /></span>
              <input 
                id="permisos" 
                v-model="form.permisos" 
                type="text" 
                class="form-input" 
                placeholder="crear,editar,eliminar,ver (separados por coma)" 
              />
            </div>
            <small class="form-help">
              <font-awesome-icon :icon="['fas', 'info-circle']" /> Ingresa los permisos separados por comas
            </small>
          </div>
          
      <div class="form-actions">
            <button type="button" @click="goBack" class="btn btn-cancel">
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
        </button>
            <button type="submit" class="btn btn-submit">
              <font-awesome-icon :icon="['fas', 'save']" /> Guardar Cambios
        </button>
      </div>
    </form>
      </div>
    </div>
  </div>
</template>

<script>
import rolesService from '@/services/roles.service.js'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'RoleUpdatePage',
  components: {
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
const router = useRouter()
    const form = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const goBack = () => {
      router.push('/app/roles')
    }

    const fetchRole = async () => {
      try {
        loading.value = true
        const response = await rolesService.getRoleById(route.params.id)
        const role = response.data || response
        form.value = {
          nombreRol: role.nombreRol || role.name || '',
          descripcionRol: role.descripcionRol || role.description || '',
          permisos: (role.permissions || []).join(', '),
          estadoRol: role.estadoRol || role.status || 'Activo'
        }
      } catch (err) {
        error.value = 'Error al cargar el rol: ' + err.message
      } finally {
        loading.value = false
  }
    }

const handleSubmit = async () => {
      try {
        const updatedRole = {
          nombreRol: form.value.nombreRol,
          descripcionRol: form.value.descripcionRol,
          permisos: form.value.permisos.split(',').map(p => p.trim()).filter(Boolean),
          estadoRol: form.value.estadoRol
        }
        await rolesService.updateRole(route.params.id, updatedRole)
  router.push('/app/roles')
      } catch (error) {
        console.error('Error al actualizar rol:', error)
      }
    }

    onMounted(fetchRole)

    return { form, loading, error, handleSubmit, goBack }
  }
}
</script>

<style scoped>
.role-edit {
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

.role-form {
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

.form-help {
  color: #6b7280;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #495057;
}

.btn-icon {
  font-size: 1.1rem;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 8px;
  margin: 1rem 0;
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