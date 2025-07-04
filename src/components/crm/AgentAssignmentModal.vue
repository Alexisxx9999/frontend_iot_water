<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Asignar Agente
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Selecciona un agente para asignar a esta conversación.
                </p>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Agente Actual
                  </label>
                  <div class="text-sm text-gray-600 mb-4">
                    {{ currentAgent ? currentAgent.name : 'Sin asignar' }}
                  </div>
                  
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nuevo Agente
                  </label>
                  <select
                    v-model="selectedAgentId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccionar agente...</option>
                    <option
                      v-for="agent in availableAgents"
                      :key="agent.id"
                      :value="agent.id"
                      :disabled="agent.status === 'offline'"
                    >
                      {{ agent.name }} ({{ agent.department }}) - {{ agent.status === 'online' ? '🟢 En línea' : '🔴 Desconectado' }}
                    </option>
                  </select>
                </div>

                <div v-if="selectedAgentId" class="mt-4 p-3 bg-blue-50 rounded-md">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>{{ getSelectedAgentName() }}</strong> tiene {{ getSelectedAgentWorkload() }} conversaciones activas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="assignAgent"
            :disabled="!selectedAgentId || isAssigning"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              v-if="isAssigning"
              class="w-4 h-4 mr-2 animate-spin" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ isAssigning ? 'Asignando...' : 'Asignar' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCrmStore } from '@/stores/crm';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'assigned']);

const crmStore = useCrmStore();
const selectedAgentId = ref('');
const isAssigning = ref(false);

const conversation = computed(() => 
  crmStore.conversations.find(c => c.id === props.conversationId)
);

const currentAgent = computed(() => {
  if (!conversation.value?.assignedAgentId) return null;
  return crmStore.agents.find(a => a.id === conversation.value.assignedAgentId);
});

const availableAgents = computed(() => crmStore.agents);

const getSelectedAgentName = () => {
  const agent = crmStore.agents.find(a => a.id === selectedAgentId.value);
  return agent ? agent.name : '';
};

const getSelectedAgentWorkload = () => {
  const agent = crmStore.agents.find(a => a.id === selectedAgentId.value);
  if (!agent) return 0;
  
  return crmStore.conversations.filter(c => 
    c.assignedAgentId === agent.id && c.status !== 'resolved'
  ).length;
};

const closeModal = () => {
  selectedAgentId.value = '';
  emit('close');
};

const assignAgent = async () => {
  if (!selectedAgentId.value) return;
  
  isAssigning.value = true;
  try {
    await crmStore.assignAgent(props.conversationId, selectedAgentId.value);
    emit('assigned', selectedAgentId.value);
    closeModal();
  } catch (error) {
    console.error('Error al asignar agente:', error);
  } finally {
    isAssigning.value = false;
  }
};

// Reset selected agent when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    selectedAgentId.value = conversation.value?.assignedAgentId || '';
  }
});
</script> 