<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-primary-600 to-water-600 rounded-2xl p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">¡Bienvenido de vuelta, {{ userName }}!</h1>
          <p class="text-primary-100 text-lg">Aquí tienes un resumen del estado de tu sistema IoT Water</p>
        </div>
        <div class="hidden lg:block">
          <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.id"
        class="bg-white rounded-xl shadow-soft border border-gray-100 p-6 hover:shadow-medium transition-all duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
            <div class="flex items-center mt-2">
              <component 
                :is="stat.trend === 'up' ? ArrowUpIcon : ArrowDownIcon"
                class="w-4 h-4 mr-1"
                :class="stat.trend === 'up' ? 'text-success-500' : 'text-danger-500'"
              />
              <span 
                class="text-sm font-medium"
                :class="stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'"
              >
                {{ stat.change }}
              </span>
              <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
            </div>
          </div>
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="stat.bgColor"
          >
            <component :is="stat.icon" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Water Consumption Chart -->
      <div class="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Consumo de Agua</h3>
          <select class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Últimos 3 meses</option>
          </select>
        </div>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <ChartBarIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">Gráfico de consumo</p>
            <p class="text-sm text-gray-400">Integración con Chart.js</p>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Estado del Sistema</h3>
        <div class="space-y-4">
          <div 
            v-for="status in systemStatus" 
            :key="status.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-3 h-3 rounded-full"
                :class="status.status === 'online' ? 'bg-success-500' : 'bg-danger-500'"
              ></div>
              <div>
                <p class="font-medium text-gray-900">{{ status.name }}</p>
                <p class="text-sm text-gray-500">{{ status.description }}</p>
              </div>
            </div>
            <span 
              class="text-sm font-medium px-2 py-1 rounded-full"
              :class="status.status === 'online' ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'"
            >
              {{ status.status === 'online' ? 'En línea' : 'Offline' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Ver todas
        </button>
      </div>
      <div class="space-y-4">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id"
          class="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="activity.bgColor"
          >
            <component :is="activity.icon" class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ activity.description }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
          </div>
          <div class="flex-shrink-0">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="activity.badgeClass"
            >
              {{ activity.badge }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          v-for="action in quickActions" 
          :key="action.id"
          @click="action.handler"
          class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
        >
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
            :class="action.bgColor"
          >
            <component :is="action.icon" class="w-6 h-6 text-white" />
          </div>
          <span class="text-sm font-medium text-gray-900 group-hover:text-primary-700">
            {{ action.label }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  PlusIcon,
  MapIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import { useLogout } from '@/utils/navigation.js'

export default {
  name: 'DashboardOverview',
  components: {
    DevicePhoneMobileIcon,
    ExclamationTriangleIcon,
    UsersIcon,
    DocumentTextIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ChartBarIcon,
    PlusIcon,
    MapIcon,
    BellIcon
  },
  setup() {
    const router = useRouter()
    const { logout } = useLogout()

    // User data
    const userData = ref({
      name: 'Juan Pérez'
    })

    const userName = computed(() => userData.value.name)

    // Stats data
    const stats = ref([
      {
        id: 1,
        label: 'Dispositivos Activos',
        value: '24',
        change: '+12%',
        trend: 'up',
        icon: DevicePhoneMobileIcon,
        bgColor: 'bg-primary-500'
      },
      {
        id: 2,
        label: 'Incidentes Activos',
        value: '3',
        change: '-25%',
        trend: 'down',
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-warning-500'
      },
      {
        id: 3,
        label: 'Clientes Registrados',
        value: '156',
        change: '+8%',
        trend: 'up',
        icon: UsersIcon,
        bgColor: 'bg-success-500'
      },
      {
        id: 4,
        label: 'Denuncias Pendientes',
        value: '8',
        change: '+15%',
        trend: 'up',
        icon: DocumentTextIcon,
        bgColor: 'bg-danger-500'
      }
    ])

    // System status
    const systemStatus = ref([
      {
        id: 1,
        name: 'Servidor Principal',
        description: 'Sistema de monitoreo central',
        status: 'online'
      },
      {
        id: 2,
        name: 'Base de Datos',
        description: 'Almacenamiento de datos',
        status: 'online'
      },
      {
        id: 3,
        name: 'API Gateway',
        description: 'Comunicación con dispositivos',
        status: 'online'
      },
      {
        id: 4,
        name: 'Sistema de Alertas',
        description: 'Notificaciones automáticas',
        status: 'offline'
      }
    ])

    // Recent activity
    const recentActivity = ref([
      {
        id: 1,
        title: 'Nuevo dispositivo conectado',
        description: 'Sensor de presión en la zona norte',
        time: 'Hace 5 minutos',
        icon: DevicePhoneMobileIcon,
        bgColor: 'bg-success-500',
        badge: 'Nuevo',
        badgeClass: 'bg-success-100 text-success-800'
      },
      {
        id: 2,
        title: 'Incidente reportado',
        description: 'Fuga detectada en línea principal',
        time: 'Hace 15 minutos',
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-warning-500',
        badge: 'Urgente',
        badgeClass: 'bg-warning-100 text-warning-800'
      },
      {
        id: 3,
        title: 'Nuevo cliente registrado',
        description: 'María González - Sector Este',
        time: 'Hace 1 hora',
        icon: UsersIcon,
        bgColor: 'bg-primary-500',
        badge: 'Nuevo',
        badgeClass: 'bg-primary-100 text-primary-800'
      },
      {
        id: 4,
        title: 'Denuncia procesada',
        description: 'Problema de presión resuelto',
        time: 'Hace 2 horas',
        icon: DocumentTextIcon,
        bgColor: 'bg-success-500',
        badge: 'Resuelto',
        badgeClass: 'bg-success-100 text-success-800'
      }
    ])

    // Quick actions
    const quickActions = ref([
      {
        id: 1,
        label: 'Agregar Dispositivo',
        icon: PlusIcon,
        bgColor: 'bg-primary-500',
        handler: () => router.push('/app/devices')
      },
      {
        id: 2,
        label: 'Ver Mapa',
        icon: MapIcon,
        bgColor: 'bg-success-500',
        handler: () => router.push('/app/map')
      },
      {
        id: 3,
        label: 'Nuevo Incidente',
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-warning-500',
        handler: () => router.push('/app/incidents')
      },
      {
        id: 4,
        label: 'Configurar Alertas',
        icon: BellIcon,
        bgColor: 'bg-danger-500',
        handler: () => console.log('Configurar alertas')
      }
    ])

    return {
      userName,
      stats,
      systemStatus,
      recentActivity,
      quickActions
    }
  }
}
</script>

<style lang="scss" scoped>
// Animaciones personalizadas
.hover\:shadow-medium:hover {
  transform: translateY(-2px);
}

// Transiciones suaves
.transition-all {
  transition: all 0.2s ease-in-out;
}

// Efectos de hover para las tarjetas
.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

// Animación para los badges
.badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
