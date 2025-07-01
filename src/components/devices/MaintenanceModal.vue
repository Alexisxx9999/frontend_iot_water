<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="isOpen">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header -->
        <div class="bg-blue-50 px-6 py-4 border-b border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-blue-800">
                  Registrar Mantenimiento
                </h3>
                <p class="text-sm text-blue-600">
                  Dispositivo: {{ device?.serialNumber }}
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="text-blue-400 hover:text-blue-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-6">
            <!-- Información del Dispositivo -->
            <div class="bg-gray-50 rounded-md p-4">
              <h4 class="font-medium text-gray-900 mb-3">Información del Dispositivo</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Tipo:</span>
                  <span class="ml-1 text-gray-600">{{ device?.type }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Modelo:</span>
                  <span class="ml-1 text-gray-600">{{ device?.model }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Estado Actual:</span>
                  <span class="ml-1 text-gray-600">{{ device?.status }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Ubicación:</span>
                  <span class="ml-1 text-gray-600">{{ device?.sector?.name }}</span>
                </div>
              </div>
            </div>

            <!-- Detalles del Mantenimiento -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 border-b pb-2">Detalles del Mantenimiento</h4>
              
              <!-- Tipo de Mantenimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Mantenimiento *
                </label>
                <select
                  v-model="form.type"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar tipo</option>
                  <option v-for="(label, key) in MAINTENANCE_TYPES" :key="key" :value="key">
                    {{ label }}
                  </option>
                </select>
              </div>

              <!-- Fecha y Hora -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Mantenimiento *
                  </label>
                  <input
                    v-model="form.date"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Inicio *
                  </label>
                  <input
                    v-model="form.startTime"
                    type="time"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Duración -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duración Estimada (horas)
                </label>
                <input
                  v-model.number="form.duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Técnico Responsable -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Técnico Responsable *
                </label>
                <input
                  v-model="form.technician"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Mantenimiento *
                </label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe las actividades realizadas durante el mantenimiento..."
                ></textarea>
              </div>

              <!-- Actividades Realizadas -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Actividades Realizadas
                </label>
                <textarea
                  v-model="form.activities"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lista de actividades específicas realizadas..."
                ></textarea>
              </div>

              <!-- Repuestos Utilizados -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Repuestos Utilizados
                </label>
                <textarea
                  v-model="form.parts"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lista de repuestos o materiales utilizados..."
                ></textarea>
              </div>

              <!-- Costo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Costo del Mantenimiento ($)
                </label>
                <input
                  v-model.number="form.cost"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Observaciones -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones Adicionales
                </label>
                <textarea
                  v-model="form.observations"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Observaciones, recomendaciones o notas adicionales..."
                ></textarea>
              </div>

              <!-- Estado Post-Mantenimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Estado Post-Mantenimiento *
                </label>
                <select
                  v-model="form.postMaintenanceStatus"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar estado</option>
                  <option v-for="(label, key) in DEVICE_STATUS" :key="key" :value="key">
                    {{ label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>Registrar Mantenimiento</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useDevicesStore } from '@/stores/devices'

export default {
  name: 'MaintenanceModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    device: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const devicesStore = useDevicesStore()
    
    const loading = ref(false)

    // Formulario
    const form = reactive({
      type: '',
      date: '',
      startTime: '',
      duration: 1,
      technician: '',
      description: '',
      activities: '',
      parts: '',
      cost: 0,
      observations: '',
      postMaintenanceStatus: ''
    })

    // Constantes
    const { MAINTENANCE_TYPES, DEVICE_STATUS } = devicesStore

    // Métodos
    const closeModal = () => {
      emit('close')
    }

    const resetForm = () => {
      Object.assign(form, {
        type: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        duration: 1,
        technician: '',
        description: '',
        activities: '',
        parts: '',
        cost: 0,
        observations: '',
        postMaintenanceStatus: ''
      })
    }

    const handleSubmit = async () => {
      loading.value = true
      
      try {
        const maintenanceData = {
          ...form,
          deviceId: props.device.id,
          startDateTime: `${form.date}T${form.startTime}:00`,
          endDateTime: form.duration ? 
            new Date(`${form.date}T${form.startTime}:00`).getTime() + (form.duration * 60 * 60 * 1000) : null
        }

        await devicesStore.createMaintenance(props.device.id, maintenanceData)
        emit('saved')
        closeModal()
      } catch (error) {
        console.error('Error creating maintenance:', error)
        // Mostrar error al usuario
      } finally {
        loading.value = false
      }
    }

    // Watchers
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm()
      }
    })

    return {
      loading,
      form,
      MAINTENANCE_TYPES,
      DEVICE_STATUS,
      closeModal,
      handleSubmit
    }
  }
}
</script> 