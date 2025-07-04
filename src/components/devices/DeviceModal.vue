<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="isOpen">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? 'Editar Dispositivo' : 'Nuevo Dispositivo' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Información Básica -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 border-b pb-2">Información Básica</h4>
              
              <!-- Número de Serie -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Número de Serie *
                </label>
                <input
                  v-model="form.serialNumber"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errors.serialNumber }"
                />
                <p v-if="errors.serialNumber" class="text-red-500 text-sm mt-1">{{ errors.serialNumber }}</p>
              </div>

              <!-- Tipo de Dispositivo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Dispositivo *
                </label>
                <select
                  v-model="form.type"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar tipo</option>
                  <option v-for="(label, key) in DEVICE_TYPES" :key="key" :value="key">
                    {{ label }}
                  </option>
                </select>
              </div>

              <!-- Modelo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Modelo *
                </label>
                <input
                  v-model="form.model"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Fabricante -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fabricante *
                </label>
                <input
                  v-model="form.manufacturer"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Fecha de Instalación -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Instalación *
                </label>
                <input
                  v-model="form.installationDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Configuración y Ubicación -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 border-b pb-2">Configuración y Ubicación</h4>
              
              <!-- Estado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  v-model="form.status"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar estado</option>
                  <option v-for="(label, key) in DEVICE_STATUS" :key="key" :value="key">
                    {{ label }}
                  </option>
                </select>
              </div>

              <!-- Sector -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sector *
                </label>
                <select
                  v-model="form.sectorId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar sector</option>
                  <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                    {{ sector.name }}
                  </option>
                </select>
              </div>

              <!-- Cliente Asociado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Cliente Asociado
                </label>
                <select
                  v-model="form.clientId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin cliente asociado</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.name }}
                  </option>
                </select>
              </div>

              <!-- Gateway Principal -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Gateway Principal
                </label>
                <select
                  v-model="form.gatewayId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin gateway asignado</option>
                  <option v-for="gateway in gateways" :key="gateway.id" :value="gateway.id">
                    {{ gateway.name }} ({{ gateway.serialNumber }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Configuración Avanzada -->
          <div class="mt-6 space-y-4">
            <h4 class="font-medium text-gray-900 border-b pb-2">Configuración Avanzada</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Frecuencia de Reporte -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia de Reporte (minutos)
                </label>
                <input
                  v-model.number="form.reportFrequency"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Umbral de Alerta -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Umbral de Alerta (%)
                </label>
                <input
                  v-model.number="form.alertThreshold"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Versión de Firmware -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Versión de Firmware
                </label>
                <input
                  v-model="form.firmwareVersion"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Configuración Personalizada -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Configuración Personalizada (JSON)
              </label>
              <textarea
                v-model="form.customConfig"
                rows="4"
                placeholder='{"key": "value"}'
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              ></textarea>
            </div>
          </div>

          <!-- Coordenadas -->
          <div class="mt-6 space-y-4">
            <h4 class="font-medium text-gray-900 border-b pb-2">Ubicación Geográfica</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Latitud -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Latitud
                </label>
                <input
                  v-model.number="form.latitude"
                  type="number"
                  step="any"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Longitud -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Longitud
                </label>
                <input
                  v-model.number="form.longitude"
                  type="number"
                  step="any"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Dirección -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                v-model="form.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useDevicesStore } from '@/stores/devices'

export default {
  name: 'DeviceModal',
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
    const errors = reactive({})

    // Formulario
    const form = reactive({
      serialNumber: '',
      type: '',
      model: '',
      manufacturer: '',
      installationDate: '',
      status: '',
      sectorId: '',
      clientId: '',
      gatewayId: '',
      reportFrequency: 15,
      alertThreshold: 80,
      firmwareVersion: '1.0.0',
      customConfig: '',
      latitude: null,
      longitude: null,
      address: ''
    })

    // Computed
    const isEditing = computed(() => !!props.device)
    const { DEVICE_TYPES, DEVICE_STATUS } = devicesStore
    const sectors = computed(() => devicesStore.getSectors)
    const clients = computed(() => devicesStore.getClients)
    const gateways = computed(() => devicesStore.getGateways)

    // Métodos
    const closeModal = () => {
      emit('close')
    }

    const validateForm = () => {
      errors.value = {}
      
      if (!form.serialNumber.trim()) {
        errors.serialNumber = 'El número de serie es requerido'
      }
      
      if (!form.type) {
        errors.type = 'El tipo de dispositivo es requerido'
      }
      
      if (!form.model.trim()) {
        errors.model = 'El modelo es requerido'
      }
      
      if (!form.manufacturer.trim()) {
        errors.manufacturer = 'El fabricante es requerido'
      }
      
      if (!form.installationDate) {
        errors.installationDate = 'La fecha de instalación es requerida'
      }
      
      if (!form.status) {
        errors.status = 'El estado es requerido'
      }
      
      if (!form.sectorId) {
        errors.sectorId = 'El sector es requerido'
      }

      return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      
      try {
        const deviceData = {
          ...form,
          customConfig: form.customConfig ? JSON.parse(form.customConfig) : null
        }

        if (isEditing.value) {
          await devicesStore.updateDevice(props.device.id, deviceData)
        } else {
          await devicesStore.createDevice(deviceData)
        }

        emit('saved')
        closeModal()
      } catch (error) {
        console.error('Error saving device:', error)
        // Mostrar error al usuario
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      Object.assign(form, {
        serialNumber: '',
        type: '',
        model: '',
        manufacturer: '',
        installationDate: '',
        status: '',
        sectorId: '',
        clientId: '',
        gatewayId: '',
        reportFrequency: 15,
        alertThreshold: 80,
        firmwareVersion: '1.0.0',
        customConfig: '',
        latitude: null,
        longitude: null,
        address: ''
      })
      errors.value = {}
    }

    const loadDeviceData = () => {
      if (props.device) {
        Object.assign(form, {
          serialNumber: props.device.serialNumber || '',
          type: props.device.type || '',
          model: props.device.model || '',
          manufacturer: props.device.manufacturer || '',
          installationDate: props.device.installationDate || '',
          status: props.device.status || '',
          sectorId: props.device.sectorId || '',
          clientId: props.device.clientId || '',
          gatewayId: props.device.gatewayId || '',
          reportFrequency: props.device.reportFrequency || 15,
          alertThreshold: props.device.alertThreshold || 80,
          firmwareVersion: props.device.firmwareVersion || '1.0.0',
          customConfig: props.device.customConfig ? JSON.stringify(props.device.customConfig, null, 2) : '',
          latitude: props.device.latitude || null,
          longitude: props.device.longitude || null,
          address: props.device.address || ''
        })
      } else {
        resetForm()
      }
    }

    // Watchers
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        loadDeviceData()
      }
    })

    watch(() => props.device, () => {
      if (props.isOpen) {
        loadDeviceData()
      }
    })

    // Lifecycle
    onMounted(async () => {
      // Cargar datos necesarios
      try {
        await Promise.all([
          devicesStore.fetchSectors(),
          devicesStore.fetchClients(),
          devicesStore.fetchGateways()
        ])
      } catch (error) {
        console.error('Error loading form data:', error)
      }
    })

    return {
      loading,
      errors,
      form,
      isEditing,
      DEVICE_TYPES,
      DEVICE_STATUS,
      sectors,
      clients,
      gateways,
      closeModal,
      handleSubmit
    }
  }
}
</script> 