<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 shadow-xl border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col bg-white"
    :class="[
      isCollapsed ? 'w-20' : 'w-64',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]"
  >
    <!-- Sidebar Header (Logo + Nombre + Botón colapsar) -->
    <div class="sidebar-logo flex items-center justify-between h-24 px-4 border-b border-gray-100" style="background:#0ea5e9;">
      <div class="flex items-center justify-center flex-1">
        <img src="@/assets/images/logo.png" alt="IoT Water Logo" class="h-12 w-auto object-contain drop-shadow" />
        <transition name="fade">
          <span v-if="!isCollapsed" class="ml-3 text-2xl font-bold text-white select-none">IoT Water</span>
        </transition>
      </div>
      <!-- Único botón de colapsar/expandir -->
      <button
        v-if="!isMobile"
        @click="toggleCollapse"
        class="ml-2 p-2 rounded-md text-white hover:bg-white/10 transition-colors"
        :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
      >
        <font-awesome-icon :icon="['fas', 'bars']" class="w-6 h-6" style="color: #fff; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
      <div v-for="item in sidebarMenuItems" :key="item.id" class="space-y-1">
        <!-- Menu Item without children -->
        <router-link 
          v-if="!item.children || item.children.length === 0" 
          :to="item.route" 
          class="group flex items-center px-3 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200"
          :class="isActiveItem(item) 
            ? 'bg-gray-100 text-[#23272f] border-r-4 border-gray-300' 
            : 'text-[#23272f] hover:bg-gray-50 hover:text-[#23272f]'"
          @click="handleMenuClick(item)"
        >
          <component 
            :is="getMenuIcon(item.icon)" 
            class="w-5 h-5 flex-shrink-0 icon-center"
            :class="[isActiveItem(item) ? 'text-[#23272f]' : 'text-[#8b95a5] group-hover:text-[#23272f]', isCollapsed ? 'mx-auto' : 'mr-3']"
          />
          <span v-if="!isCollapsed" class="truncate">{{ item.title }}</span>
          <span 
            v-if="item.badge && !isCollapsed" 
            class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="isActiveItem(item) 
              ? 'bg-gray-200 text-[#23272f]' 
              : 'bg-gray-100 text-[#23272f]'"
          >
            {{ item.badge }}
          </span>
        </router-link>

        <!-- Menu Item with children -->
        <div v-else>
          <button
            @click="handleParentMenuClick(item)"
            class="group w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200"
            :class="isActiveItem(item) 
              ? 'bg-gray-100 text-[#23272f]' 
              : 'text-[#23272f] hover:bg-gray-50 hover:text-[#23272f]'"
          >
            <div class="flex items-center w-full">
              <component 
                :is="getMenuIcon(item.icon)" 
                class="w-5 h-5 flex-shrink-0 icon-center"
                :class="[isActiveItem(item) ? 'text-[#23272f]' : 'text-[#8b95a5] group-hover:text-[#23272f]', isCollapsed ? 'mx-auto' : 'mr-3']"
              />
              <span v-if="!isCollapsed" class="truncate">{{ item.title }}</span>
            </div>
            <ChevronDownIcon 
              v-if="!isCollapsed"
              class="w-4 h-4 transition-transform duration-200 text-[#23272f]"
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
              class="group flex items-center px-5 py-2 text-[15px] rounded-lg transition-all duration-200 ml-2"
              :class="isCurrentRoute(child.route) 
                ? 'bg-gray-50 text-[#23272f]' 
                : 'text-[#23272f] hover:bg-gray-50 hover:text-[#23272f]'"
            >
              <div class="w-1.5 h-1.5 rounded-full mr-3"
                :class="isCurrentRoute(child.route) ? 'bg-[#23272f]' : 'bg-gray-300 group-hover:bg-[#23272f]'"
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
  ArrowRightOnRectangleIcon,
  ServerStackIcon
} from '@heroicons/vue/24/outline'
import { sidebarMenuItems, useSidebarState, useNavigation, useLogout } from '@/utils/navigation.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
    ArrowRightOnRectangleIcon,
    FontAwesomeIcon
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
        person: UserGroupIcon,
        network: ServerStackIcon // Para Gateways
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
