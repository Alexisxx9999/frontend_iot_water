<template>
  <div class="role-edit">
    <div class="header">
      <span class="icon">✏️</span>
      <div>
        <h1>Editar Rol</h1>
        <p class="subtitle">Modifica los datos del rol seleccionado</p>
      </div>
    </div>
    <form v-if="loaded" @submit.prevent="handleSubmit" class="role-form">
      <div class="form-group">
        <label for="nombreRol">Nombre del Rol *</label>
        <div class="input-icon-group">
          <span class="input-icon">🔤</span>
          <input id="nombreRol" v-model="form.nombreRol" required class="form-input" placeholder="Ej: Administrador" />
        </div>
      </div>
      <div class="form-group">
        <label for="descripcionRol">Descripción *</label>
        <div class="input-icon-group">
          <span class="input-icon">💬</span>
          <input id="descripcionRol" v-model="form.descripcionRol" required class="form-input" placeholder="Describe el rol" />
        </div>
      </div>
      <div class="form-group">
        <label for="estadoRol">Estado *</label>
        <div class="input-icon-group">
          <span class="input-icon">⚡</span>
          <select id="estadoRol" v-model="form.estadoRol" required class="form-input">
            <option v-for="opt in estadoRolOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" @click="goBack" class="btn-cancel">
          <span class="btn-icon">↩️</span> Cancelar
        </button>
        <button type="submit" class="btn-submit">
          <span class="btn-icon">💾</span> Guardar
        </button>
      </div>
    </form>
    <div v-else>Cargando...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { rolesService } from '../../services/roles.service.js'
import { estadoRolOptions } from '../../utils/roles.js'

const router = useRouter()
const route = useRoute()
const form = ref({ nombreRol: '', descripcionRol: '', estadoRol: 'Activo' })
const loaded = ref(false)

const goBack = () => router.push('/app/roles')

onMounted(async () => {
  const id = route.params.id
  const data = await rolesService.getRoleById(id)
  if (data) {
    form.value = { ...data }
    loaded.value = true
  } else {
    alert('Rol no encontrado')
    goBack()
  }
})

const handleSubmit = async () => {
  await rolesService.updateRole(form.value.id, form.value)
  router.push('/app/roles')
}
</script>

<style scoped>
.role-edit {
  max-width: 500px;
  margin: 48px auto 0 auto;
  padding: 36px 30px 28px 30px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(80, 112, 184, 0.13);
}
.header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}
.header .icon {
  font-size: 2.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
}
.header h1 {
  color: #2c3e50;
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0;
}
.subtitle {
  color: #7b8ca6;
  font-size: 1rem;
  margin-top: 2px;
}
.role-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.form-group label {
  font-weight: 600;
  color: #34495e;
  margin-bottom: 6px;
}
.input-icon-group {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e1e5e9;
  box-shadow: 0 1px 2px rgba(80, 112, 184, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-icon {
  padding: 0 12px;
  font-size: 1.2em;
  color: #a5b4fc;
}
.form-input {
  flex: 1;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  background: transparent;
}
.form-input:focus {
  outline: none;
}
.input-icon-group:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 2px #a5b4fc44;
}
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 10px;
}
.btn-cancel {
  background: #ecf0f1;
  color: #7f8c8d;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}
.btn-cancel:hover {
  background: #bdc3c7;
}
.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.btn-submit:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.18);
  transform: translateY(-2px);
}
.btn-icon {
  font-size: 1.1em;
}
@media (max-width: 600px) {
  .role-edit {
    padding: 16px 4vw;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style> 