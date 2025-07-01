<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="isOpen">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Header -->
        <div class="bg-red-50 px-6 py-4 border-b border-red-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-red-800">
                Confirmar Eliminación
              </h3>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div class="px-6 py-4">
          <div class="text-sm text-gray-700">
            <p class="mb-4">
              ¿Estás seguro de que quieres eliminar el incidente
              <strong class="font-semibold">{{ incident?.title }}</strong>?
            </p>
            <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-yellow-800">
                    Esta acción no se puede deshacer
                  </h4>
                  <div class="mt-2 text-sm text-yellow-700">
                    <ul class="list-disc list-inside space-y-1">
                      <li>Se eliminarán todos los datos asociados al incidente</li>
                      <li>Se perderá el historial de la bitácora</li>
                      <li>Se eliminarán todos los archivos adjuntos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- Información del incidente -->
            <div class="bg-gray-50 rounded-md p-4">
              <h4 class="font-medium text-gray-900 mb-2">Información del Incidente:</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Prioridad:</span>
                  <span class="ml-1 text-gray-600">{{ incident?.priority }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Departamento:</span>
                  <span class="ml-1 text-gray-600">{{ incident?.departmentId }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Estado:</span>
                  <span class="ml-1 text-gray-600">{{ incident?.status }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Reportado Por:</span>
                  <span class="ml-1 text-gray-600">{{ incident?.reportedBy }}</span>
                </div>
              </div>
            </div>
            <!-- Campo de confirmación -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Escribe "ELIMINAR" para confirmar:
              </label>
              <input v-model="confirmationText" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="ELIMINAR" />
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="closeModal" type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">Cancelar</button>
          <button @click="handleDelete" type="button" :disabled="!canDelete || loading" class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Eliminando...
            </span>
            <span v-else>Eliminar Incidente</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  isOpen: Boolean,
  incident: Object
});
const emit = defineEmits(['close', 'deleted']);
const loading = ref(false);
const confirmationText = ref('');
const canDelete = computed(() => confirmationText.value === 'ELIMINAR');
function closeModal() {
  confirmationText.value = '';
  emit('close');
}
async function handleDelete() {
  if (!canDelete.value || !props.incident) return;
  loading.value = true;
  // Aquí iría la llamada al backend para eliminar
  setTimeout(() => {
    emit('deleted', props.incident);
    loading.value = false;
    closeModal();
  }, 1000);
}
</script> 