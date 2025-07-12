<template>
  <header class="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-sm">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Left side -->
      <div class="flex items-center space-x-4">
        <!-- Mobile menu button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-md text-[#23272f] hover:text-[#23272f] hover:bg-gray-100 transition-colors"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Search -->
        <div class="hidden sm:block relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-[#23272f]" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            class="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-[#f6f7fb] placeholder-[#8b95a5] text-[#23272f] focus:outline-none focus:placeholder-[#64748b] focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors shadow-sm"
          />
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Date and Time -->
        <div class="hidden md:flex items-center space-x-2 text-sm text-[#23272f]">
          <CalendarIcon class="w-4 h-4" />
          <span>{{ currentDate }}</span>
          <span class="text-gray-200">|</span>
          <ClockIcon class="w-4 h-4" />
          <span>{{ currentTime }}</span>
        </div>

        <!-- Notifications -->
        <!-- User menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-[#f6f7fb] border border-gray-200 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-[#23272f]">{{ userInitials }}</span>
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-medium text-[#23272f]">{{ userName }}</p>
              <p class="text-xs text-[#23272f]">{{ userRole }}</p>
            </div>
            <ChevronDownIcon class="hidden sm:block w-4 h-4 text-[#23272f]" />
          </button>

          <!-- User dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-[#23272f]">{{ userName }}</p>
              <p class="text-xs text-[#23272f]">{{ userEmail }}</p>
            </div>
            <div class="py-1">
              <router-link
                to="/app/profile"
                class="flex items-center px-4 py-2 text-sm text-[#23272f] hover:bg-gray-50 transition-colors"
              >
                <UserIcon class="w-4 h-4 mr-3" />
                Mi Perfil
              </router-link>
              <router-link
                to="/app/settings"
                class="flex items-center px-4 py-2 text-sm text-[#23272f] hover:bg-gray-50 transition-colors"
              >
                <Cog6ToothIcon class="w-4 h-4 mr-3" />
                Configuración
              </router-link>
            </div>
            <div class="border-t border-gray-100 py-1">
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-[#23272f] hover:bg-gray-50 transition-colors"
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
      v-if="showUserMenu"
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
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { useLogout } from '@/utils/navigation.js'
// import NotificationBell from '@/components/common/NotificationBell.vue'

export default {
  name: 'TopNavbar',
  components: {
    Bars3Icon,
    MagnifyingGlassIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    CalendarIcon,
    ClockIcon,
    // NotificationBell
  },
  emits: ['toggle-sidebar'],
  setup() {
    const router = useRouter()
    const { logout } = useLogout()
    
    const showUserMenu = ref(false)
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
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }
    
    const closeDropdowns = () => {
      showUserMenu.value = false
    }
    
    const handleLogout = async () => {
      try {
        closeDropdowns()
        await logout()
      } catch (error) {
        // console.error('Error durante el logout:', error)
      }
    }
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        closeDropdowns()
      }
    }
    
    // Nueva función para redirigir a notificaciones
    const goToNotificationsPage = () => {
      router.push('/app/notifications')
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
      showUserMenu,
      currentDate,
      currentTime,
      userName,
      userEmail,
      userRole,
      userInitials,
      toggleUserMenu,
      closeDropdowns,
      handleLogout,
      goToNotificationsPage
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
</style>
