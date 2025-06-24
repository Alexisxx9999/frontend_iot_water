<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Left side -->
      <div class="flex items-center space-x-4">
        <!-- Mobile menu button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Search -->
        <div class="hidden sm:block relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            class="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Date and Time -->
        <div class="hidden md:flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon class="w-4 h-4" />
          <span>{{ currentDate }}</span>
          <span class="text-gray-300">|</span>
          <ClockIcon class="w-4 h-4" />
          <span>{{ currentTime }}</span>
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <BellIcon class="w-6 h-6" />
            <span
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 h-5 w-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
            >
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </button>

          <!-- Notifications dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div class="px-4 py-2 border-b border-gray-100">
              <h3 class="text-sm font-medium text-gray-900">Notificaciones</h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div class="flex items-start space-x-3">
                  <div
                    class="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    :class="{
                      'bg-success-500': notification.type === 'success',
                      'bg-warning-500': notification.type === 'warning',
                      'bg-danger-500': notification.type === 'error',
                      'bg-primary-500': notification.type === 'info'
                    }"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ notification.message }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-2 border-t border-gray-100">
              <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        </div>

        <!-- User menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-water-600 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ userInitials }}</span>
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userRole }}</p>
            </div>
            <ChevronDownIcon class="hidden sm:block w-4 h-4 text-gray-400" />
          </button>

          <!-- User dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userEmail }}</p>
            </div>
            <div class="py-1">
              <router-link
                to="/app/profile"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <UserIcon class="w-4 h-4 mr-3" />
                Mi Perfil
              </router-link>
              <router-link
                to="/app/settings"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Cog6ToothIcon class="w-4 h-4 mr-3" />
                Configuración
              </router-link>
            </div>
            <div class="border-t border-gray-100 py-1">
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global overlay for dropdowns -->
    <div
      v-if="showNotifications || showUserMenu"
      class="fixed inset-0 z-30"
      @click="closeDropdowns"
    ></div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { useLogout } from '@/utils/navigation.js'

export default {
  name: 'TopNavbar',
  components: {
    Bars3Icon,
    MagnifyingGlassIcon,
    BellIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    CalendarIcon,
    ClockIcon
  },
  emits: ['toggle-sidebar'],
  setup() {
    const router = useRouter()
    const { logout } = useLogout()
    
    const showNotifications = ref(false)
    const showUserMenu = ref(false)
    const notificationCount = ref(3)
    const currentDate = ref('')
    const currentTime = ref('')
    
    // User data
    const userData = ref({
      name: 'Juan Pérez',
      email: 'juan.perez@iotwater.com',
      role: 'Administrador'
    })
    
    const userName = computed(() => userData.value.name)
    const userEmail = computed(() => userData.value.email)
    const userRole = computed(() => userData.value.role)
    const userInitials = computed(() => {
      return userName.value
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
    })
    
    // Update date and time
    const updateDateTime = () => {
      const now = new Date()
      currentDate.value = now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      currentTime.value = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    }
    
    // Simulated notifications
    const notifications = ref([
      {
        id: 1,
        type: 'warning',
        title: 'Dispositivo offline',
        message: 'El sensor en la zona norte ha perdido conexión',
        time: 'Hace 5 minutos'
      },
      {
        id: 2,
        type: 'success',
        title: 'Incidente resuelto',
        message: 'Se ha solucionado el problema de presión en la línea principal',
        time: 'Hace 1 hora'
      },
      {
        id: 3,
        type: 'info',
        title: 'Nueva denuncia',
        message: 'Se ha recibido una nueva denuncia ciudadana',
        time: 'Hace 2 horas'
      }
    ])
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
      showUserMenu.value = false
    }
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
      showNotifications.value = false
    }
    
    const closeDropdowns = () => {
      showNotifications.value = false
      showUserMenu.value = false
    }
    
    const handleLogout = async () => {
      try {
        closeDropdowns()
        await logout()
      } catch (error) {
        console.error('Error durante el logout:', error)
      }
    }
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        closeDropdowns()
      }
    }
    
    onMounted(() => {
      updateDateTime()
      setInterval(updateDateTime, 1000)
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      showNotifications,
      showUserMenu,
      notificationCount,
      notifications,
      currentDate,
      currentTime,
      userName,
      userEmail,
      userRole,
      userInitials,
      toggleNotifications,
      toggleUserMenu,
      closeDropdowns,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
// Animaciones para dropdowns
.absolute {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Scrollbar para notificaciones
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
