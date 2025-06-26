<template>
  <div class="personnel-page space-y-8">
    <!-- Stats Grid con animaciones -->
    <div class="stats-section">
      <PersonnelStats :stats="stats" />
    </div>

    <!-- Main Content Grid -->
    <div class="main-content-grid">
      <!-- Employee List -->
      <div class="employee-list-section">
        <PersonnelList
          :employees="employees"
          :filtered-employees="filteredEmployees"
          :role-tabs="roleTabs"
          :active-tab="activeTab"
          :search-query="searchQuery"
          :selected-employee="selectedEmployee"
          @select-employee="selectEmployee"
          @set-active-tab="setActiveTab"
          @update:search-query="searchQuery = $event"
        >
          <!-- Slot para el botón de nuevo empleado -->
          <template #new-employee-btn>
            <button 
              @click="showNewPersonnelModal = true"
              class="new-employee-btn"
            >
              <PlusIcon class="w-4 h-4 mr-1" />
              Nuevo
            </button>
          </template>

          <!-- Slot para el icono de búsqueda -->
          <template #search-icon>
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </template>

          <!-- Slot para el badge de rol -->
          <template #role-badge="{ employee }">
            <span 
              class="role-badge"
              :class="getRoleBadgeClass(employee.role)"
            >
              {{ getRoleName(employee.role) }}
            </span>
          </template>

          <!-- Slot para el icono de estrella -->
          <template #star-icon>
            <StarIcon class="w-3 h-3 text-yellow-400" />
          </template>
        </PersonnelList>
      </div>

      <!-- Employee Details -->
      <div class="employee-details-section" v-if="selectedEmployee">
        <PersonnelDetails 
          :selected-employee="selectedEmployee"
          @edit="handleEditEmployee"
          @print="handlePrintEmployee"
        >
          <!-- Slot para el badge de rol -->
          <template #role-badge="{ employee }">
            <span 
              class="role-badge-large"
              :class="getRoleBadgeClass(employee.role)"
            >
              {{ getRoleName(employee.role) }}
            </span>
          </template>

          <!-- Slot para el icono de editar -->
          <template #edit-icon>
            <PencilIcon class="w-4 h-4 mr-1" />
          </template>

          <!-- Slot para el icono de imprimir -->
          <template #print-icon>
            <PrinterIcon class="w-4 h-4 mr-1" />
          </template>

          <!-- Contenido de los tabs -->
          <PersonnelTabs 
            :active-tab="activeProfileTab"
            @set-active-tab="activeProfileTab = $event"
          >
            <!-- Tab de Información (unido con Roles y Permisos) -->
            <div v-if="activeProfileTab === 'info'">
              <PersonnelPermissions
                :permissions="selectedEmployee.permissions || defaultPermissions"
                :skills="selectedEmployee.skills || []"
              />
            </div>
            <!-- Tab de Historial -->
            <div v-if="activeProfileTab === 'history'">
              <PersonnelHistory
                :history="employeeHistory"
                :page="1"
                :total-pages="1"
              />
            </div>
            <!-- Tab de Interacción -->
            <div v-if="activeProfileTab === 'interaction'">
              <PersonnelInteraction
                :satisfaction="selectedEmployee.customerSatisfaction"
                :response-time="selectedEmployee.responseTime"
                :resolved-cases="selectedEmployee.resolvedCases"
                :total-interactions="selectedEmployee.totalInteractions"
                :average-rating="selectedEmployee.averageRating"
                :average-resolution-time="selectedEmployee.averageResolutionTime"
              />
            </div>
            <!-- Tab de Entrenamiento IA -->
            <div v-if="activeProfileTab === 'ai'">
              <PersonnelAI :contributions="aiContributions" />
            </div>
          </PersonnelTabs>
        </PersonnelDetails>
      </div>
    </div>

    <!-- Modal Nuevo Empleado -->
    <NewPersonnelModal 
      :show="showNewPersonnelModal"
      @close="showNewPersonnelModal = false"
      @save="handleNewPersonnelCreated"
    >
      <template #header-icon>
        <UserPlusIcon class="w-6 h-6" />
      </template>
      <template #close-icon>
        <XMarkIcon class="w-6 h-6" />
      </template>
    </NewPersonnelModal>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

// Importar componentes modulares
import PersonnelStats from '@/components/personnel/PersonnelStats.vue';
import PersonnelList from '@/components/personnel/PersonnelList.vue';
import PersonnelDetails from '@/components/personnel/PersonnelDetails.vue';
import PersonnelTabs from '@/components/personnel/PersonnelTabs.vue';
import PersonnelHistory from '@/components/personnel/PersonnelHistory.vue';
import PersonnelInteraction from '@/components/personnel/PersonnelInteraction.vue';
import PersonnelAI from '@/components/personnel/PersonnelAI.vue';
import PersonnelPermissions from '@/components/personnel/PersonnelPermissions.vue';
import NewPersonnelModal from '@/components/personnel/NewPersonnelModal.vue';

// Importar iconos
import {
  PlusIcon,
  MagnifyingGlassIcon,
  StarIcon,
  PencilIcon,
  PrinterIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  XMarkIcon,
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/vue/24/outline';

export default {
  components: {
    PersonnelStats,
    PersonnelList,
    PersonnelDetails,
    PersonnelTabs,
    PersonnelHistory,
    PersonnelInteraction,
    PersonnelAI,
    PersonnelPermissions,
    NewPersonnelModal,
    PlusIcon,
    MagnifyingGlassIcon,
    StarIcon,
    PencilIcon,
    PrinterIcon,
    ArrowUpTrayIcon,
    ArrowDownTrayIcon,
    UserPlusIcon,
    XMarkIcon,
    UsersIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BriefcaseIcon
  },
  setup() {
    // Estado de la aplicación
    const employees = ref([
      {
        id: 1,
        name: "María Rodríguez",
        firstName: "María",
        lastName: "Rodríguez",
        photo: "https://randomuser.me/api/portraits/women/32.jpg",
        role: "technical",
        position: "Ingeniera de Sistemas",
        rating: 4.8,
        experience: "3 años",
        employeeId: "EMP-2020-032",
        department: "Tecnología",
        startDate: "15 Mar 2020",
        email: "maria.rodriguez@empresa.com",
        phone: "+1 555 123 4567",
        location: "Oficina Central",
        skills: ["JavaScript", "Python", "SQL", "AWS", "Docker", "Análisis de Datos"],
        customerSatisfaction: 92,
        responseTime: 85,
        resolvedCases: 88,
        totalInteractions: 147,
        averageRating: 4.8,
        averageResolutionTime: 2.4,
        salary: "3,200"
      },
      {
        id: 2,
        name: "Carlos Méndez",
        firstName: "Carlos",
        lastName: "Méndez",
        photo: "https://randomuser.me/api/portraits/men/45.jpg",
        role: "admin",
        position: "Gerente Financiero",
        rating: 4.5,
        experience: "5 años",
        employeeId: "EMP-2018-015",
        department: "Finanzas",
        startDate: "10 Ene 2018",
        email: "carlos.mendez@empresa.com",
        phone: "+1 555 987 6543",
        location: "Oficina Central",
        skills: ["Contabilidad", "Finanzas", "Excel", "Análisis Financiero"],
        customerSatisfaction: 85,
        responseTime: 75,
        resolvedCases: 90,
        totalInteractions: 92,
        averageRating: 4.5,
        averageResolutionTime: 3.2,
        salary: "4,500"
      },
      {
        id: 3,
        name: "Laura Sánchez",
        firstName: "Laura",
        lastName: "Sánchez",
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
        role: "service",
        position: "Supervisora de Servicio",
        rating: 4.9,
        experience: "2 años",
        employeeId: "EMP-2021-078",
        department: "Servicio al Cliente",
        startDate: "20 May 2021",
        email: "laura.sanchez@empresa.com",
        phone: "+1 555 456 7890",
        location: "Oficina Central",
        skills: ["Comunicación", "Resolución de Problemas", "CRM", "Ventas"],
        customerSatisfaction: 95,
        responseTime: 90,
        resolvedCases: 92,
        totalInteractions: 215,
        averageRating: 4.9,
        averageResolutionTime: 1.8,
        salary: "2,800"
      },
      {
        id: 4,
        name: "Juan Pérez",
        firstName: "Juan",
        lastName: "Pérez",
        photo: "https://randomuser.me/api/portraits/men/22.jpg",
        role: "technical",
        position: "Desarrollador Senior",
        rating: 4.7,
        experience: "4 años",
        employeeId: "EMP-2019-042",
        department: "Tecnología",
        startDate: "12 Ago 2019",
        email: "juan.perez@empresa.com",
        phone: "+1 555 789 0123",
        location: "Oficina Central",
        skills: ["Java", "Spring", "React", "Microservicios", "Kubernetes"],
        customerSatisfaction: 89,
        responseTime: 80,
        resolvedCases: 85,
        totalInteractions: 132,
        averageRating: 4.7,
        averageResolutionTime: 2.7,
        salary: "3,800"
      }
    ]);

    // Estado de la UI
    const selectedEmployee = ref(employees.value[0]);
    const activeTab = ref("all");
    const activeProfileTab = ref("info");
    const searchQuery = ref("");
    const showNewPersonnelModal = ref(false);

    // Configuración de tabs
    const roleTabs = ref([
      { value: 'all', label: 'Todos' },
      { value: 'technical', label: 'Técnico' },
      { value: 'admin', label: 'Admin' },
      { value: 'service', label: 'Servicio' }
    ]);

    // Stats data
    const stats = ref([
      {
        id: 1,
        label: 'Total Empleados',
        value: '24',
        change: '+12%',
        trend: 'up',
        icon: UsersIcon,
        bgColor: 'bg-primary-500'
      },
      {
        id: 2,
        label: 'Técnicos Activos',
        value: '8',
        change: '+5%',
        trend: 'up',
        icon: AcademicCapIcon,
        bgColor: 'bg-success-500'
      },
      {
        id: 3,
        label: 'Administrativos',
        value: '6',
        change: '+2%',
        trend: 'up',
        icon: BriefcaseIcon,
        bgColor: 'bg-warning-500'
      },
      {
        id: 4,
        label: 'Servicio al Cliente',
        value: '10',
        change: '+8%',
        trend: 'up',
        icon: UserGroupIcon,
        bgColor: 'bg-danger-500'
      }
    ]);

    // Datos para los componentes
    const employeeActivities = ref([
      {
        id: 1,
        title: 'Completó tarea de mantenimiento',
        description: 'Revisión del sistema de filtrado en la zona norte',
        time: 'Hace 2 horas',
        icon: 'WrenchScrewdriverIcon',
        iconBg: 'bg-blue-500'
      },
      {
        id: 2,
        title: 'Reporte de incidente',
        description: 'Detectó anomalía en el sensor de presión',
        time: 'Hace 1 día',
        icon: 'ExclamationTriangleIcon',
        iconBg: 'bg-yellow-500'
      },
      {
        id: 3,
        title: 'Capacitación completada',
        description: 'Curso de seguridad industrial',
        time: 'Hace 3 días',
        icon: 'AcademicCapIcon',
        iconBg: 'bg-green-500'
      }
    ]);

    const employeeDocuments = ref([
      {
        id: 1,
        name: 'Contrato de trabajo.pdf',
        size: '2.3 MB',
        date: '15 Ene 2024',
        type: 'contract',
        icon: 'DocumentTextIcon',
        typeBg: 'bg-blue-500'
      },
      {
        id: 2,
        name: 'Certificado médico.pdf',
        size: '1.8 MB',
        date: '10 Ene 2024',
        type: 'medical',
        icon: 'DocumentTextIcon',
        typeBg: 'bg-green-500'
      },
      {
        id: 3,
        name: 'Certificado de capacitación.pdf',
        size: '3.1 MB',
        date: '05 Ene 2024',
        type: 'training',
        icon: 'DocumentTextIcon',
        typeBg: 'bg-purple-500'
      },
      {
        id: 4,
        name: 'Evaluación de desempeño.pdf',
        size: '1.2 MB',
        date: '01 Ene 2024',
        type: 'performance',
        icon: 'DocumentTextIcon',
        typeBg: 'bg-orange-500'
      }
    ]);

    const performanceMetrics = ref([
      {
        id: 1,
        label: 'Productividad',
        value: '92%',
        change: '+5%',
        trend: 'up',
        icon: 'ChartBarIcon',
        bgColor: 'bg-blue-500'
      },
      {
        id: 2,
        label: 'Calidad',
        value: '88%',
        change: '+3%',
        trend: 'up',
        icon: 'StarIcon',
        bgColor: 'bg-green-500'
      },
      {
        id: 3,
        label: 'Puntualidad',
        value: '95%',
        change: '+2%',
        trend: 'up',
        icon: 'ClockIcon',
        bgColor: 'bg-purple-500'
      }
    ]);

    const employeeSkills = ref([
      { id: 1, name: 'Mantenimiento', level: 9, color: 'bg-blue-500' },
      { id: 2, name: 'Troubleshooting', level: 8, color: 'bg-green-500' },
      { id: 3, name: 'Comunicación', level: 7, color: 'bg-purple-500' },
      { id: 4, name: 'Liderazgo', level: 6, color: 'bg-orange-500' }
    ]);

    const employeeEvaluations = ref([
      { id: 1, title: 'Evaluación Trimestral', date: 'Ene 2024', score: 92 },
      { id: 2, title: 'Evaluación de Seguridad', date: 'Dic 2023', score: 88 },
      { id: 3, title: 'Evaluación de Habilidades', date: 'Nov 2023', score: 85 }
    ]);

    const defaultPermissions = [
      { id: 'dashboardAccess', label: 'Acceso al Dashboard', enabled: true },
      { id: 'reportsAccess', label: 'Generar Reportes', enabled: true },
      { id: 'settingsAccess', label: 'Configuración del Sistema', enabled: false },
      { id: 'userManagement', label: 'Gestión de Usuarios', enabled: false },
      { id: 'technicalAccess', label: 'Acceso Técnico', enabled: true }
    ];

    const employeeHistory = ref([
      { id: 1, date: "15 Jun 2023 - 10:15", type: "Login", module: "Sistema", details: "Inicio de sesión exitoso" },
      { id: 2, date: "15 Jun 2023 - 10:30", type: "Actualización", module: "Incidentes", details: "Actualizó estado de INC-2023-1567" },
      { id: 3, date: "14 Jun 2023 - 15:45", type: "Creación", module: "Documentación", details: "Creó nuevo manual técnico" },
      { id: 4, date: "14 Jun 2023 - 11:20", type: "Reporte", module: "Errores", details: "Generó reporte de errores mensual" },
      { id: 5, date: "13 Jun 2023 - 09:10", type: "Configuración", module: "Sistema", details: "Actualizó parámetros de red" }
    ]);

    const aiContributions = ref([
      { id: 1, date: "14 Jun 2023", type: "Solución Técnica", interactions: 27, improvement: "+12% precisión" },
      { id: 2, date: "10 Jun 2023", type: "Flujo de Trabajo", interactions: 15, improvement: "+8% eficiencia" },
      { id: 3, date: "5 Jun 2023", type: "Respuestas FAQ", interactions: 42, improvement: "+15% relevancia" }
    ]);

    // Computed properties
    const filteredEmployees = computed(() => {
      let filtered = employees.value;
      
      // Filtrar por rol
      if (activeTab.value !== "all") {
        filtered = filtered.filter(emp => emp.role === activeTab.value);
      }
      
      // Filtrar por búsqueda
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(emp => 
          emp.name.toLowerCase().includes(query) || 
          emp.position.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    });

    // Métodos
    const selectEmployee = (employee) => {
      selectedEmployee.value = employee;
      activeProfileTab.value = 'info';
    };

    const setActiveTab = (tab) => {
      activeTab.value = tab;
    };

    const handleEditEmployee = () => {
      console.log('Editar empleado:', selectedEmployee.value);
    };

    const handlePrintEmployee = () => {
      console.log('Imprimir empleado:', selectedEmployee.value);
    };

    const handleNewPersonnelCreated = (newEmployee) => {
      employees.value.push(newEmployee);
      showNewPersonnelModal.value = false;
    };

    const getRoleBadgeClass = (role) => {
      const classes = {
        'admin': 'bg-red-100 text-red-800',
        'manager': 'bg-blue-100 text-blue-800',
        'technician': 'bg-green-100 text-green-800',
        'operator': 'bg-yellow-100 text-yellow-800',
        'supervisor': 'bg-purple-100 text-purple-800'
      };
      return classes[role] || 'bg-gray-100 text-gray-800';
    };

    const getRoleName = (role) => {
      const names = {
        'admin': 'Administrador',
        'manager': 'Gerente',
        'technician': 'Técnico',
        'operator': 'Operador',
        'supervisor': 'Supervisor'
      };
      return names[role] || role;
    };

    onMounted(() => {
      // Sin partículas para mejor rendimiento
    });

    return {
      employees,
      selectedEmployee,
      activeTab,
      activeProfileTab,
      searchQuery,
      showNewPersonnelModal,
      stats,
      roleTabs,
      employeeHistory,
      aiContributions,
      defaultPermissions,
      filteredEmployees,
      roleTabs,
      selectEmployee,
      setActiveTab,
      handleEditEmployee,
      handlePrintEmployee,
      handleNewPersonnelCreated,
      getRoleBadgeClass,
      getRoleName
    };
  }
};
</script>

<style scoped>
.personnel-page {
  position: relative;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 1rem;
  color: #232b3b;
}

.stats-section {
  margin-bottom: 1.5rem;
}

.main-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 1024px) {
  .main-content-grid {
    grid-template-columns: 1fr 3fr;
    gap: 2rem;
  }
}

.employee-list-section, .employee-details-section {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.2rem 1rem;
}

.new-employee-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.7rem 1.1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  cursor: pointer;
}
.new-employee-btn:hover {
  background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
  box-shadow: 0 4px 16px rgba(139,92,246,0.12);
  transform: translateY(-1px);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  color: #6366f1;
  margin-right: 0.3rem;
}
.role-badge-large {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.1rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 500;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  color: #6366f1;
}

:deep(.bg-white) {
  background: #fff !important;
  color: #232b3b !important;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
:deep(.shadow-lg) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
:deep(.rounded-2xl) {
  border-radius: 1rem;
}
:deep(.text-gray-900) {
  color: #232b3b !important;
}
:deep(.text-gray-600) {
  color: #64748b !important;
}
:deep(.text-gray-400) {
  color: #94a3b8 !important;
}
:deep(.text-success-500) {
  color: #22c55e !important;
}
:deep(.text-danger-500) {
  color: #ef4444 !important;
}
:deep(.text-success-600) {
  color: #16a34a !important;
}
:deep(.text-danger-600) {
  color: #b91c1c !important;
}
:deep(.bg-success-500) {
  background: #22c55e !important;
}
:deep(.bg-danger-500) {
  background: #ef4444 !important;
}
:deep(.bg-primary-600) {
  background: #6366f1 !important;
}
:deep(.bg-primary-700) {
  background: #4f46e5 !important;
}
:deep(.bg-blue-100) {
  background: #dbeafe !important;
  color: #2563eb !important;
}
:deep(.bg-red-100) {
  background: #fee2e2 !important;
  color: #dc2626 !important;
}
:deep(.bg-green-100) {
  background: #d1fae5 !important;
  color: #059669 !important;
}
:deep(.bg-yellow-100) {
  background: #fef9c3 !important;
  color: #ca8a04 !important;
}
:deep(.bg-purple-100) {
  background: #ede9fe !important;
  color: #7c3aed !important;
}
:deep(.bg-gray-100) {
  background: #f1f5f9 !important;
  color: #64748b !important;
}
:deep(.text-yellow-400) {
  color: #facc15 !important;
}
:deep(.text-blue-800) {
  color: #1e40af !important;
}
:deep(.text-red-800) {
  color: #b91c1c !important;
}
:deep(.text-green-800) {
  color: #166534 !important;
}
:deep(.text-purple-800) {
  color: #6d28d9 !important;
}
:deep(.text-gray-800) {
  color: #334155 !important;
}

@media (max-width: 768px) {
  .personnel-page {
    padding: 0.75rem;
  }
  .main-content-grid {
    gap: 1rem;
  }
  .employee-list-section, .employee-details-section {
    padding: 0.7rem 0.5rem;
  }
}
@media (max-width: 480px) {
  .personnel-page {
    padding: 0.5rem;
  }
  .main-content-grid {
    gap: 0.75rem;
  }
}
</style>