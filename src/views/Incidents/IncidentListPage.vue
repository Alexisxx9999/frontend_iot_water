<template>
  <div class="incident-page">
    <!-- Header con animaciones -->
    <div class="header-section">
      <IncidentHeader
        @new-incident="showNewReportModal = true"
        @export-data="handleExportData"
      >
        <template #new-incident-icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </template>
        <template #export-icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </template>
      </IncidentHeader>
    </div>

    <!-- Dashboard Prioridades con animaciones -->
    <div class="stats-section">
      <IncidentStats :stats="statsData" />
    </div>

    <div class="main-content-flex">
      <!-- Sección principal -->
      <div class="incident-list-section">
        <IncidentList
          :incidents="filteredIncidents"
          :tabs="incidentTabs"
          :active-tab="activeIncidentTab"
          :search-query="searchQuery"
          :users="usuarios"
          @select-incident="selectIncident"
          @set-active-tab="activeIncidentTab = $event"
          @update:search-query="searchQuery = $event"
          @assign-technician="asignarTecnico"
        >
          <template #header-icon>
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </template>
          <template #search-icon>
            <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </template>
          <template #filter-icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </template>
          <template #empty-state-icon>
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </template>
        </IncidentList>
      </div>

      <!-- Panel derecho -->
      <div class="sidebar-section">
        <IncidentSidebar
          :team="equipoTecnico"
          :notification-settings="notificationSettings"
          :logbook="bitacoraFiltrada"
          :new-log-entry="nuevaBitacora"
          @assign-personnel="abrirAsignacion"
          @update:notification-settings="notificationSettings = $event"
          @send-notifications="enviarNotificaciones"
          @update:new-log-entry="nuevaBitacora = $event"
          @add-log-entry="agregarBitacora"
        >
          <template #team-icon>
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </template>
          <template #notifications-icon>
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v10a4 4 0 004 4h10a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.81 1.19z"></path>
            </svg>
          </template>
          <template #logbook-icon>
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </template>
        </IncidentSidebar>
      </div>
    </div>

    <!-- Modal Component -->
    <NewIncidentModal 
      :is-visible="showNewReportModal"
      @close="showNewReportModal = false"
      @submit="handleNewIncident"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NewIncidentModal from '@/components/NewIncidentModal.vue';

// Importar componentes modulares
import IncidentHeader from '@/components/incidents/IncidentHeader.vue';
import IncidentStats from '@/components/incidents/IncidentStats.vue';
import IncidentList from '@/components/incidents/IncidentList.vue';
import IncidentSidebar from '@/components/incidents/IncidentSidebar.vue';

// Mock de usuarios (para nombres)
const usuarios = [
  { IdUsuario: 1, nombre: 'Carlos Méndez' },
  { IdUsuario: 2, nombre: 'Laura Sánchez' },
  { IdUsuario: 3, nombre: 'Juan Pérez' },
  { IdUsuario: 4, nombre: 'Roberto Jiménez' },
  { IdUsuario: 5, nombre: 'Daniela Ríos' },
  { IdUsuario: 6, nombre: 'Luis Mendoza' },
  { IdUsuario: 7, nombre: 'Sofía Castro' },
  { IdUsuario: 8, nombre: 'Soporte Sucursal A' },
  { IdUsuario: 9, nombre: 'Equipo DBA' },
];

// Mock de incidentes
const incidentes = ref([
  {
    IdIncidente: 1,
    Titulo: 'Caída del servidor principal',
    DescripcionDetallada: 'El servidor principal ha dejado de responder, afectando todos los servicios críticos de la organización. Error 500 en todos los endpoints.',
    FechaReporte: '2023-06-15T10:15:00',
    IdUsuarioReporta: 1,
    Prioridad: 'Crítico',
    EstadoIncidente: 'En Progreso',
    Categoria: 'Servidores',
    Tags: ['servidor', 'urgente'],
    DepartamentoAfectado: 'TI',
    IdDispositivoAfectado: null,
    IdTecnicoAsignado: 4,
    FechaAsignacion: '2023-06-15T10:30:00',
    FechaResolucionEstimada: null,
    FechaResolucionReal: null,
    AdjuntosURLs: [],
    NotificarUsuarioReporta: true,
    NotificarEquipoTecnico: true,
    NotificarSupervisores: true,
    MensajeNotificacionPersonalizado: '',
    Activo: true,
  },
  {
    IdIncidente: 2,
    Titulo: 'Error en módulo de facturación',
    DescripcionDetallada: 'Los clientes no pueden generar facturas desde el portal. Error "Referencia no válida" al intentar procesar el pago.',
    FechaReporte: '2023-06-14T15:45:00',
    IdUsuarioReporta: 2,
    Prioridad: 'Alto',
    EstadoIncidente: 'Asignado',
    Categoria: 'Facturación',
    Tags: ['facturación', 'frontend'],
    DepartamentoAfectado: 'Finanzas',
    IdDispositivoAfectado: null,
    IdTecnicoAsignado: 5,
    FechaAsignacion: '2023-06-14T16:00:00',
    FechaResolucionEstimada: null,
    FechaResolucionReal: null,
    AdjuntosURLs: [],
    NotificarUsuarioReporta: true,
    NotificarEquipoTecnico: true,
    NotificarSupervisores: false,
    MensajeNotificacionPersonalizado: '',
    Activo: true,
  },
  {
    IdIncidente: 3,
    Titulo: 'Problema con impresora central',
    DescripcionDetallada: 'La impresora del área administrativa no responde y muestra error "Tóner bajo" aunque se reemplazó recientemente.',
    FechaReporte: '2023-06-14T09:30:00',
    IdUsuarioReporta: 3,
    Prioridad: 'Medio',
    EstadoIncidente: 'Nuevo',
    Categoria: 'Hardware',
    Tags: ['hardware', 'oficina'],
    DepartamentoAfectado: 'Administración',
    IdDispositivoAfectado: null,
    IdTecnicoAsignado: null,
    FechaAsignacion: null,
    FechaResolucionEstimada: null,
    FechaResolucionReal: null,
    AdjuntosURLs: [],
    NotificarUsuarioReporta: true,
    NotificarEquipoTecnico: false,
    NotificarSupervisores: false,
    MensajeNotificacionPersonalizado: '',
    Activo: true,
  },
]);

// Mock equipo técnico
const equipoTecnico = [
  { IdUsuario: 4, nombre: 'Roberto Jiménez', Especialidad: 'Servidores', CalificacionPromedio: 4.8, AñosExperiencia: 8, EstadoDisponibilidad: 'Ocupado', PuedeSerAsignado: true, avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { IdUsuario: 5, nombre: 'Daniela Ríos', Especialidad: 'Backend', CalificacionPromedio: 4.6, AñosExperiencia: 5, EstadoDisponibilidad: 'Disponible', PuedeSerAsignado: true, avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { IdUsuario: 6, nombre: 'Luis Mendoza', Especialidad: 'Soporte Hardware', CalificacionPromedio: 4.4, AñosExperiencia: 4, EstadoDisponibilidad: 'Disponible', PuedeSerAsignado: true, avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
  { IdUsuario: 7, nombre: 'Sofía Castro', Especialidad: 'DBA', CalificacionPromedio: 4.7, AñosExperiencia: 7, EstadoDisponibilidad: 'Disponible', PuedeSerAsignado: true, avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
];

// Mock bitácora
const bitacora = ref([
  { IdBitacora: 1, IdIncidente: 1, Timestamp: '2023-06-15T10:15:00', IdUsuarioAccion: 1, TipoAccion: 'Reporte', Descripcion: 'Incidente reportado por Carlos Méndez.', AdjuntosURLs: [] },
  { IdBitacora: 2, IdIncidente: 1, Timestamp: '2023-06-15T10:30:00', IdUsuarioAccion: 9, TipoAccion: 'CambioPrioridad', Descripcion: 'El incidente fue marcado como CRÍTICO por el supervisor.', AdjuntosURLs: [] },
  { IdBitacora: 3, IdIncidente: 1, Timestamp: '2023-06-15T10:45:00', IdUsuarioAccion: 4, TipoAccion: 'Asignacion', Descripcion: 'Roberto Jiménez fue asignado para resolver el incidente.', AdjuntosURLs: [] },
]);

// Tabs
const incidentTabs = [
  { value: 'all', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'assigned', label: 'Asignados' },
  { value: 'in-progress', label: 'En Progreso' },
  { value: 'resolved', label: 'Resueltos' },
];

const activeIncidentTab = ref('all');
const searchQuery = ref('');
const showNewReportModal = ref(false);
const selectedIncident = ref(null);

// Notificaciones
const notificationSettings = ref({
  notificarUsuarioReporta: true,
  notificarEquipoTecnico: true,
  notificarSupervisores: false,
  mensajeNotificacion: ''
});

// Nueva bitácora
const nuevaBitacora = ref('');

// Computed: Stats data
const statsData = computed(() => [
  {
    priority: 'Crítico',
    count: countByPriority('Crítico'),
    label: 'Críticos',
    cardClass: 'critical',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    countColor: 'text-red-600'
  },
  {
    priority: 'Alto',
    count: countByPriority('Alto'),
    label: 'Altos',
    cardClass: 'high',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    countColor: 'text-orange-600'
  },
  {
    priority: 'Medio',
    count: countByPriority('Medio'),
    label: 'Medios',
    cardClass: 'medium',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    countColor: 'text-yellow-600'
  },
  {
    priority: 'Bajo',
    count: countByPriority('Bajo'),
    label: 'Bajos',
    cardClass: 'low',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    countColor: 'text-green-600'
  }
]);

// Computed: Incidentes filtrados
const filteredIncidents = computed(() => {
  let filtered = incidentes.value;
  
  // Filtrar por tab
  if (activeIncidentTab.value !== 'all') {
    filtered = filtered.filter(i => {
      if (activeIncidentTab.value === 'new') return i.EstadoIncidente === 'Nuevo';
      if (activeIncidentTab.value === 'assigned') return i.EstadoIncidente === 'Asignado';
      if (activeIncidentTab.value === 'in-progress') return i.EstadoIncidente === 'En Progreso';
      if (activeIncidentTab.value === 'resolved') return i.EstadoIncidente === 'Resuelto';
      return true;
    });
  }
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(i =>
      i.Titulo.toLowerCase().includes(q) ||
      i.DescripcionDetallada.toLowerCase().includes(q) ||
      i.Categoria.toLowerCase().includes(q) ||
      i.DepartamentoAfectado.toLowerCase().includes(q) ||
      (i.Tags && i.Tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }
  
  return filtered;
});

// Bitácora filtrada por incidente seleccionado
const bitacoraFiltrada = computed(() => {
  if (!selectedIncident.value) return [];
  return bitacora.value.filter(b => b.IdIncidente === selectedIncident.value.IdIncidente);
});

// Métodos auxiliares
function countByPriority(priority) {
  return incidentes.value.filter(i => i.Prioridad === priority).length;
}

function selectIncident(incident) {
  selectedIncident.value = incident;
}

function abrirAsignacion() {
  alert('Funcionalidad de asignación de personal (simulada)');
}

function asignarTecnico(incident) {
  // Simulación: asignar el primer técnico disponible
  const tecnico = equipoTecnico.find(t => t.EstadoDisponibilidad === 'Disponible');
  if (tecnico) {
    incident.IdTecnicoAsignado = tecnico.IdUsuario;
    incident.EstadoIncidente = 'Asignado';
    incident.FechaAsignacion = new Date().toISOString();
    
    // Agregar entrada a la bitácora
    bitacora.value.push({
      IdBitacora: bitacora.value.length + 1,
      IdIncidente: incident.IdIncidente,
      Timestamp: new Date().toISOString(),
      IdUsuarioAccion: tecnico.IdUsuario,
      TipoAccion: 'Asignacion',
      Descripcion: `${tecnico.nombre} fue asignado al incidente.`,
      AdjuntosURLs: [],
    });
    
    alert('Técnico asignado exitosamente.');
  } else {
    alert('No hay técnicos disponibles.');
  }
}

function agregarBitacora() {
  if (!selectedIncident.value || !nuevaBitacora.value.trim()) return;
  
  bitacora.value.push({
    IdBitacora: bitacora.value.length + 1,
    IdIncidente: selectedIncident.value.IdIncidente,
    Timestamp: new Date().toISOString(),
    IdUsuarioAccion: 1, // Simulación: usuario actual
    TipoAccion: 'Comentario',
    Descripcion: nuevaBitacora.value,
    AdjuntosURLs: [],
  });
  
  nuevaBitacora.value = '';
}

function enviarNotificaciones() {
  alert('Notificaciones enviadas (simulado)');
}

function handleExportData() {
  alert('Exportando datos de incidentes...');
}

function handleNewIncident(incidentData) {
  const newIncident = {
    IdIncidente: incidentes.value.length + 1,
    Titulo: incidentData.Titulo,
    DescripcionDetallada: incidentData.DescripcionDetallada,
    FechaReporte: new Date().toISOString(),
    IdUsuarioReporta: 1, // Simulación: usuario actual
    Prioridad: incidentData.Prioridad,
    EstadoIncidente: 'Nuevo',
    Categoria: incidentData.Categoria,
    Tags: incidentData.Tags,
    DepartamentoAfectado: incidentData.DepartamentoAfectado,
    IdDispositivoAfectado: null,
    IdTecnicoAsignado: null,
    FechaAsignacion: null,
    FechaResolucionEstimada: null,
    FechaResolucionReal: null,
    AdjuntosURLs: [],
    NotificarUsuarioReporta: incidentData.notificationSettings.notificarUsuarioReporta,
    NotificarEquipoTecnico: incidentData.notificationSettings.notificarEquipoTecnico,
    NotificarSupervisores: incidentData.notificationSettings.notificarSupervisores,
    MensajeNotificacionPersonalizado: incidentData.notificationSettings.mensajeNotificacion,
    Activo: true,
  };
  
  incidentes.value.push(newIncident);
  
  // Agregar entrada a la bitácora
  bitacora.value.push({
    IdBitacora: bitacora.value.length + 1,
    IdIncidente: newIncident.IdIncidente,
    Timestamp: new Date().toISOString(),
    IdUsuarioAccion: 1,
    TipoAccion: 'Reporte',
    Descripcion: `Nuevo incidente reportado: ${newIncident.Titulo}`,
    AdjuntosURLs: [],
  });
}

// Crear partículas animadas - optimizado
const createParticles = () => {
  // Sin partículas para mejor rendimiento
};

onMounted(() => {
  // Sin partículas para mejor rendimiento
});
</script>

<style scoped>
.incident-page {
  position: relative;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 1rem;
  color: #232b3b;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-section, .stats-section {
  margin-bottom: 1.5rem;
}

.main-content-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}
@media (min-width: 1024px) {
  .main-content-flex {
    flex-direction: row;
    gap: 2rem;
  }
}
.incident-list-section, .sidebar-section {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.2rem 1rem;
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
  .incident-page {
    padding: 0.75rem;
  }
  .main-content-flex {
    gap: 1rem;
  }
  .incident-list-section, .sidebar-section {
    padding: 0.7rem 0.5rem;
  }
}
@media (max-width: 480px) {
  .incident-page {
    padding: 0.5rem;
  }
  .main-content-flex {
    gap: 0.75rem;
  }
}
</style> 