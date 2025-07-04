<template>
  <div class="notifications-page">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">🔔 Notificaciones y Alertas</h1>
          <p class="text-gray-600 mt-1">Gestiona todas las notificaciones y alertas del sistema</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="markAllAsRead"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="!hasUnreadNotifications"
          >
            ✅ Marcar todo como leído
          </button>
          <button 
            @click="showSettings = true"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ⚙️ Configuración
          </button>
        </div>
      </div>
    </div>

    <div class="flex h-full">
      <!-- Sidebar de filtros -->
      <div class="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <!-- Filtros -->
        <div class="space-y-6">
          <!-- Búsqueda -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">🔍 Búsqueda</h3>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en notificaciones..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <!-- Filtro por tipo -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">📋 Tipo</h3>
            <div class="space-y-2">
              <label 
                v-for="type in notificationTypes" 
                :key="type.value"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  v-model="selectedTypes" 
                  :value="type.value"
                  class="rounded border-gray-300"
                >
                <span class="text-sm text-gray-700">{{ type.label }}</span>
                <span 
                  v-if="type.count > 0"
                  class="ml-auto px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {{ type.count }}
                </span>
              </label>
            </div>
          </div>

          <!-- Filtro por estado -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">📊 Estado</h3>
            <div class="space-y-2">
              <label 
                v-for="status in notificationStatuses" 
                :key="status.value"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  v-model="selectedStatuses" 
                  :value="status.value"
                  class="rounded border-gray-300"
                >
                <span class="text-sm text-gray-700">{{ status.label }}</span>
                <span 
                  v-if="status.count > 0"
                  class="ml-auto px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {{ status.count }}
                </span>
              </label>
            </div>
          </div>

          <!-- Filtro por fecha -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">📅 Fecha</h3>
            <select 
              v-model="dateFilter"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="custom">Personalizado</option>
            </select>
            
            <div v-if="dateFilter === 'custom'" class="mt-3 space-y-2">
              <input 
                type="date" 
                v-model="customStartDate"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
              <input 
                type="date" 
                v-model="customEndDate"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
            </div>
          </div>

          <!-- Acciones en lote -->
          <div v-if="selectedNotifications.length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">📦 Acciones en Lote</h3>
            <div class="space-y-2">
              <button 
                @click="markSelectedAsRead"
                class="w-full py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                ✅ Marcar como leído
              </button>
              <button 
                @click="archiveSelected"
                class="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                📁 Archivar
              </button>
              <button 
                @click="deleteSelected"
                class="w-full py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de notificaciones -->
      <div class="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div v-if="loading" class="text-center py-12">
          <div class="text-4xl mb-4">⏳</div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Cargando notificaciones...</h2>
        </div>

        <div v-else-if="filteredNotifications.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📭</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">No hay notificaciones</h2>
          <p class="text-gray-600">No se encontraron notificaciones con los filtros aplicados</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="notification in filteredNotifications" 
            :key="notification.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            :class="{ 'border-l-4 border-l-blue-500': !notification.leida }"
            @click="openNotification(notification)"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <!-- Icono de tipo -->
                <div class="flex-shrink-0">
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    :class="getNotificationIconClass(notification.tipo)"
                  >
                    {{ getNotificationIcon(notification.tipo) }}
                  </div>
                </div>

                <!-- Contenido -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ notification.titulo }}</h3>
                    <span 
                      v-if="!notification.leida"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Nuevo
                    </span>
                    <span 
                      v-if="notification.prioridad === 'CRITICA'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      Crítica
                    </span>
                  </div>
                  
                  <p class="text-gray-600 mb-2">{{ notification.mensaje }}</p>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{{ formatDate(notification.fechaCreacion) }}</span>
                    <span>{{ notification.canalPreferidoEnviado }}</span>
                    <span v-if="notification.metadata?.sector">Sector: {{ notification.metadata.sector }}</span>
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="selectedNotifications" 
                  :value="notification.id"
                  @click.stop
                  class="rounded border-gray-300"
                >
                <button 
                  @click.stop="toggleNotificationActions(notification.id)"
                  class="p-1 text-gray-400 hover:text-gray-600"
                >
                  ⋮
                </button>
              </div>
            </div>

            <!-- Acciones desplegables -->
            <div 
              v-if="expandedNotifications.has(notification.id)"
              class="mt-4 pt-4 border-t border-gray-200"
            >
              <div class="flex items-center space-x-2">
                <button 
                  v-if="!notification.leida"
                  @click="markAsRead(notification.id)"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  ✅ Marcar como leído
                </button>
                <button 
                  v-else
                  @click="markAsUnread(notification.id)"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  📌 Marcar como no leído
                </button>
                <button 
                  v-if="!notification.archivada"
                  @click="archiveNotification(notification.id)"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  📁 Archivar
                </button>
                <button 
                  v-else
                  @click="unarchiveNotification(notification.id)"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  📂 Desarchivar
                </button>
                <button 
                  @click="deleteNotification(notification.id)"
                  class="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center">
          <nav class="flex items-center space-x-2">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <span class="px-3 py-2 text-sm text-gray-700">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal de configuración -->
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">⚙️ Configuración de Alertas</h2>
            <button 
              @click="showSettings = false"
              class="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <AlertsConfiguration />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import AlertsConfiguration from '@/components/notifications/AlertsConfiguration.vue'

export default {
  name: 'NotificationsPage',
  components: {
    AlertsConfiguration
  },
  setup() {
    const notificationsStore = useNotificationsStore()
    
    // Estado reactivo
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedTypes = ref([])
    const selectedStatuses = ref([])
    const dateFilter = ref('all')
    const customStartDate = ref('')
    const customEndDate = ref('')
    const selectedNotifications = ref([])
    const expandedNotifications = ref(new Set())
    const showSettings = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(20)

    // Configuraciones
    const notificationTypes = [
      { value: 'ALERTA_DISPOSITIVO', label: 'Alerta de Dispositivo', count: 0 },
      { value: 'NUEVA_DENUNCIA', label: 'Nueva Denuncia', count: 0 },
      { value: 'INCIDENTE_ACTUALIZADO', label: 'Incidente Actualizado', count: 0 },
      { value: 'MANTENIMIENTO_PROGRAMADO', label: 'Mantenimiento Programado', count: 0 },
      { value: 'CONSUMO_ANORMAL', label: 'Consumo Anormal', count: 0 },
      { value: 'BATERIA_BAJA', label: 'Batería Baja', count: 0 }
    ]

    const notificationStatuses = [
      { value: 'unread', label: 'No leídas', count: 0 },
      { value: 'read', label: 'Leídas', count: 0 },
      { value: 'archived', label: 'Archivadas', count: 0 }
    ]

    // Computed properties
    const filteredNotifications = computed(() => {
      let filtered = notificationsStore.notifications

      // Filtro por búsqueda
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(n => 
          n.titulo.toLowerCase().includes(query) || 
          n.mensaje.toLowerCase().includes(query)
        )
      }

      // Filtro por tipo
      if (selectedTypes.value.length > 0) {
        filtered = filtered.filter(n => selectedTypes.value.includes(n.tipo))
      }

      // Filtro por estado
      if (selectedStatuses.value.length > 0) {
        filtered = filtered.filter(n => {
          if (selectedStatuses.value.includes('unread')) return !n.leida
          if (selectedStatuses.value.includes('read')) return n.leida && !n.archivada
          if (selectedStatuses.value.includes('archived')) return n.archivada
          return true
        })
      }

      // Filtro por fecha
      if (dateFilter.value !== 'all') {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
        filtered = filtered.filter(n => {
          const notificationDate = new Date(n.fechaCreacion)
          
          switch (dateFilter.value) {
            case 'today':
              return notificationDate >= today
            case 'week':
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
              return notificationDate >= weekAgo
            case 'month':
              const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
              return notificationDate >= monthAgo
            case 'custom':
              if (customStartDate.value && customEndDate.value) {
                const start = new Date(customStartDate.value)
                const end = new Date(customEndDate.value)
                return notificationDate >= start && notificationDate <= end
              }
              return true
            default:
              return true
          }
        })
      }

      return filtered
    })

    const paginatedNotifications = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredNotifications.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredNotifications.value.length / itemsPerPage.value)
    })

    const hasUnreadNotifications = computed(() => {
      return notificationsStore.notifications.some(n => !n.leida)
    })

    // Methods
    const loadNotifications = async () => {
      loading.value = true
      try {
        await notificationsStore.loadNotifications()
      } catch (error) {
        console.error('Error cargando notificaciones:', error)
      } finally {
        loading.value = false
      }
    }

    const markAsRead = async (notificationId) => {
      await notificationsStore.markAsRead(notificationId)
      expandedNotifications.value.delete(notificationId)
    }

    const markAsUnread = async (notificationId) => {
      await notificationsStore.markAsUnread(notificationId)
      expandedNotifications.value.delete(notificationId)
    }

    const archiveNotification = async (notificationId) => {
      await notificationsStore.archiveNotification(notificationId)
      expandedNotifications.value.delete(notificationId)
    }

    const unarchiveNotification = async (notificationId) => {
      await notificationsStore.unarchiveNotification(notificationId)
      expandedNotifications.value.delete(notificationId)
    }

    const deleteNotification = async (notificationId) => {
      if (confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
        await notificationsStore.deleteNotification(notificationId)
        expandedNotifications.value.delete(notificationId)
      }
    }

    const markAllAsRead = async () => {
      await notificationsStore.markAllAsRead()
    }

    const markSelectedAsRead = async () => {
      await notificationsStore.markMultipleAsRead(selectedNotifications.value)
      selectedNotifications.value = []
    }

    const archiveSelected = async () => {
      await notificationsStore.archiveMultiple(selectedNotifications.value)
      selectedNotifications.value = []
    }

    const deleteSelected = async () => {
      if (confirm(`¿Estás seguro de que quieres eliminar ${selectedNotifications.value.length} notificaciones?`)) {
        await notificationsStore.deleteMultiple(selectedNotifications.value)
        selectedNotifications.value = []
      }
    }

    const openNotification = (notification) => {
      // Marcar como leída si no lo está
      if (!notification.leida) {
        markAsRead(notification.id)
      }

      // Navegar a la página correspondiente si hay metadata
      if (notification.metadata) {
        if (notification.metadata.dispositivoId) {
          // Navegar a dispositivo
          // router.push(`/app/devices/${notification.metadata.dispositivoId}`)
        } else if (notification.metadata.incidenteId) {
          // Navegar a incidente
          // router.push(`/app/incidents/${notification.metadata.incidenteId}`)
        }
      }
    }

    const toggleNotificationActions = (notificationId) => {
      if (expandedNotifications.value.has(notificationId)) {
        expandedNotifications.value.delete(notificationId)
      } else {
        expandedNotifications.value.add(notificationId)
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const getNotificationIcon = (tipo) => {
      const iconMap = {
        'ALERTA_DISPOSITIVO': '📱',
        'NUEVA_DENUNCIA': '📋',
        'INCIDENTE_ACTUALIZADO': '⚠️',
        'MANTENIMIENTO_PROGRAMADO': '🔧',
        'CONSUMO_ANORMAL': '💧',
        'BATERIA_BAJA': '🔋'
      }
      return iconMap[tipo] || '📢'
    }

    const getNotificationIconClass = (tipo) => {
      const classMap = {
        'ALERTA_DISPOSITIVO': 'bg-red-100 text-red-600',
        'NUEVA_DENUNCIA': 'bg-blue-100 text-blue-600',
        'INCIDENTE_ACTUALIZADO': 'bg-yellow-100 text-yellow-600',
        'MANTENIMIENTO_PROGRAMADO': 'bg-green-100 text-green-600',
        'CONSUMO_ANORMAL': 'bg-purple-100 text-purple-600',
        'BATERIA_BAJA': 'bg-orange-100 text-orange-600'
      }
      return classMap[tipo] || 'bg-gray-100 text-gray-600'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Lifecycle
    onMounted(() => {
      loadNotifications()
    })

    return {
      loading,
      searchQuery,
      selectedTypes,
      selectedStatuses,
      dateFilter,
      customStartDate,
      customEndDate,
      selectedNotifications,
      expandedNotifications,
      showSettings,
      currentPage,
      totalPages,
      notificationTypes,
      notificationStatuses,
      filteredNotifications: paginatedNotifications,
      hasUnreadNotifications,
      markAsRead,
      markAsUnread,
      archiveNotification,
      unarchiveNotification,
      deleteNotification,
      markAllAsRead,
      markSelectedAsRead,
      archiveSelected,
      deleteSelected,
      openNotification,
      toggleNotificationActions,
      previousPage,
      nextPage,
      getNotificationIcon,
      getNotificationIconClass,
      formatDate
    }
  }
}
</script>

<style scoped>
.notifications-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style> 