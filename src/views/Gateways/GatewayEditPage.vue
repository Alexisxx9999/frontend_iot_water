<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Editar Gateway</h1>
            <p class="mt-2 text-sm text-gray-600">
              Modificar información del gateway {{ gateway?.code }}
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

      <!-- Loading -->
      <div v-if="loading" class="bg-white shadow rounded-lg p-8">
        <div class="flex items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-gray-600">Cargando gateway...</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-white shadow rounded-lg p-8">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Error al cargar el gateway</h3>
          <p class="mt-2 text-sm text-gray-600">{{ error }}</p>
          <div class="mt-6">
            <router-link
              to="/app/gateways"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Volver al listado
            </router-link>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <div v-else class="bg-white shadow rounded-lg">
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
              {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useGatewaysStore } from '@/stores/gateways'

export default {
  name: 'GatewayEditPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { showToast } = useToast()
    
    const loading = ref(true)
    const error = ref(null)
    const gateway = ref(null)
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

    const loadGateway = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Simular llamada a API para obtener el gateway
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Buscar el gateway correcto en el array global (mock)
        let foundGateway = null
        if (window && window.__GATEWAYS__) {
          foundGateway = window.__GATEWAYS__.find(g => g.id == route.params.id)
        }
        if (!foundGateway) {
          error.value = 'No se encontró el gateway solicitado'
          return
        }
        gateway.value = foundGateway
        // Llenar el formulario
        form.code = foundGateway.code
        form.address = foundGateway.address
        form.latitude = foundGateway.latitude
        form.longitude = foundGateway.longitude
        form.altitude = foundGateway.altitude
        form.installationDate = foundGateway.installationDate
        form.status = foundGateway.status
        form.description = foundGateway.description || ''
        form.dataUrl = foundGateway.dataUrl || ''
        
      } catch (err) {
        error.value = 'No se pudo cargar la información del gateway'
        console.error('Error loading gateway:', err)
      } finally {
        loading.value = false
      }
    }

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
        errors.address = 'La dirección es requerida'
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

    // Actualizar el gateway en memoria tras editar (mock)
    const updateGatewayInList = () => {
      // Buscar el array de gateways en window (solo para mock/demo)
      if (window && window.__GATEWAYS__) {
        const idx = window.__GATEWAYS__.findIndex(g => g.id == route.params.id)
        if (idx > -1) {
          window.__GATEWAYS__[idx] = { ...window.__GATEWAYS__[idx], ...form }
        }
      }
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      isSubmitting.value = true
      
      try {
        await gatewaysStore.updateItem(gateway.value.id, { ...form })
        // Actualizar el array global para el mock
        if (window && window.__GATEWAYS__) {
          const idx = window.__GATEWAYS__.findIndex(g => g.id == gateway.value.id)
          if (idx > -1) {
            window.__GATEWAYS__[idx] = { ...window.__GATEWAYS__[idx], ...form }
          }
        }
        window.showSimpleToast('Gateway editado correctamente', 'success')
        router.push('/app/gateways')
      } catch (error) {
        window.showSimpleToast('Error al editar el gateway', 'error')
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(() => {
      loadGateway()
    })

    return {
      gateway,
      loading,
      error,
      form,
      errors,
      isSubmitting,
      handleSubmit
    }
  }
}
</script> 