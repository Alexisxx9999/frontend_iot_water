<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="isOpen">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? 'Editar Incidente' : 'Nuevo Incidente' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input v-model="form.title" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'border-red-500': errors.title }" />
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada *</label>
            <textarea v-model="form.description" required rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'border-red-500': errors.description }"></textarea>
            <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad *</label>
              <select v-model="form.priority" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar prioridad</option>
                <option v-for="p in priorities" :key="p.key" :value="p.key">{{ p.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Departamento Afectado *</label>
              <select v-model="form.departmentId" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar departamento</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente *</label>
            <select v-model="form.type" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar tipo</option>
              <option v-for="type in incidentTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adjuntar Evidencia (solo imágenes)</label>
            <button type="button" @click="triggerFileInput" class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition mb-2">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m11 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6h2"></path></svg>
              Agregar Evidencia
            </button>
            <input ref="fileInput" type="file" multiple accept="image/*" @change="handleFileUpload" class="hidden" />
            <div v-if="form.evidence.length" class="mt-2 space-y-1">
              <div v-for="(file, idx) in form.evidence" :key="idx" class="flex items-center space-x-2">
                <img v-if="file.preview" :src="file.preview" alt="preview" class="w-12 h-12 object-cover rounded border" />
                <span class="text-xs text-gray-600">{{ file.name }}</span>
                <button type="button" @click="removeFile(idx)" class="ml-2 text-red-500 hover:underline">Quitar</button>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Asignar a Técnico/Equipo</label>
            <select v-model="form.assignedTo" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sin asignar</option>
              <option v-for="tech in technicalTeam" :key="tech.id" :value="tech.id">{{ tech.name }} ({{ tech.specialty }})</option>
            </select>
          </div>
          <div class="flex items-center">
            <input id="notify" v-model="form.notify" type="checkbox" class="mr-2" />
            <label for="notify" class="text-sm text-gray-700">Notificar inmediatamente</label>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
            <button type="submit" :disabled="loading" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
              <span v-if="loading">Guardando...</span>
              <span v-else>{{ isEditing ? 'Guardar Cambios' : 'Crear Incidente' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue';
const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean,
  incident: Object,
  priorities: Array,
  departments: Array,
  incidentTypes: Array,
  technicalTeam: Array
});
const emit = defineEmits(['close', 'saved']);
const loading = ref(false);
const form = ref({
  title: '',
  description: '',
  priority: '',
  departmentId: '',
  type: '',
  evidence: [],
  assignedTo: '',
  notify: false
});
const errors = ref({});
const isEditMode = computed(() => props.isEditing && props.incident);
const fileInput = ref(null);
watch(() => props.incident, (val) => {
  if (isEditMode.value && val) {
    form.value = {
      title: val.title || '',
      description: val.description || '',
      priority: val.priority || '',
      departmentId: val.departmentId || '',
      type: val.type || '',
      evidence: [],
      assignedTo: val.assignedTo || '',
      notify: false
    };
  } else {
    form.value = { title: '', description: '', priority: '', departmentId: '', type: '', evidence: [], assignedTo: '', notify: false };
  }
}, { immediate: true });
function closeModal() {
  emit('close');
}
function handleFileUpload(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        form.value.evidence.push({
          name: file.name,
          file: file,
          preview: ev.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  });
}
function removeFile(idx) {
  form.value.evidence.splice(idx, 1);
}
function validate() {
  errors.value = {};
  if (!form.value.title) errors.value.title = 'El título es obligatorio.';
  if (!form.value.description) errors.value.description = 'La descripción es obligatoria.';
  if (!form.value.priority) errors.value.priority = 'La prioridad es obligatoria.';
  if (!form.value.departmentId) errors.value.departmentId = 'El departamento es obligatorio.';
  if (!form.value.type) errors.value.type = 'El tipo de incidente es obligatorio.';
  return Object.keys(errors.value).length === 0;
}
async function handleSubmit() {
  if (!validate()) return;
  loading.value = true;
  // Aquí iría la llamada al backend para guardar o editar
  setTimeout(() => {
    emit('saved', { ...form.value, id: props.incident?.id });
    loading.value = false;
    closeModal();
  }, 1000);
}
function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}
</script> 