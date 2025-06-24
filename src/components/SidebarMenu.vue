<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
    :class="{
      'translate-x-0': isMobileOpen,
      '-translate-x-full': !isMobileOpen
    }"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-water-600">
      <router-link to="/app/dashboard" class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
          </svg>
        </div>
        <span class="text-lg font-bold text-white">IoT Water</span>
      </router-link>
      
      <!-- Close button for mobile -->
      <button 
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <div v-for="item in sidebarMenuItems" :key="item.id" class="space-y-1">
        <!-- Menu Item without children -->
        <router-link 
          v-if="!item.children || item.children.length === 0" 
          :to="item.route" 
          class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
          :class="isActiveItem(item) 
            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          @click="handleMenuClick(item)"
        >
          <component 
            :is="getMenuIcon(item.icon)" 
            class="w-5 h-5 mr-3 flex-shrink-0"
            :class="isActiveItem(item) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'"
          />
          <span class="truncate">{{ item.title }}</span>
          <span 
            v-if="item.badge" 
            class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="isActiveItem(item) 
              ? 'bg-primary-100 text-primary-800' 
              : 'bg-gray-100 text-gray-600'"
          >
            {{ item.badge }}
          </span>
        </router-link>

        <!-- Menu Item with children -->
        <div v-else>
          <button
            @click="toggleSubmenu(item.id)"
            class="group w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :class="isActiveItem(item) 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          >
            <div class="flex items-center">
              <component 
                :is="getMenuIcon(item.icon)" 
                class="w-5 h-5 mr-3 flex-shrink-0"
                :class="isActiveItem(item) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'"
              />
              <span class="truncate">{{ item.title }}</span>
            </div>
            <ChevronDownIcon 
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isSubmenuExpanded(item.id) }"
            />
          </button>

          <!-- Submenu -->
          <div 
            v-if="item.children && item.children.length > 0"
            class="mt-1 space-y-1 overflow-hidden transition-all duration-200"
            :class="{ 'max-h-0': !isSubmenuExpanded(item.id), 'max-h-96': isSubmenuExpanded(item.id) }"
          >
            <router-link
              v-for="child in item.children"
              :key="child.id"
              :to="child.route"
              class="group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ml-8"
              :class="isCurrentRoute(child.route) 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <div class="w-1.5 h-1.5 rounded-full mr-3"
                :class="isCurrentRoute(child.route) ? 'bg-primary-600' : 'bg-gray-300 group-hover:bg-gray-400'"
              ></div>
              <span class="truncate">{{ child.title }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-water-600 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium text-white">A</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">Administrador</p>
          <p class="text-xs text-gray-500 truncate">admin@iotwater.com</p>
        </div>
        <button 
          @click="handleLogout"
          class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Cerrar sesión"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeIcon, 
  UsersIcon, 
  DevicePhoneMobileIcon, 
  MapIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon, 
  UserGroupIcon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { sidebarMenuItems, useSidebarState, useNavigation, useLogout } from '@/utils/navigation.js'

export default {
  name: 'SidebarMenu',
  components: {
    HomeIcon,
    UsersIcon,
    DevicePhoneMobileIcon,
    MapIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    UserGroupIcon,
    XMarkIcon,
    ChevronDownIcon,
    ArrowRightOnRectangleIcon
  },
  props: {
    isMobileOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const route = useRoute()
    const router = useRouter()
    const { isCollapsed, activeItem, setActiveItem } = useSidebarState()
    const { isCurrentRoute, isRouteActive } = useNavigation()
    const { logout } = useLogout()

    // Estado para submenús expandidos
    const expandedSubmenus = ref(new Set())

    // Determinar si un elemento del menú está activo
    const isActiveItem = (item) => {
      if (item.children && item.children.length > 0) {
        return item.children.some(child => isCurrentRoute(child.route))
      }
      return isCurrentRoute(item.route) || isRouteActive(item.route)
    }

    // Manejar clic en elementos del menú
    const handleMenuClick = (item) => {
      if (item.children && item.children.length > 0) {
        toggleSubmenu(item.id)
      } else {
        setActiveItem(item.id)
        emit('toggle-sidebar')
      }
    }

    // Verificar si un submenú está expandido
    const isSubmenuExpanded = (itemId) => {
      return expandedSubmenus.value.has(itemId)
    }

    // Toggle submenú
    const toggleSubmenu = (itemId) => {
      if (expandedSubmenus.value.has(itemId)) {
        expandedSubmenus.value.delete(itemId)
      } else {
        expandedSubmenus.value.add(itemId)
      }
    }

    // Expandir automáticamente submenús cuando la ruta actual pertenece a ellos
    const autoExpandSubmenus = () => {
      sidebarMenuItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          const hasActiveChild = item.children.some(child =>
            isCurrentRoute(child.route) || isRouteActive(child.route)
          )
          if (hasActiveChild) {
            expandedSubmenus.value.add(item.id)
          }
        }
      })
    }

    // Manejar logout
    const handleLogout = async () => {
      try {
        await logout()
      } catch (error) {
        console.error('Error durante el logout:', error)
      }
    }

    // Obtener ícono del menú
    const getMenuIcon = (iconName) => {
      const iconMap = {
        dashboard: HomeIcon,
        people: UsersIcon,
        devices: DevicePhoneMobileIcon,
        map: MapIcon,
        report: DocumentTextIcon,
        warning: ExclamationTriangleIcon,
        person: UserGroupIcon
      }
      return iconMap[iconName] || HomeIcon
    }

    // Observar cambios en la ruta para actualizar el estado
    watch(() => route.path, () => {
      autoExpandSubmenus()
    }, { immediate: true })

    return {
      sidebarMenuItems,
      isCollapsed,
      activeItem,
      expandedSubmenus,
      isActiveItem,
      handleMenuClick,
      isSubmenuExpanded,
      isCurrentRoute,
      getMenuIcon,
      toggleSubmenu,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
// Scrollbar personalizada para el sidebar
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

// Animaciones suaves
.group:hover .group-hover\:text-gray-500 {
  transition: color 0.2s ease;
}

// Transiciones para submenús
.max-h-0 {
  transition: max-height 0.3s ease-out;
}

.max-h-96 {
  transition: max-height 0.3s ease-in;
}
</style>
