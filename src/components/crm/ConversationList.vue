<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header con filtros -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div class="flex items-center space-x-4">
          <h2 class="text-lg font-semibold text-gray-900">Conversaciones</h2>
          <span class="text-sm text-gray-500">
            {{ filteredConversations.length }} de {{ totalConversations }}
          </span>
        </div>
        
        <div class="flex items-center space-x-3">
          <button
            @click="showFilters = !showFilters"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
            </svg>
            Filtros
          </button>
          
          <button
            @click="exportConversations"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Exportar
          </button>
        </div>
      </div>

      <!-- Filtros expandibles -->
      <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Búsqueda -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Cliente, asunto, mensaje..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="handleSearch"
            />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="filters.status"
              @change="handleFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="new">Nuevo</option>
              <option value="in_progress">En Proceso</option>
              <option value="escalated">Escalado</option>
              <option value="resolved">Resuelto</option>
            </select>
          </div>

          <!-- Prioridad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select
              v-model="filters.priority"
              @change="handleFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <!-- Agente asignado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Agente</label>
            <select
              v-model="filters.assignedAgent"
              @change="handleFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Todos los agentes</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                {{ agent.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Etiquetas -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag"
              @click="toggleTag(tag)"
              :class="[
                'px-3 py-1 text-sm rounded-full border transition-colors',
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              ]"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="mt-4 flex items-center space-x-3">
          <button
            @click="clearFilters"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Limpiar Filtros
          </button>
          
          <button
            @click="refreshData"
            :disabled="isLoading"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg 
              class="w-4 h-4 mr-2" 
              :class="{ 'animate-spin': isLoading }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de conversaciones -->
    <div class="overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center">
        <svg class="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <p class="text-gray-500">Cargando conversaciones...</p>
      </div>

      <div v-else-if="filteredConversations.length === 0" class="p-8 text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay conversaciones</h3>
        <p class="text-gray-500 mb-4">
          {{ filters.search || filters.status || filters.priority || filters.assignedAgent || selectedTags.length > 0 
            ? 'No se encontraron conversaciones con los filtros aplicados' 
            : 'No hay conversaciones disponibles en este momento' }}
        </p>
        <button
          v-if="filters.search || filters.status || filters.priority || filters.assignedAgent || selectedTags.length > 0"
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Limpiar Filtros
        </button>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          @click="selectConversation(conversation)"
          :class="[
            'p-4 hover:bg-gray-50 cursor-pointer transition-colors',
            selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ getClientName(conversation.clientId) }}
                </h3>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusInfo(conversation.status).bgColor,
                  getStatusInfo(conversation.status).textColor
                ]">
                  {{ getStatusInfo(conversation.status).label }}
                </span>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getPriorityInfo(conversation.priority).bgColor,
                  getPriorityInfo(conversation.priority).textColor
                ]">
                  {{ getPriorityInfo(conversation.priority).label }}
                </span>
              </div>
              
              <p class="text-sm font-medium text-gray-900 mb-1">
                {{ conversation.subject }}
              </p>
              
              <p class="text-sm text-gray-500 truncate">
                {{ conversation.lastMessage }}
              </p>
              
              <div class="flex items-center space-x-4 mt-2">
                <span class="text-xs text-gray-400">
                  {{ formatDate(conversation.timestamp, 'relative') }}
                </span>
                
                <div v-if="conversation.assignedAgentId" class="flex items-center">
                  <span class="text-xs text-gray-400 mr-1">Asignado a:</span>
                  <span class="text-xs font-medium text-gray-600">
                    {{ getAgentName(conversation.assignedAgentId) }}
                  </span>
                </div>
                
                <div v-if="conversation.tags.length > 0" class="flex items-center space-x-1">
                  <span class="text-xs text-gray-400">Etiquetas:</span>
                  <span
                    v-for="tag in conversation.tags.slice(0, 2)"
                    :key="tag"
                    :class="[
                      'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                      getTagColor(tag).bg,
                      getTagColor(tag).text
                    ]"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="conversation.tags.length > 2" class="text-xs text-gray-400">
                    +{{ conversation.tags.length - 2 }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button
                @click.stop="showConversationActions(conversation)"
                class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menú de acciones contextual -->
    <div
      v-if="showActionsMenu"
      class="fixed inset-0 z-50"
      @click="hideActionsMenu"
    >
      <div
        class="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
        :style="actionsMenuStyle"
        @click.stop
      >
        <button
          @click="assignConversation"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Asignar Agente
        </button>
        
        <button
          @click="changeStatus"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Cambiar Estado
        </button>
        
        <button
          @click="manageTags"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Gestionar Etiquetas
        </button>
        
        <hr class="my-1">
        
        <button
          @click="resolveConversation"
          class="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Marcar como Resuelto
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCrmStore } from '@/stores/crm';
import { formatDate, getStatusInfo, getPriorityInfo, getTagColor } from '@/utils/crm';

const props = defineProps({
  selectedConversation: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['conversation-selected', 'conversation-updated']);

const crmStore = useCrmStore();
const showFilters = ref(false);
const isLoading = ref(false);
const showActionsMenu = ref(false);
const actionsMenuStyle = ref({});
const selectedConversationForActions = ref(null);

const filters = ref({
  search: '',
  status: '',
  priority: '',
  assignedAgent: ''
});

const selectedTags = ref([]);

const filteredConversations = computed(() => crmStore.getFilteredConversations);
const totalConversations = computed(() => crmStore.conversations.length);
const agents = computed(() => crmStore.agents);
const availableTags = computed(() => crmStore.tags);

const getClientName = (clientId) => {
  const client = crmStore.clients.find(c => c.id === clientId);
  return client ? client.name : 'Cliente desconocido';
};

const getAgentName = (agentId) => {
  const agent = crmStore.agents.find(a => a.id === agentId);
  return agent ? agent.name : 'Agente desconocido';
};

const handleSearch = () => {
  crmStore.setFilters({ ...filters.value, tags: selectedTags.value });
};

const handleFilters = () => {
  crmStore.setFilters({ ...filters.value, tags: selectedTags.value });
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  crmStore.setFilters({ ...filters.value, tags: selectedTags.value });
};

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    priority: '',
    assignedAgent: ''
  };
  selectedTags.value = [];
  crmStore.clearFilters();
};

const selectConversation = (conversation) => {
  emit('conversation-selected', conversation);
};

const refreshData = async () => {
  isLoading.value = true;
  try {
    await crmStore.fetchInitialData();
  } catch (error) {
    console.error('Error al actualizar datos:', error);
  } finally {
    isLoading.value = false;
  }
};

const showConversationActions = (conversation) => {
  selectedConversationForActions.value = conversation;
  showActionsMenu.value = true;
  
  // Posicionar el menú cerca del botón
  const button = event.target.closest('button');
  const rect = button.getBoundingClientRect();
  actionsMenuStyle.value = {
    top: `${rect.bottom + 5}px`,
    left: `${rect.left - 150}px`,
    minWidth: '200px'
  };
};

const hideActionsMenu = () => {
  showActionsMenu.value = false;
  selectedConversationForActions.value = null;
};

const assignConversation = () => {
  // Implementar lógica de asignación
  hideActionsMenu();
};

const changeStatus = () => {
  // Implementar lógica de cambio de estado
  hideActionsMenu();
};

const manageTags = () => {
  // Implementar lógica de gestión de etiquetas
  hideActionsMenu();
};

const resolveConversation = async () => {
  if (selectedConversationForActions.value) {
    try {
      await crmStore.updateConversationStatus(selectedConversationForActions.value.id, 'resolved');
      emit('conversation-updated', selectedConversationForActions.value);
    } catch (error) {
      console.error('Error al resolver conversación:', error);
    }
  }
  hideActionsMenu();
};

const exportConversations = () => {
  // Implementar exportación
  console.log('Exportando conversaciones...');
};

onMounted(() => {
  refreshData();
});
</script> 