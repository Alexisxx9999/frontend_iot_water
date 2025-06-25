<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <!-- Backdrop mejorado -->
      <div class="fixed inset-0 bg-gradient-to-br from-blue-900/60 via-blue-400/30 to-white/80 backdrop-blur-[2px]" @click="closeModal"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl sm:max-w-2xl mx-auto z-10 animate-fade-in border border-blue-100 flex flex-col max-h-[95vh]">
        <!-- Header mejorado -->
        <div class="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white rounded-t-3xl">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-blue-900">Nuevo Reporte de Incidente</h2>
              <p class="text-xs sm:text-sm text-blue-500">Complete los detalles del incidente</p>
            </div>
          </div>
          <button 
            @click="closeModal" 
            class="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-colors duration-200"
          >
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Formulario mejorado con scroll interno -->
        <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto px-5 py-4 sm:px-8 sm:py-6 space-y-6" style="scrollbar-gutter: stable;">
          <!-- Datos básicos -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div class="space-y-1.5">
              <label class="block text-sm font-semibold text-blue-900">Título del Incidente <span class="text-red-500">*</span></label>
              <input 
                v-model="formData.Titulo" 
                required 
                class="w-full px-3 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50 placeholder-blue-300 text-sm"
                placeholder="Ej: Caída del servidor principal"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-semibold text-blue-900">Prioridad <span class="text-red-500">*</span></label>
              <select 
                v-model="formData.Prioridad" 
                required 
                class="w-full px-3 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50 text-blue-900 text-sm"
              >
                <option value="">Seleccionar prioridad...</option>
                <option value="Crítico" class="text-red-600 font-medium">🚨 Crítico</option>
                <option value="Alto" class="text-orange-600 font-medium">⚠️ Alto</option>
                <option value="Medio" class="text-yellow-600 font-medium">⚡ Medio</option>
                <option value="Bajo" class="text-green-600 font-medium">📝 Bajo</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-semibold text-blue-900">Categoría</label>
              <input 
                v-model="formData.Categoria" 
                class="w-full px-3 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50 placeholder-blue-300 text-sm"
                placeholder="Ej: Servidores, Hardware, Software"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-semibold text-blue-900">Departamento Afectado</label>
              <input 
                v-model="formData.DepartamentoAfectado" 
                class="w-full px-3 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50 placeholder-blue-300 text-sm"
                placeholder="Ej: TI, Finanzas, Administración"
              />
            </div>
          </div>

          <!-- Descripción -->
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-blue-900">Descripción Detallada <span class="text-red-500">*</span></label>
            <textarea 
              v-model="formData.DescripcionDetallada" 
              required 
              rows="3"
              class="w-full px-3 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50 placeholder-blue-300 text-sm resize-none"
              placeholder="Describa el problema en detalle, incluyendo síntomas, impacto y pasos para reproducir..."
            ></textarea>
          </div>

          <!-- Tags -->
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-blue-900">Tags <span class="text-xs text-blue-400">(separados por coma)</span></label>
            <div class="relative">
              <input 
                v-model="formData.TagsInput" 
                class="w-full px-3 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50 placeholder-blue-300 text-sm"
                placeholder="servidor, urgente, red, facturación"
              />
              <div class="absolute right-3 top-2.5 text-blue-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
            </div>
            <p class="text-xs text-blue-400">Los tags ayudan a categorizar y buscar incidentes más fácilmente</p>
          </div>

          <!-- Notificaciones -->
          <div class="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 sm:p-6 space-y-3 border border-blue-100">
            <h4 class="font-semibold text-blue-800 flex items-center space-x-2 mb-1">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v10a4 4 0 004 4h10a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.81 1.19z"></path>
              </svg>
              <span>Configuración de Notificaciones</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <label class="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
                <input type="checkbox" v-model="notificationSettings.notificarUsuarioReporta" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span class="text-sm text-blue-900">Usuario que reportó</span>
              </label>
              <label class="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
                <input type="checkbox" v-model="notificationSettings.notificarEquipoTecnico" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span class="text-sm text-blue-900">Equipo técnico</span>
              </label>
              <label class="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
                <input type="checkbox" v-model="notificationSettings.notificarSupervisores" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span class="text-sm text-blue-900">Supervisores</span>
              </label>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-blue-900">Mensaje personalizado <span class="text-xs text-blue-400">(opcional)</span></label>
              <textarea 
                v-model="notificationSettings.mensajeNotificacion" 
                rows="2"
                class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50 placeholder-blue-300 text-sm resize-none"
                placeholder="Agregue un mensaje adicional para las notificaciones..."
              ></textarea>
            </div>
          </div>
        </form>
        <!-- Acciones fijas abajo -->
        <div class="sticky bottom-0 left-0 right-0 bg-white rounded-b-3xl border-t border-blue-100 px-5 py-4 sm:px-8 flex justify-end gap-3 z-20">
          <button 
            type="button" 
            @click="closeModal" 
            class="px-6 py-3 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl font-medium transition-colors duration-200"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form=""
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            :disabled="isSubmitting"
          >
            <svg v-if="isSubmitting" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Guardando...' : 'Guardar Reporte' }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const isSubmitting = ref(false);

const formData = ref({
  Titulo: '',
  DescripcionDetallada: '',
  Prioridad: '',
  Categoria: '',
  DepartamentoAfectado: '',
  TagsInput: '',
});

const notificationSettings = ref({
  notificarUsuarioReporta: true,
  notificarEquipoTecnico: true,
  notificarSupervisores: false,
  mensajeNotificacion: '',
});

// Reset form when modal opens
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

function resetForm() {
  formData.value = {
    Titulo: '',
    DescripcionDetallada: '',
    Prioridad: '',
    Categoria: '',
    DepartamentoAfectado: '',
    TagsInput: '',
  };
  
  notificationSettings.value = {
    notificarUsuarioReporta: true,
    notificarEquipoTecnico: true,
    notificarSupervisores: false,
    mensajeNotificacion: '',
  };
}

function closeModal() {
  emit('close');
}

async function handleSubmit() {
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  try {
    const tags = formData.value.TagsInput.split(',').map(t => t.trim()).filter(Boolean);
    
    const incidentData = {
      ...formData.value,
      Tags: tags,
      notificationSettings: notificationSettings.value
    };
    
    emit('submit', incidentData);
    closeModal();
  } catch (error) {
    console.error('Error al crear incidente:', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.animate-fade-in {
  animation: fadeInModal 0.35s cubic-bezier(.4,0,.2,1);
}

@keyframes fadeInModal {
  0% { opacity: 0; transform: scale(0.96); }
  100% { opacity: 1; transform: scale(1); }
}
</style> 