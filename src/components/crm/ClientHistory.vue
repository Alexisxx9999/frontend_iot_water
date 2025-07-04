<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Historial del Cliente</h3>
    
    <div v-if="clientHistory.length === 0" class="text-center py-8">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-gray-500">No hay historial disponible</p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="interaction in clientHistory"
        :key="interaction.id"
        class="border-l-4 border-blue-500 pl-4 py-2"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <span :class="[
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                getInteractionTypeColor(interaction.type).bg,
                getInteractionTypeColor(interaction.type).text
              ]">
                {{ getInteractionTypeLabel(interaction.type) }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatDate(interaction.date, 'relative') }}
              </span>
            </div>
            
            <p class="text-sm font-medium text-gray-900 mb-1">
              {{ interaction.subject }}
            </p>
            
            <p class="text-sm text-gray-600 mb-2">
              {{ interaction.description }}
            </p>
            
            <div class="flex items-center space-x-4 text-xs text-gray-500">
              <span v-if="interaction.agent">
                Agente: {{ interaction.agent }}
              </span>
              <span v-if="interaction.duration">
                Duración: {{ interaction.duration }}
              </span>
              <span v-if="interaction.satisfaction">
                Satisfacción: {{ interaction.satisfaction }}/5
              </span>
            </div>
          </div>
          
          <div class="flex items-center space-x-1">
            <span :class="[
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
              getStatusColor(interaction.status).bg,
              getStatusColor(interaction.status).text
            ]">
              {{ getStatusLabel(interaction.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Estadísticas del cliente -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <h4 class="text-md font-medium text-gray-900 mb-3">Estadísticas</h4>
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-blue-600">{{ clientStats.totalInteractions }}</p>
          <p class="text-xs text-gray-500">Total Interacciones</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">{{ clientStats.averageSatisfaction }}</p>
          <p class="text-xs text-gray-500">Satisfacción Promedio</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-purple-600">{{ clientStats.resolvedIssues }}</p>
          <p class="text-xs text-gray-500">Casos Resueltos</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-orange-600">{{ clientStats.averageResolutionTime }}</p>
          <p class="text-xs text-gray-500">Tiempo Promedio Resolución</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '@/utils/crm';

const props = defineProps({
  clientId: {
    type: Number,
    required: true
  }
});

// Datos mock del historial del cliente
const clientHistory = computed(() => [
  {
    id: 1,
    type: 'conversation',
    subject: 'Consulta sobre facturación',
    description: 'Cliente consultó sobre cargos adicionales en su factura mensual',
    date: '2024-01-15T10:30:00',
    agent: 'Juan Pérez',
    duration: '15m',
    satisfaction: 4,
    status: 'resolved'
  },
  {
    id: 2,
    type: 'complaint',
    subject: 'Problema con servicio',
    description: 'Reportó interrupciones en el servicio durante la semana',
    date: '2024-01-10T14:20:00',
    agent: 'María Gómez',
    duration: '25m',
    satisfaction: 3,
    status: 'resolved'
  },
  {
    id: 3,
    type: 'request',
    subject: 'Solicitud de cambio de plan',
    description: 'Solicitó cambio de plan básico a premium',
    date: '2024-01-05T09:15:00',
    agent: 'Carlos López',
    duration: '10m',
    satisfaction: 5,
    status: 'resolved'
  },
  {
    id: 4,
    type: 'conversation',
    subject: 'Información sobre nuevos servicios',
    description: 'Consultó sobre disponibilidad de nuevos servicios en su área',
    date: '2023-12-28T16:45:00',
    agent: 'Juan Pérez',
    duration: '12m',
    satisfaction: 4,
    status: 'resolved'
  }
]);

const clientStats = computed(() => ({
  totalInteractions: clientHistory.value.length,
  averageSatisfaction: (clientHistory.value.reduce((sum, item) => sum + item.satisfaction, 0) / clientHistory.value.length).toFixed(1),
  resolvedIssues: clientHistory.value.filter(item => item.status === 'resolved').length,
  averageResolutionTime: '18m'
}));

const getInteractionTypeColor = (type) => {
  const colorMap = {
    conversation: { bg: 'bg-blue-100', text: 'text-blue-800' },
    complaint: { bg: 'bg-red-100', text: 'text-red-800' },
    request: { bg: 'bg-green-100', text: 'text-green-800' },
    inquiry: { bg: 'bg-purple-100', text: 'text-purple-800' }
  };
  return colorMap[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

const getInteractionTypeLabel = (type) => {
  const labelMap = {
    conversation: 'Conversación',
    complaint: 'Reclamo',
    request: 'Solicitud',
    inquiry: 'Consulta'
  };
  return labelMap[type] || type;
};

const getStatusColor = (status) => {
  const colorMap = {
    resolved: { bg: 'bg-green-100', text: 'text-green-800' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    pending: { bg: 'bg-blue-100', text: 'text-blue-800' },
    escalated: { bg: 'bg-red-100', text: 'text-red-800' }
  };
  return colorMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

const getStatusLabel = (status) => {
  const labelMap = {
    resolved: 'Resuelto',
    in_progress: 'En Proceso',
    pending: 'Pendiente',
    escalated: 'Escalado'
  };
  return labelMap[status] || status;
};
</script> 