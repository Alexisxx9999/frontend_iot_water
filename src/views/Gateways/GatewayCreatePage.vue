<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Crear Gateway</h1>
            <p class="mt-2 text-sm text-gray-600">
              Agregar un nuevo gateway al sistema IoT
            </p>
          </div>
          <router-link
            to="/app/gateways"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver al listado
          </router-link>
        </div>
      </div>

      <!-- Formulario -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Información del Gateway</h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Código -->
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">
              Código <span class="text-red-500">*</span>
            </label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.code }"
              placeholder="GW-001"
            />
            <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>
          </div>

          <!-- Dirección no exacta -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">
              Dirección no exacta <span class="text-red-500">*</span>
            </label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.address }"
              placeholder="Av. Principal 123, Quito"
            />
            <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
          </div>

          <!-- Latitud -->
          <div>
            <label for="latitude" class="block text-sm font-medium text-gray-700">
              Latitud <span class="text-red-500">*</span>
            </label>
            <input
              id="latitude"
              v-model="form.latitude"
              type="number"
              step="any"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.latitude }"
              placeholder="Ej: -0.1807"
            />
            <p v-if="errors.latitude" class="mt-1 text-sm text-red-600">{{ errors.latitude }}</p>
          </div>

          <!-- Longitud -->
          <div>
            <label for="longitude" class="block text-sm font-medium text-gray-700">
              Longitud <span class="text-red-500">*</span>
            </label>
            <input
              id="longitude"
              v-model="form.longitude"
              type="number"
              step="any"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.longitude }"
              placeholder="Ej: -78.4678"
            />
            <p v-if="errors.longitude" class="mt-1 text-sm text-red-600">{{ errors.longitude }}</p>
          </div>

          <!-- Altitud -->
          <div>
            <label for="altitude" class="block text-sm font-medium text-gray-700">
              Altitud (msnm)
            </label>
            <input
              id="altitude"
              v-model="form.altitude"
              type="number"
              step="any"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ej: 2850"
            />
          </div>

          <!-- Fecha de instalación -->
          <div>
            <label for="installationDate" class="block text-sm font-medium text-gray-700">
              Fecha de instalación <span class="text-red-500">*</span>
            </label>
            <input
              id="installationDate"
              v-model="form.installationDate"
              type="date"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.installationDate }"
            />
            <p v-if="errors.installationDate" class="mt-1 text-sm text-red-600">{{ errors.installationDate }}</p>
          </div>

          <!-- Estado -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">
              Estado <span class="text-red-500">*</span>
            </label>
            <select
              id="status"
              v-model="form.status"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.status }"
            >
              <option value="">Seleccionar estado</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
          </div>

          <!-- Descripción -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Descripción opcional del gateway"
            ></textarea>
          </div>

          <!-- URL de datos -->
          <div>
            <label for="dataUrl" class="block text-sm font-medium text-gray-700">
              URL para envío de datos
            </label>
            <input
              id="dataUrl"
              v-model="form.dataUrl"
              type="url"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://api.example.com/gateway-data"
            />
            <p class="mt-1 text-sm text-gray-500">
              URL opcional donde se enviarán los datos del gateway
            </p>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link
              to="/app/gateways"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </router-link>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Creando...' : 'Crear Gateway' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

export default {
  name: 'GatewayCreatePage',
  setup() {
    const router = useRouter()
    const { showToast } = useToast()
    
    const isSubmitting = ref(false)
    const errors = reactive({})
    
    const form = reactive({
      code: '',
      address: '',
      latitude: '',
      longitude: '',
      altitude: '',
      installationDate: '',
      status: '',
      description: '',
      dataUrl: ''
    })

    const validateForm = () => {
      errors.code = ''
      errors.address = ''
      errors.latitude = ''
      errors.longitude = ''
      errors.installationDate = ''
      errors.status = ''
      
      if (!form.code.trim()) {
        errors.code = 'El código es requerido'
      }
      
      if (!form.address.trim()) {
        errors.address = 'La dirección no exacta es requerida'
      }

      if (!form.latitude) {
        errors.latitude = 'La latitud es requerida'
      }

      if (!form.longitude) {
        errors.longitude = 'La longitud es requerida'
      }

      if (!form.installationDate) {
        errors.installationDate = 'La fecha de instalación es requerida'
      }
      
      if (!form.status) {
        errors.status = 'El estado es requerido'
      }
      
      return !errors.code && !errors.address && !errors.latitude && !errors.longitude && !errors.installationDate && !errors.status
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      isSubmitting.value = true
      
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Aquí iría la llamada real a la API
        // await gatewayService.createGateway(form)
        
        showToast('Gateway creado exitosamente', 'success')
        
        // Redirigir al listado
        router.push('/app/gateways')
      } catch (error) {
        showToast('Error al crear el gateway', 'error')
        console.error('Error creating gateway:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      errors,
      isSubmitting,
      handleSubmit
    }
  }
}
</script> 