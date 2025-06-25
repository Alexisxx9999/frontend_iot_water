<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <slot name="header-icon" />
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-white">Agregar Nuevo Empleado</h3>
                <p class="text-primary-100 text-sm">Complete la información del empleado</p>
              </div>
            </div>
            <button 
              @click="closeModal"
              class="text-white hover:text-primary-100 transition-colors duration-200"
            >
              <slot name="close-icon" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6 max-h-96 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Personal Information -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Información Personal</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input 
                    v-model="form.name"
                    type="text" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Ingrese el nombre completo"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    v-model="form.email"
                    type="email" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="correo@empresa.com"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input 
                    v-model="form.phone"
                    type="tel" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  <input 
                    v-model="form.birthDate"
                    type="date" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                </div>
              </div>
            </div>

            <!-- Work Information -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Información Laboral</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ID Empleado</label>
                  <input 
                    v-model="form.employeeId"
                    type="text" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="EMP-001"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <select 
                    v-model="form.department"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                    <option value="">Seleccione departamento</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Calidad">Calidad</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Administración">Administración</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Posición</label>
                  <input 
                    v-model="form.position"
                    type="text" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Técnico de Mantenimiento"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso</label>
                  <input 
                    v-model="form.startDate"
                    type="date" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                  <input 
                    v-model="form.location"
                    type="text" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Zona Norte"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Experiencia (años)</label>
                  <input 
                    v-model="form.experience"
                    type="number" 
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="5"
                  >
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Información Adicional</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Salario Base</label>
                  <input 
                    v-model="form.salary"
                    type="number" 
                    min="0"
                    step="0.01"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="2500.00"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select 
                    v-model="form.status"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="on_leave">En Licencia</option>
                  </select>
                </div>
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea 
                  v-model="form.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Información adicional sobre el empleado..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button 
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            Cancelar
          </button>
          <button 
            @click="handleSubmit"
            :disabled="loading"
            class="px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Guardando...</span>
            <span v-else>Guardar Empleado</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const loading = ref(false);

const form = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  employeeId: '',
  department: '',
  position: '',
  startDate: '',
  location: '',
  experience: '',
  salary: '',
  status: 'active',
  notes: ''
});

const closeModal = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = '';
  });
  form.status = 'active';
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Validar campos requeridos
    const requiredFields = ['name', 'email', 'phone', 'employeeId', 'department', 'position', 'startDate'];
    const missingFields = requiredFields.filter(field => !form[field]);
    
    if (missingFields.length > 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Emitir evento con los datos del formulario
    await emit('save', { ...form });
    
    // Cerrar modal y resetear formulario
    closeModal();
  } catch (error) {
    console.error('Error al guardar empleado:', error);
  } finally {
    loading.value = false;
  }
};
</script> 