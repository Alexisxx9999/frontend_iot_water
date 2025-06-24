<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <SidebarMenu 
      :is-mobile-open="isMobileOpen" 
      @toggle-sidebar="toggleMobileSidebar" 
    />
    
    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Navigation -->
      <TopNavbar @toggle-sidebar="toggleMobileSidebar" />
      
      <!-- Page Content -->
      <main class="flex flex-col min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto flex-1 flex flex-col">
          <!-- Breadcrumbs -->
          <nav v-if="breadcrumbs.length > 0" class="mb-6">
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
          <div v-if="pageTitle && $route.path !== '/app/devices'" class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ pageTitle }}</h1>
            <p v-if="pageDescription" class="text-gray-600">{{ pageDescription }}</p>
          </div>
          
          <!-- Router View with Animation -->
          <Transition 
            name="page" 
            mode="out-in"
            appear
          >
            <router-view 
              :key="$route.path"
              class="animate-fade-in"
            />
          </Transition>
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
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import SidebarMenu from '@/components/SidebarMenu.vue'
import TopNavbar from '@/components/TopNavbar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    SidebarMenu,
    TopNavbar,
    HomeIcon,
    ChevronRightIcon
  },
  setup() {
    const route = useRoute()
    const isMobileOpen = ref(false)
    
    // Toggle mobile sidebar
    const toggleMobileSidebar = () => {
      isMobileOpen.value = !isMobileOpen.value
    }
    
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
        '/app/crm/whatsapp': 'CRM - WhatsApp Business',
        '/app/devices': 'Gestión de Dispositivos',
        '/app/map': 'Mapa de Dispositivos',
        '/app/complaints': 'Denuncias Ciudadanas',
        '/app/incidents': 'Gestión de Incidentes',
        '/app/personnel': 'Gestión de Personal'
      }
      return routeMap[route.path] || 'Página'
    })
    
    const pageDescription = computed(() => {
      const descriptionMap = {
        '/app/dashboard': 'Panel de control y métricas del sistema IoT Water',
        '/app/crm/whatsapp': 'Gestión de conversaciones y atención al cliente',
        '/app/devices': 'Monitoreo y control de dispositivos IoT',
        '/app/map': 'Visualización geográfica de dispositivos',
        '/app/complaints': 'Gestión de denuncias y reportes ciudadanos',
        '/app/incidents': 'Seguimiento y resolución de incidentes',
        '/app/personnel': 'Administración del personal y equipos'
      }
      return descriptionMap[route.path] || ''
    })
    
    return {
      isMobileOpen,
      toggleMobileSidebar,
      breadcrumbs,
      pageTitle,
      pageDescription
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

// Responsive adjustments
@media (max-width: 1024px) {
  .lg\:pl-64 {
    padding-left: 0;
  }
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
