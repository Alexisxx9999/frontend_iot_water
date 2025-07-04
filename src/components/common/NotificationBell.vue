<template>
  <div class="relative">
    <!-- Botón de notificaciones -->
    <button
      @click="handleBellClick"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      :class="{ 'bg-gray-100': isDropdownOpen }"
    >
      <div class="text-xl">🔔</div>
      
      <!-- Badge de notificaciones no leídas -->
      <div 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
    </button>

    <!-- Dropdown de notificaciones -->
    <div 
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      <!-- Header del dropdown -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">🔔 Notificaciones</h3>
          <div class="flex items-center space-x-2">
            <button 
              @click="markAllAsRead"
              class="text-sm text-blue-600 hover:text-blue-800"
              :disabled="unreadCount === 0"
            >
              Marcar todo como leído
            </button>
            <button 
              @click="goToNotificationsPage"
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              Ver todas
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de notificaciones -->
      <div class="max-h-64 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center">
          <div class="text-2xl mb-2">⏳</div>
          <p class="text-sm text-gray-600">Cargando...</p>
        </div>

        <div v-else-if="recentNotifications.length === 0" class="p-4 text-center">
          <div class="text-3xl mb-2">📭</div>
          <p class="text-sm text-gray-600">No hay notificaciones</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div 
            v-for="notification in recentNotifications" 
            :key="notification.id"
            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50': !notification.leida }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-3">
              <!-- Icono de tipo -->
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  :class="getNotificationIconClass(notification.tipoNotificacion)"
                >
                  {{ getNotificationIcon(notification.tipoNotificacion) }}
                </div>
              </div>

              <!-- Contenido -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ notification.titulo }}
                  </h4>
                  <span 
                    v-if="!notification.leida"
                    class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    Nuevo
                  </span>
                  <span 
                    v-if="notification.prioridad === 'CRITICA'"
                    class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    Crítica
                  </span>
                </div>
                
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ notification.mensaje }}
                </p>
                
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-gray-500">
                    {{ formatTimeAgo(notification.fechaCreacion) }}
                  </span>
                  <div class="flex items-center space-x-1">
                    <button 
                      @click.stop="markAsRead(notification.id)"
                      v-if="!notification.leida"
                      class="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Marcar como leído
                    </button>
                    <button 
                      @click.stop="deleteNotification(notification.id)"
                      class="text-xs text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer del dropdown -->
      <div class="p-3 border-t border-gray-200 bg-gray-50">
        <button 
          @click="goToNotificationsPage"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver todas las notificaciones ({{ totalCount }})
        </button>
      </div>
    </div>

    <!-- Overlay para cerrar dropdown -->
    <div 
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'NotificationBell',
  emits: ['go-to-notifications'],
  setup(props, { emit }) {
    const router = useRouter()
    const notificationsStore = useNotificationsStore()
    
    // Estado reactivo
    const isDropdownOpen = ref(false)
    const loading = ref(false)

    // Computed properties
    const notifications = computed(() => notificationsStore.notifications)
    const unreadCount = computed(() => notificationsStore.unreadCount)
    const totalCount = computed(() => notifications.value.length)
    
    const recentNotifications = computed(() => {
      return notifications.value
        .filter(n => !n.archivada)
        .slice(0, 5) // Mostrar solo las 5 más recientes
    })

    // Methods
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
      if (isDropdownOpen.value) {
        loadNotifications()
      }
    }

    const closeDropdown = () => {
      isDropdownOpen.value = false
    }

    const loadNotifications = async () => {
      if (notifications.value.length === 0) {
        loading.value = true
        try {
          await notificationsStore.loadNotifications()
        } catch (error) {
          console.error('Error cargando notificaciones:', error)
        } finally {
          loading.value = false
        }
      }
    }

    const markAsRead = async (notificationId) => {
      await notificationsStore.markAsRead(notificationId)
    }

    const markAllAsRead = async () => {
      await notificationsStore.markAllAsRead()
    }

    const deleteNotification = async (notificationId) => {
      if (confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
        await notificationsStore.deleteNotification(notificationId)
      }
    }

    const handleNotificationClick = (notification) => {
      // Marcar como leída si no lo está
      if (!notification.leida) {
        markAsRead(notification.id)
      }

      // Cerrar dropdown
      closeDropdown()

      // Navegar a la página correspondiente si hay metadata
      if (notification.metadata) {
        if (notification.metadata.dispositivoId) {
          router.push(`/app/devices/${notification.metadata.dispositivoId}`)
        } else if (notification.metadata.incidenteId) {
          router.push(`/app/incidents/${notification.metadata.incidenteId}`)
        } else if (notification.metadata.denunciaId) {
          router.push(`/app/complaints/${notification.metadata.denunciaId}`)
        }
      }
    }

    const goToNotificationsPage = () => {
      closeDropdown()
      router.push('/app/notifications')
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

    const formatTimeAgo = (date) => {
      const now = new Date()
      const notificationDate = new Date(date)
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Ahora mismo'
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
      
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `Hace ${diffInHours}h`
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `Hace ${diffInDays}d`
      
      return notificationDate.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      })
    }

    // Event listeners
    const handleClickOutside = (event) => {
      if (isDropdownOpen.value && !event.target.closest('.notification-bell')) {
        closeDropdown()
      }
    }

    // Lifecycle
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      loadNotifications()
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const handleBellClick = (event) => {
      emit('go-to-notifications')
    }

    return {
      isDropdownOpen,
      loading,
      unreadCount,
      totalCount,
      recentNotifications,
      toggleDropdown,
      closeDropdown,
      loadNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      handleNotificationClick,
      goToNotificationsPage,
      getNotificationIcon,
      getNotificationIconClass,
      formatTimeAgo,
      handleBellClick
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-bell {
  position: relative;
}
</style> 