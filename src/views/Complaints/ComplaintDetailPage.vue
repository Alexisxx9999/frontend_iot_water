<template>
  <div class="complaint-detail-page">
    <div class="container mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Detalles de la Queja</h1>
        <p class="text-gray-600">Información completa de la queja seleccionada</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Complaint Details -->
      <div v-else-if="complaint" class="bg-white rounded-lg shadow-md p-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Información Básica</h2>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-600">ID de Queja:</label>
                <p class="text-gray-800">{{ complaint.id }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Estado:</label>
                <span :class="getStatusClass(complaint.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ complaint.status }}
                </span>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Prioridad:</label>
                <span :class="getPriorityClass(complaint.priority)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ complaint.priority }}
                </span>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Fecha de Creación:</label>
                <p class="text-gray-800">{{ formatDate(complaint.createdAt) }}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Información del Cliente</h2>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-600">Cliente:</label>
                <p class="text-gray-800">{{ complaint.customerName }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Teléfono:</label>
                <p class="text-gray-800">{{ complaint.customerPhone }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Email:</label>
                <p class="text-gray-800">{{ complaint.customerEmail }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Dirección:</label>
                <p class="text-gray-800">{{ complaint.customerAddress }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Descripción del Problema</h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-gray-800">{{ complaint.description }}</p>
          </div>
        </div>

        <!-- Updates -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Actualizaciones</h2>
          <div class="space-y-4">
            <div v-for="update in complaint.updates" :key="update.id" class="border-l-4 border-blue-500 pl-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-gray-800">{{ update.message }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ update.author }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(update.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button @click="goBack" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Volver
          </button>
          <button @click="editComplaint" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Editar
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600">No se pudo cargar la información de la queja</p>
        <button @click="loadComplaint" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Reintentar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/date'

export default {
  name: 'ComplaintDetailPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const complaint = ref(null)
    const loading = ref(true)

    const loadComplaint = async () => {
      try {
        loading.value = true
        // Aquí se haría la llamada a la API para obtener los detalles de la queja
        // Por ahora usamos datos mock
        const complaintId = route.params.id
        
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        complaint.value = {
          id: complaintId,
          status: 'En Proceso',
          priority: 'Alta',
          createdAt: new Date(),
          customerName: 'Juan Pérez',
          customerPhone: '+593 99 123 4567',
          customerEmail: 'juan.perez@email.com',
          customerAddress: 'Av. Amazonas 123, Quito',
          description: 'El cliente reporta que no tiene agua desde hace 3 días. Ha intentado contactar al servicio al cliente pero no han respondido.',
          updates: [
            {
              id: 1,
              message: 'Queja registrada y asignada al técnico Carlos Mendoza',
              author: 'Sistema',
              timestamp: new Date(Date.now() - 86400000)
            },
            {
              id: 2,
              message: 'Técnico asignado ha revisado el caso y programado visita para mañana',
              author: 'Carlos Mendoza',
              timestamp: new Date(Date.now() - 43200000)
            }
          ]
        }
      } catch (error) {
        console.error('Error loading complaint:', error)
        complaint.value = null
      } finally {
        loading.value = false
      }
    }

    const getStatusClass = (status) => {
      const classes = {
        'Pendiente': 'bg-yellow-100 text-yellow-800',
        'En Proceso': 'bg-blue-100 text-blue-800',
        'Resuelto': 'bg-green-100 text-green-800',
        'Cerrado': 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getPriorityClass = (priority) => {
      const classes = {
        'Baja': 'bg-green-100 text-green-800',
        'Media': 'bg-yellow-100 text-yellow-800',
        'Alta': 'bg-red-100 text-red-800',
        'Crítica': 'bg-purple-100 text-purple-800'
      }
      return classes[priority] || 'bg-gray-100 text-gray-800'
    }

    const goBack = () => {
      router.go(-1)
    }

    const editComplaint = () => {
      // Navegar a la página de edición
      router.push(`/complaints/${route.params.id}/edit`)
    }

    onMounted(() => {
      loadComplaint()
    })

    return {
      complaint,
      loading,
      loadComplaint,
      getStatusClass,
      getPriorityClass,
      goBack,
      editComplaint,
      formatDate
    }
  }
}
</script>

<style scoped>
.complaint-detail-page {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>
