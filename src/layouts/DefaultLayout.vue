<template>
  <div class="min-h-screen" style="background:#f4f7fe;">
    <!-- Sidebar -->
    <SidebarMenu 
      :is-mobile-open="isMobileOpen" 
      @toggle-sidebar="toggleMobileSidebar" 
      @collapsed-change="onSidebarCollapsedChange"
    />
    
    <!-- Main Content -->
    <div :class="mainContentClass">
      <!-- Top Navigation -->
      <TopNavbar @toggle-sidebar="toggleMobileSidebar" />
      
      <!-- Page Content -->
      <main class="flex flex-col min-h-screen py-0 px-0">
        <div class="flex-1 flex flex-col">
          <!-- Breadcrumbs -->
          <nav v-if="breadcrumbs.length > 0 && $route.path !== '/app/map' && $route.path !== '/app/complaints'" class="mb-6">
            <ol class="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <router-link to="/app/dashboard" class="hover:text-primary-600 transition-colors">
                  <HomeIcon class="w-4 h-4" />
                </router-link>
              </li>
              <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
                <ChevronRightIcon class="w-4 h-4 mx-2" />
                <router-link 
                  v-if="crumb.path" 
                  :to="crumb.path"
                  class="hover:text-primary-600 transition-colors"
                >
                  {{ crumb.name }}
                </router-link>
                <span v-else class="text-gray-900 font-medium">{{ crumb.name }}</span>
              </li>
            </ol>
          </nav>
          
          <!-- Page Header -->
          <div v-if="pageTitle && $route.path !== '/app/dashboard' && $route.path !== '/app/incidents' && $route.path !== '/app/devices' && $route.path !== '/app/map' && $route.path !== '/app/complaints'" class="mb-8">
            <!-- Título especial para CRM -->
            <div v-if="$route.path.startsWith('/app/crm')" class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-4">
              <div class="flex items-center gap-4">
                <div class="bg-gray-800 bg-opacity-20 rounded-full p-3">
                  <svg xmlns='http://www.w3.org/2000/svg' class='h-8 w-8 text-blue-800' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488'/>
                  </svg>
                </div>
                <div>
                  <h1 class='text-3xl font-bold text-blue-800 mb-1'>Sistema CRM</h1>
                  <p class='text-blue-800 text-lg font-medium'>Centro de Atención al Cliente</p>
                </div>
              </div>
              <div class='mt-4 flex items-center gap-6 text-blue-800'>
                <div class='flex items-center gap-2'>
                  <div class='w-3 h-3 bg-blue-300 rounded-full animate-pulse'></div>
                  <span class='text-sm font-medium'>Sistema Activo</span>
                </div>
                <div class='flex items-center gap-2'>
                  <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4 text-gray-800' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span class='text-sm text-gray-800'>Tiempo de respuesta: 2 min</span>
                </div>
              </div>
            </div>
            
            <!-- Título especial para Personal -->
            <div v-else-if="$route.path.startsWith('/app/personnel')" class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-4">
              <div class="flex items-center gap-4">
                <div class="bg-gray-800 bg-opacity-20 rounded-full p-3">
                  <svg xmlns='http://www.w3.org/2000/svg' class='h-8 w-8 text-blue-800' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488'/>
                  </svg>
                </div>
                <div>
                  <h1 class='text-3xl font-bold text-blue-800 mb-1'>Administración de Personal</h1>
                  <p class='text-blue-800 text-lg font-medium'>Gestión de usuarios y equipos</p>
                </div>
              </div>
              <div class='mt-4 flex items-center gap-6 text-blue-800'>
                <div class='flex items-center gap-2'>
                  <div class='w-3 h-3 bg-blue-300 rounded-full animate-pulse'></div>
                  <span class='text-sm font-medium'>Sistema Activo</span>
                </div>
                <div class='flex items-center gap-2'>
                  <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4 text-gray-800' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span class='text-sm text-gray-800'>Tiempo de respuesta: 2 min</span>
                </div>
              </div>
            </div>
            
            <!-- Título especial para Dispositivos -->
            <div v-else-if="$route.path.startsWith('/app/devices') && $route.path !== '/app/devices/create' && !$route.path.match(/^\/app\/devices\/[\w-]+$/)" class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-4">
              <div class="flex items-center gap-4">
                <div class="bg-gray-800 bg-opacity-20 rounded-full p-3">
                  <svg xmlns='http://www.w3.org/2000/svg' class='h-8 w-8 text-blue-800' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488'/>
                  </svg>
                </div>
                <div>
                  <h1 class='text-3xl font-bold text-blue-800 mb-1'>Gestión de Dispositivos</h1>
                  <p class='text-blue-800 text-lg font-medium'>Monitoreo y control de IoT</p>
                </div>
              </div>
              <div class='mt-4 flex items-center gap-6 text-blue-800'>
                <div class='flex items-center gap-2'>
                  <div class='w-3 h-3 bg-blue-300 rounded-full animate-pulse'></div>
                  <span class='text-sm font-medium'>Sistema Activo</span>
                </div>
                <div class='flex items-center gap-2'>
                  <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4 text-gray-800' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span class='text-sm text-gray-800'>Tiempo de respuesta: 2 min</span>
                </div>
              </div>
            </div>
            
            <!-- Títulos normales para otras páginas -->
            <div v-else>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ pageTitle }}</h1>
              <p v-if="pageDescription" class="text-gray-600">{{ pageDescription }}</p>
            </div>
          </div>
          
          <!-- Router View with Animation -->
          <router-view v-slot="{ Component }">
            <Transition name="page" mode="out-in" appear>
              <component :is="Component" :key="$route.path" class="animate-fade-in" />
            </Transition>
          </router-view>
        </div>
      </main>
    </div>
    
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isMobileOpen" 
      class="fixed inset-0 z-40 lg:hidden"
      @click="toggleMobileSidebar"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>
    </div>
    <ToastContainer />
  </div>
</template>

<script>
import { ref, computed, watch, provide } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import SidebarMenu from '@/components/SidebarMenu.vue'
import TopNavbar from '@/components/TopNavbar.vue'
import { createToastComponent } from '@/composables/useToast'

export default {
  name: 'DefaultLayout',
  components: {
    SidebarMenu,
    TopNavbar,
    HomeIcon,
    ChevronRightIcon,
    ToastContainer: createToastComponent()
  },
  setup() {
    const route = useRoute()
    const isMobileOpen = ref(false)
    const isSidebarCollapsed = ref(false)

    // Toggle mobile sidebar
    const toggleMobileSidebar = () => {
      isMobileOpen.value = !isMobileOpen.value
    }
    // Sidebar colapsado/expandido
    const onSidebarCollapsedChange = (collapsed) => {
      isSidebarCollapsed.value = collapsed
    }

    // Clase dinámica para el contenido principal
    const mainContentClass = computed(() => {
      return [
        'transition-all duration-300',
        isSidebarCollapsed.value ? 'lg:pl-20' : 'lg:pl-64'
      ]
    })

    // Close mobile sidebar when route changes
    watch(() => route.path, () => {
      isMobileOpen.value = false
    })
    
    // Generate breadcrumbs based on current route
    const breadcrumbs = computed(() => {
      const pathSegments = route.path.split('/').filter(Boolean)
      const breadcrumbs = []
      
      let currentPath = ''
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`
        
        // Skip 'app' segment
        if (segment === 'app') return
        
        // Map route segments to readable names
        const nameMap = {
          'dashboard': 'Dashboard',
          'crm': 'CRM',
          'devices': 'Dispositivos',
          'map': 'Mapa',
          'complaints': 'Denuncias',
          'incidents': 'Incidentes',
          'personnel': 'Personal',
          'clients': 'Clientes',
          'conversations': 'Conversaciones',
          'whatsapp': 'WhatsApp',
          'maintenance': 'Mantenimiento'
        }
        
        breadcrumbs.push({
          name: nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
          path: index === pathSegments.length - 1 ? null : currentPath
        })
      })
      
      return breadcrumbs
    })
    
    // Page title and description based on route
    const pageTitle = computed(() => {
      const routeMap = {
        '/app/dashboard': 'Dashboard',
        '/app/crm/whatsapp': 'Sistema CRM',
        '/app/devices': 'Gestión de Dispositivos',
        '/app/map': 'Mapa de Dispositivos',
        '/app/complaints': 'Denuncias Ciudadanas',
        '/app/incidents': 'Gestión de Incidentes',
        '/app/personnel': 'Administración de Personal'
      }
      return routeMap[route.path] || 'Página'
    })
    
    const pageDescription = computed(() => {
      const descriptionMap = {
        '/app/dashboard': 'Panel de control y métricas del sistema IoT Water',
        '/app/crm/whatsapp': 'Centro de Atención al Cliente - Gestión de conversaciones y atención al cliente',
        '/app/devices': 'Monitoreo y control de dispositivos IoT',
        '/app/map': 'Visualización geográfica de dispositivos',
        '/app/complaints': 'Gestión de denuncias y reportes ciudadanos',
        '/app/incidents': 'Seguimiento y resolución de incidentes',
        '/app/personnel': 'Administración del personal y equipos'
      }
      return descriptionMap[route.path] || ''
    })
    
    // Estado global para toast
    const toastMessage = ref('')
    const toastType = ref('info')
    const toastVisible = ref(false)
    function showToast(message, type = 'info', duration = 2000) {
      toastMessage.value = message
      toastType.value = type
      toastVisible.value = true
      setTimeout(() => { toastVisible.value = false }, duration)
    }
    provide('showToast', showToast)
    
    return {
      isMobileOpen,
      toggleMobileSidebar,
      breadcrumbs,
      pageTitle,
      pageDescription,
      onSidebarCollapsedChange,
      mainContentClass,
      toastMessage,
      toastType,
      toastVisible,
      showToast
    }
  }
}
</script>

<style lang="scss" scoped>
// Transiciones de página
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// Animaciones personalizadas
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

// Scrollbar styling
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
