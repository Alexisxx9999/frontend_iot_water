<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Panel Izquierdo: Formulario -->
    <div class="flex-1 bg-white rounded shadow p-6">
      <h2 class="text-xl font-bold mb-4">Editar Contenido del Home</h2>
      <!-- Sobre la Organización -->
      <fieldset class="mb-4 border rounded p-4">
        <legend class="font-semibold">Sobre la Organización</legend>
        <!-- Nombre -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Nombre <span class="text-red-500">*</span></label>
          <input v-model="form.nombre" type="text" class="input" :class="{'border-red-500': errors.nombre}" maxlength="60" required autocomplete="off" />
          <div v-if="errors.nombre" class="text-red-500 text-sm">{{ errors.nombre }}</div>
        </div>
        <!-- Misión -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Misión <span class="text-red-500">*</span></label>
          <textarea v-model="form.mision" class="input" rows="2" maxlength="200"></textarea>
          <div v-if="errors.mision" class="text-red-500 text-sm">{{ errors.mision }}</div>
        </div>
        <!-- Visión -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Visión <span class="text-red-500">*</span></label>
          <textarea v-model="form.vision" class="input" rows="2" maxlength="200"></textarea>
          <div v-if="errors.vision" class="text-red-500 text-sm">{{ errors.vision }}</div>
        </div>
        <!-- Descripción -->
        <div class="mb-4">
          <label class="block font-semibold mb-1">Descripción <span class="text-red-500">*</span></label>
          <textarea v-model="form.descripcion" class="input" rows="2" maxlength="500"></textarea>
          <div v-if="errors.descripcion" class="text-red-500 text-sm">{{ errors.descripcion }}</div>
        </div>
      </fieldset>
      <!-- Información de Contacto -->
      <fieldset class="mb-4 border rounded p-4">
        <legend class="font-semibold">Información de Contacto</legend>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Celular <span class="text-red-500">*</span></label>
          <input v-model="form.celular" type="text" class="input" :class="{'border-red-500': errors.celular}" maxlength="10" autocomplete="off" />
          <div v-if="errors.celular" class="text-red-500 text-sm">{{ errors.celular }}</div>
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Correo <span class="text-red-500">*</span></label>
          <input v-model="form.correo" type="email" class="input" :class="{'border-red-500': errors.correo}" maxlength="100" autocomplete="off" />
          <div v-if="errors.correo" class="text-red-500 text-sm">{{ errors.correo }}</div>
        </div>
      </fieldset>
      <!-- Estado del Sitio -->
      <fieldset class="mb-4 border rounded p-4">
        <legend class="font-semibold">Estado del Sitio</legend>
        <select v-model="form.estado" class="input" :class="{'border-red-500': errors.estado}">
          <option value="">Seleccione estado</option>
          <option value="Activo">Activo</option>
          <option value="En Mantenimiento">En Mantenimiento</option>
          <option value="Deshabilitado">Deshabilitado</option>
        </select>
        <div v-if="errors.estado" class="text-red-500 text-sm">{{ errors.estado }}</div>
      </fieldset>
      <!-- Botones -->
      <div class="flex gap-3 mt-4">
        <button class="btn btn-primary" @click="onSubmit">{{ !store.content ? 'Crear Contenido' : 'Guardar Cambios' }}</button>
        <button class="btn btn-secondary" @click="onCancel" v-if="store.content">Cancelar</button>
      </div>
      <!-- Mensajes de éxito/error -->
      <div v-if="store.success" class="mt-4 text-green-600">{{ store.success }}</div>
      <div v-if="store.error && typeof store.error === 'string'" class="mt-4 text-red-600">{{ store.error }}</div>
      <div v-if="store.error && typeof store.error === 'object'" class="mt-4 text-red-600">
        <div v-for="(msg, key) in store.error" :key="key">{{ msg }}</div>
      </div>
    </div>

    <!-- Panel Derecho: Vista Previa -->
    <div class="flex-1 bg-gray-50 rounded shadow p-6">
      <h2 class="text-xl font-bold mb-4">Vista Previa del Home del Cliente</h2>
      <div>
        <h1 class="text-2xl font-bold mb-2">{{ form.nombre || 'Nombre de la Institución' }}</h1>
        <div v-if="form.estado" class="mb-2">
          <span :class="{
            'text-green-600': form.estado === 'Activo',
            'text-yellow-600': form.estado === 'En Mantenimiento',
            'text-red-600': form.estado === 'Deshabilitado'
          }">
            {{ form.estado }}
          </span>
        </div>
        <h2 class="font-semibold mt-4">Misión</h2>
        <p>{{ form.mision }}</p>
        <h2 class="font-semibold mt-4">Visión</h2>
        <p>{{ form.vision }}</p>
        <h2 class="font-semibold mt-4">Descripción</h2>
        <p>{{ form.descripcion }}</p>
        <h2 class="font-semibold mt-4">Contacto</h2>
        <ul>
          <li v-if="form.celular">📱 {{ form.celular }}</li>
          <li v-if="form.correo">✉️ {{ form.correo }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useHomeCrudStore } from '@/stores/homeCrud';

const store = useHomeCrudStore();
const original = reactive({});
const form = reactive({
  nombre: '',
  mision: '',
  vision: '',
  descripcion: '',
  celular: '',
  correo: '',
  estado: ''
});
const errors = reactive({});

function validate() {
  let valid = true;
  errors.nombre = '';
  errors.mision = '';
  errors.vision = '';
  errors.descripcion = '';
  errors.celular = '';
  errors.correo = '';
  errors.estado = '';

  // Nombre: solo letras y espacios, obligatorio, máximo 60
  if (!form.nombre) {
    errors.nombre = 'El nombre es obligatorio';
    valid = false;
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,60}$/.test(form.nombre)) {
    errors.nombre = 'Solo se permiten letras y espacios (máx. 60 caracteres)';
    valid = false;
  }
  // Misión: obligatorio, solo letras, espacios y signos de puntuación básicos, máximo 200
  if (!form.mision) {
    errors.mision = 'La misión es obligatoria';
    valid = false;
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ,.\-()"'¡!¿?\n\r ]{1,200}$/.test(form.mision)) {
    errors.mision = 'La misión no debe contener números y máximo 200 caracteres';
    valid = false;
  }
  // Visión: obligatorio, solo letras, espacios y signos de puntuación básicos, máximo 200
  if (!form.vision) {
    errors.vision = 'La visión es obligatoria';
    valid = false;
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ,.\-()"'¡!¿?\n\r ]{1,200}$/.test(form.vision)) {
    errors.vision = 'La visión no debe contener números y máximo 200 caracteres';
    valid = false;
  }
  // Descripción: obligatorio, máximo 500
  if (!form.descripcion) {
    errors.descripcion = 'La descripción es obligatoria';
    valid = false;
  } else if (form.descripcion.length > 500) {
    errors.descripcion = 'La descripción no debe superar los 500 caracteres';
    valid = false;
  }
  // Celular: obligatorio, exactamente 10 dígitos
  if (!form.celular) {
    errors.celular = 'El celular es obligatorio';
    valid = false;
  } else if (!/^\d{10}$/.test(form.celular)) {
    errors.celular = 'Ingrese un celular válido (exactamente 10 dígitos numéricos)';
    valid = false;
  }
  // Correo: obligatorio, formato email
  if (!form.correo) {
    errors.correo = 'El correo es obligatorio';
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
    errors.correo = 'Ingrese un correo válido';
    valid = false;
  }
  // Estado: obligatorio
  if (!form.estado) {
    errors.estado = 'El estado es obligatorio';
    valid = false;
  }
  return valid;
}

function onSubmit(e) {
  e.preventDefault();
  if (!validate()) return;
  if (!store.content) {
    store.createHomeContent({ ...form });
  } else {
    store.updateHomeContent({ ...form });
  }
}

function onCancel() {
  Object.assign(form, original);
  store.success = null;
  store.error = null;
}

onMounted(async () => {
  await store.fetchHomeContent();
  if (store.content) {
    Object.assign(form, store.content);
    Object.assign(original, store.content);
  } else {
    Object.assign(original, form);
  }
});

watch(() => store.content, (val) => {
  if (val) {
    Object.assign(form, val);
    Object.assign(original, val);
  }
});
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.input:focus {
  border-color: #2563eb;
}
.btn {
  background: #0ea5e9;
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover {
  background: #0369a1;
}
.btn-secondary {
  background: #e5e7eb;
  color: #23272f;
}
.btn-secondary:hover {
  background: #cbd5e1;
}
.tooltip {
  display: inline-block;
  border-radius: 50%;
  background: #e0e7ef;
  color: #2563eb;
  width: 1.2em;
  height: 1.2em;
  text-align: center;
  font-weight: bold;
  cursor: help;
  font-size: 1em;
  line-height: 1.2em;
}
</style> 