import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Configuración del menú lateral
export const sidebarMenuItems = [
  // Eliminado: CRM
  {
    id: 'devices',
    title: 'Dispositivos',
    icon: 'devices',
    route: '/app/devices',
    badge: null
  },
  // Eliminados: map, complaints, incidents
  // Aquí reemplazo 'Personal' por 'Nodos'
  {
    title: 'Nodos',
    icon: 'mdi-access-point-network', // Cambia el icono si usas otro set
    route: '/app/nodes',
    badge: null
  },
  {
    id: 'roles',
    title: 'Roles',
    icon: 'person',
    route: '/app/roles',
    badge: null
  },
  {
    id: 'personnel',
    title: 'Personal',
    icon: 'people',
    route: '/app/personnel',
    badge: null
  },
  {
    id: 'homecrud',
    title: 'Quienes Somos',
    icon: 'reports',
    route: '/app/home',
    badge: null
  },
  // Eliminado: notifications
  {
    id: 'gateways',
    title: 'Gateways',
    icon: 'network',
    route: '/app/gateways',
    badge: null
  },
  {
    id: 'lecturas',
    title: 'Lecturas',
    icon: 'report',
    route: '/app/lecturas',
    badge: null
  },
  {
    id: 'sectors',
    title: 'Sectores',
    icon: 'map',
    route: '/app/sectors',
    badge: null
  }
];

// Estado del menú lateral
export const useSidebarState = () => {
  const isCollapsed = ref(false);
  const activeItem = ref('dashboard');

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  const setActiveItem = (itemId) => {
    activeItem.value = itemId;
  };

  return {
    isCollapsed,
    activeItem,
    toggleSidebar,
    setActiveItem
  };
};

// Funciones de navegación
export const useNavigation = () => {
  const router = useRouter();

  const navigateTo = (route) => {
    router.push(route);
  };

  const navigateToHome = () => {
    router.push('/app/dashboard');
  };

  const navigateToAuth = () => {
    router.push('/auth/login');
  };

  const goBack = () => {
    router.go(-1);
  };

  const isCurrentRoute = (route) => {
    return router.currentRoute.value.path === route;
  };

  const isRouteActive = (route) => {
    return router.currentRoute.value.path.startsWith(route);
  };

  return {
    navigateTo,
    navigateToHome,
    navigateToAuth,
    goBack,
    isCurrentRoute,
    isRouteActive
  };
};

// Funciones de logout
export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      console.log('Iniciando proceso de logout...');

      // Aquí puedes agregar la lógica de logout (limpiar tokens, etc.)
      // await authService.logout();

      // Limpiar datos del usuario del store si usas Pinia/Vuex
      // store.dispatch('auth/logout');

      // Limpiar localStorage si tienes tokens guardados
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      console.log('Datos de sesión limpiados, redirigiendo al login...');

      // Redirigir al login
      await router.push('/auth/login');

      console.log('Logout completado exitosamente');
    } catch (error) {
      console.error('Error durante el logout:', error);
      // Aún así, intentar redirigir al login
      try {
        await router.push('/auth/login');
      } catch (redirectError) {
        console.error('Error al redirigir al login:', redirectError);
      }
    }
  };

  return {
    logout
  };
};

// Utilidades para el menú
export const getMenuIcon = (iconName) => {
  const iconMap = {
    dashboard: '📊',
    devices: '📱',
    warning: '⚠️',
    people: '👥',
    report: '📋',
    map: '🗺️',
    person: '👤',
    reports: '📈',
    notifications: '🔔',
    network: '🛜'
  };

  return iconMap[iconName] || '📄';
};

export const getBreadcrumbs = (route) => {
  const breadcrumbMap = {
    '/app/dashboard': ['Dashboard'],
    '/app/devices': ['Dispositivos', 'Lista'],
    '/app/incidents': ['Gestión de Problemas'],
    '/app/crm/clients': ['CRM', 'Clientes'],
    '/app/crm/conversations': ['CRM', 'Conversaciones'],
    '/app/complaints': ['Denuncias Ciudadanas'],
    '/app/map': ['Mapa'],
    '/app/personnel': ['Personal'],
    '/app/reports': ['Reportes'],
    '/app/notifications': ['Notificaciones']
  };

  return breadcrumbMap[route] || ['Inicio'];
};
