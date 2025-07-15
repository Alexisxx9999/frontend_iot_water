<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar' : 'Nuevo' }} Empleado</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Información Personal -->
        <div class="field-group">
          <h3>Información Personal</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="employeeId">ID Empleado</label>
              <div class="relative">
                <input
                  type="text"
                  id="employeeId"
                  v-model="formData.employeeId"
                  :class="['form-input', { 'error': errors.employeeId }]"
                  required
                  @blur="validateEmployeeId"
                />
                <div v-if="errors.employeeId" class="error-message">
                  {{ errors.employeeId }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  :class="['form-input', { 'error': errors.email }]"
                  required
                  @blur="validateEmail"
                />
                <div v-if="errors.email" class="error-message">
                  {{ errors.email }}
                </div>
              </div>
            </div>
          </div>

          <!-- Mantenemos el resto de los campos pero aplicamos los nuevos estilos -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName">Apellidos</label>
              <input
                type="text"
                id="lastName"
                v-model="formData.lastName"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Resto de los campos personales con los mismos estilos mejorados -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="dni">DNI/Documento*</label>
              <input
                type="text"
                id="dni"
                v-model="formData.dni"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="birthDate">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthDate"
                v-model="formData.birthDate"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="address">Dirección</label>
              <input
                type="text"
                id="address"
                v-model="formData.address"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Información Laboral -->
        <div class="field-group">
          <h3>Información Laboral</h3>
          
          <!-- Mantenemos la estructura pero aplicamos los nuevos estilos -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="department">Departamento*</label>
              <div class="relative">
                <input
                  type="text"
                  id="department"
                  v-model="formData.department"
                  class="form-input"
                  required
                  @input="filterDepartments"
                  @focus="showDepartmentSuggestions = true"
                />
                <!-- Lista de sugerencias -->
                <div 
                  v-if="showDepartmentSuggestions && filteredDepartments.length > 0"
                  class="department-suggestions"
                >
                  <div
                    v-for="dept in filteredDepartments"
                    :key="dept"
                    class="department-suggestion-item"
                    @click="selectDepartment(dept)"
                  >
                    {{ dept }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="position">Posición*</label>
              <input
                type="text"
                id="position"
                v-model="formData.position"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="startDate">Fecha de Inicio*</label>
              <input
                type="date"
                id="startDate"
                v-model="formData.startDate"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="contractType">Tipo de Contrato*</label>
              <select
                id="contractType"
                v-model="formData.contractType"
                class="form-input"
                required
              >
                <option value="">Seleccionar...</option>
                <option value="FULL_TIME">Tiempo Completo</option>
                <option value="PART_TIME">Tiempo Parcial</option>
                <option value="TEMPORARY">Temporal</option>
                <option value="CONTRACTOR">Contratista</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="salary">Salario</label>
              <input
                type="number"
                id="salary"
                v-model="formData.salary"
                class="form-input"
                step="0.01"
              />
            </div>

            <div class="form-group">
              <label for="schedule">Jornada Laboral</label>
              <select
                id="schedule"
                v-model="formData.schedule"
                class="form-input"
              >
                <option value="">Seleccionar...</option>
                <option value="MORNING">Mañana</option>
                <option value="AFTERNOON">Tarde</option>
                <option value="NIGHT">Noche</option>
                <option value="ROTATING">Rotativo</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Roles y Permisos -->
        <div class="field-group">
          <h3>Roles y Permisos</h3>
          
          <div class="form-group">
            <label>Roles</label>
            <div class="grid grid-cols-2 gap-4">
              <div 
                v-for="role in availableRoles" 
                :key="role.id" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  :id="'role-' + role.id"
                  v-model="formData.roles"
                  :value="role.id"
                  class="form-checkbox"
                />
                <label :for="'role-' + role.id" class="ml-2 text-sm text-gray-700">
                  {{ role.name }}
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Permisos Individuales</label>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="perm in additionalPermissions" :key="perm.id" class="flex items-center p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  :id="'perm-' + perm.id"
                  v-model="formData.additionalPermissions"
                  :value="perm.id"
                  class="form-checkbox"
                />
                <label :for="'perm-' + perm.id" class="ml-2 text-sm text-gray-700">
                  {{ perm.name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Adicional -->
        <div class="field-group">
          <h3>Información Adicional</h3>
          
          <div class="form-group">
            <label for="experience">Experiencia Previa</label>
            <textarea
              id="experience"
              v-model="formData.experience"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="skills">Habilidades</label>
            <textarea
              id="skills"
              v-model="formData.skills"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="certifications">Certificaciones</label>
            <textarea
              id="certifications"
              v-model="formData.certifications"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="observations">Observaciones</label>
            <textarea
              id="observations"
              v-model="formData.observations"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button
            type="button"
            @click="closeModal"
            class="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { usePersonnelStore } from '@/stores/personnel';
import { personnelService } from '@/services/personnel.service';

export default {
  name: 'NewPersonnelModal',
  props: {
    isEditing: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'refresh'],
  
  setup(props, { emit }) {
    const store = usePersonnelStore();
    const isSubmitting = ref(false);
    const errors = reactive({});
    const showDepartmentSuggestions = ref(false);
    const departmentsList = ref([
      'Recursos Humanos',
      'Tecnología',
      'Ventas',
      'Marketing',
      'Finanzas',
      'Operaciones',
      'Atención al Cliente',
      'Desarrollo',
      'Calidad',
      'Administración'
    ]);
    const filteredDepartments = ref([...departmentsList.value]);

    const additionalPermissions = computed(() => store.additionalPermissions);

    const formData = reactive({
      employeeId: props.userData?.employeeId || '',
      email: props.userData?.email || '',
      firstName: props.userData?.firstName || '',
      lastName: props.userData?.lastName || '',
      phone: props.userData?.phone || '',
      dni: props.userData?.dni || '',
      birthDate: props.userData?.birthDate || '',
      address: props.userData?.address || '',
      department: props.userData?.department || '',
      position: props.userData?.position || '',
      startDate: props.userData?.startDate || '',
      contractType: props.userData?.contractType || '',
      salary: props.userData?.salary || '',
      schedule: props.userData?.schedule || '',
      roles: props.userData?.roles?.map(r => r.id) || [],
      experience: props.userData?.experience || '',
      skills: props.userData?.skills || '',
      certifications: props.userData?.certifications || '',
      observations: props.userData?.observations || '',
      additionalPermissions: props.userData?.additionalPermissions || []
    });

    const availableRoles = ref([]);

    onMounted(async () => {
      try {
        const response = await personnelService.getRoles();
        availableRoles.value = response.data;
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    });

    const filterDepartments = () => {
      const searchTerm = formData.department.toLowerCase();
      filteredDepartments.value = departmentsList.value.filter(dept =>
        dept.toLowerCase().includes(searchTerm)
      );
    };

    const selectDepartment = (department) => {
      formData.department = department;
      showDepartmentSuggestions.value = false;
    };

    const validateEmployeeId = async () => {
      if (!formData.employeeId) return;
      try {
        await personnelService.validateEmployeeId(formData.employeeId);
        errors.employeeId = '';
      } catch (error) {
        errors.employeeId = 'Este ID de empleado ya está en uso';
      }
    };

    const validateEmail = async () => {
      if (!formData.email) return;
      try {
        await personnelService.validateEmail(formData.email);
        errors.email = '';
      } catch (error) {
        errors.email = 'Este email ya está registrado';
      }
    };

    const handleSubmit = async () => {
      try {
        isSubmitting.value = true;
        
        if (props.isEditing) {
          await store.updateUser(props.userData.id, formData);
        } else {
          await store.createUser(formData);
        }
        
        await store.fetchPersonnel();
        emit('refresh');
        emit('close');
      } catch (error) {
        console.error('Error al guardar:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const closeModal = () => {
      emit('close');
    };

    return {
      formData,
      availableRoles,
      isSubmitting,
      errors,
      handleSubmit,
      closeModal,
      validateEmployeeId,
      validateEmail,
      showDepartmentSuggestions,
      filteredDepartments,
      filterDepartments,
      selectDepartment,
      additionalPermissions
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative;
}

.form-group {
  @apply relative;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-group label:after {
  content: "*";
  @apply text-red-500 ml-1;
}

.form-group label:not([required]):after {
  content: none;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm 
         focus:ring-blue-500 focus:border-blue-500 
         transition duration-150 ease-in-out
         sm:text-sm;
}

.form-input.error {
  @apply border-red-300 text-red-900 placeholder-red-300 
         focus:ring-red-500 focus:border-red-500;
}

.form-checkbox {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 
         border-gray-300 rounded transition duration-150 ease-in-out;
}

h2 {
  @apply flex items-center text-2xl font-bold text-gray-900 mb-6;
}

h2:before {
  content: '';
  @apply w-8 h-8 mr-3 bg-blue-100 rounded-full flex items-center justify-center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234B5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E");
}

h3 {
  @apply flex items-center text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200;
}

.btn {
  @apply px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 
         hover:bg-gray-50 focus:ring-blue-500;
}

.error-message {
  @apply mt-2 text-sm text-red-600;
}

/* Mejoras para las sugerencias de departamento */
.department-suggestions {
  @apply absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto 
         ring-1 ring-black ring-opacity-5;
}

.department-suggestion-item {
  @apply px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer;
}

/* Animaciones */
.modal-enter-active,
.modal-leave-active {
  @apply transition-opacity duration-300;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0;
}

.modal-enter-to,
.modal-leave-from {
  @apply opacity-100;
}

/* Mejoras para los grupos de campos */
.field-group {
  @apply bg-gray-50 rounded-lg p-6 mb-6;
}

/* Mejoras para los botones de acción */
.action-buttons {
  @apply flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200;
}
</style> 