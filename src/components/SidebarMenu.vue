<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col"
    :class="[
      isCollapsed ? 'w-20' : 'w-64',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-water-600">
      <router-link to="/app/dashboard" class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
          </svg>
        </div>
        <span v-if="!isCollapsed" class="text-lg font-bold text-white">IoT Water</span>
      </router-link>
      <!-- Botón para colapsar/expandir -->
      <button 
        @click="toggleCollapse"
        class="hidden lg:flex p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-2"
        :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
      >
        <svg v-if="!isCollapsed" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5" /></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" /></svg>
      </button>
      <!-- Close button for mobile -->
      <button 
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
      <div v-for="item in sidebarMenuItems" :key="item.id" class="space-y-1">
        <!-- Menu Item without children -->
        <router-link 
          v-if="!item.children || item.children.length === 0" 
          :to="item.route" 
          class="group flex items-center px-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
          :class="isActiveItem(item) 
            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          @click="handleMenuClick(item)"
        >
          <component 
            :is="getMenuIcon(item.icon)" 
            class="w-5 h-5 flex-shrink-0 icon-center"
            :class="[isActiveItem(item) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500', isCollapsed ? 'mx-auto' : 'mr-3']"
          />
          <span v-if="!isCollapsed" class="truncate">{{ item.title }}</span>
          <span 
            v-if="item.badge && !isCollapsed" 
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
            @click="handleParentMenuClick(item)"
            class="group w-full flex items-center justify-between px-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :class="isActiveItem(item) 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          >
            <div class="flex items-center w-full">
              <component 
                :is="getMenuIcon(item.icon)" 
                class="w-5 h-5 flex-shrink-0 icon-center"
                :class="[isActiveItem(item) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500', isCollapsed ? 'mx-auto' : 'mr-3']"
              />
              <span v-if="!isCollapsed" class="truncate">{{ item.title }}</span>
            </div>
            <ChevronDownIcon 
              v-if="!isCollapsed"
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isSubmenuExpanded(item.id) }"
            />
          </button>

          <!-- Submenu -->
          <div 
            v-if="item.children && item.children.length > 0 && !isCollapsed"
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
  emits: ['toggle-sidebar', 'collapsed-change'],
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
        // No hacer nada aquí, el manejo es en handleParentMenuClick
        return
      } else {
        setActiveItem(item.id)
        emit('toggle-sidebar')
      }
    }

    // Manejar clic en ítems con submenú
    const handleParentMenuClick = (item) => {
      if (isCollapsed.value) {
        // Si está colapsado, redirigir a la ruta principal
        if (item.route) {
          router.push(item.route)
        }
      } else {
        toggleSubmenu(item.id)
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

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
      emit('collapsed-change', isCollapsed.value)
    }

    return {
      isCollapsed,
      toggleCollapse,
      sidebarMenuItems,
      getMenuIcon,
      isActiveItem,
      handleMenuClick,
      handleParentMenuClick,
      isSubmenuExpanded,
      toggleSubmenu,
      isCurrentRoute
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

.sidebar-collapsed {
  width: 5rem !important;
}

.icon-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
