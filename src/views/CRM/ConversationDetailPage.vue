<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detalle de Conversación</h1>
          <p class="text-sm text-gray-500">Historial, chat y gestión de la conversación con el cliente.</p>
        </div>
        <button @click="goBack" class="btn btn-secondary">← Volver a la bandeja</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Chat principal -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col h-[70vh]">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Chat</h2>
            <div class="flex items-center space-x-2">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusInfo(conversation?.status).bgColor,
                getStatusInfo(conversation?.status).textColor
              ]">
                {{ getStatusInfo(conversation?.status).label }}
              </span>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getPriorityInfo(conversation?.priority).bgColor,
                getPriorityInfo(conversation?.priority).textColor
              ]">
                {{ getPriorityInfo(conversation?.priority).label }}
              </span>
            </div>
          </div>
          
          <!-- Historial de mensajes -->
          <div class="flex-1 overflow-y-auto mb-4 pr-2" style="max-height: 50vh;">
            <div v-for="msg in messages" :key="msg.id" class="mb-3">
              <div :class="[
                'inline-block px-4 py-2 rounded-lg max-w-xs lg:max-w-md',
                msg.senderType === 'agent' ? 'bg-blue-100 text-blue-900 ml-auto' :
                msg.senderType === 'client' ? 'bg-gray-100 text-gray-900' :
                'bg-yellow-100 text-yellow-900 mx-auto text-center'
              ]">
                <span v-if="msg.senderType === 'system'" class="font-bold mr-2">[Nota Interna]</span>
                <span>{{ msg.content }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1" :class="msg.senderType === 'agent' ? 'text-right' : 'text-left'">
                {{ formatDate(msg.timestamp, 'datetime') }}
              </div>
            </div>
          </div>
          
          <!-- Formulario de respuesta -->
          <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Escribe tu mensaje..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button type="submit" class="btn btn-primary">Enviar</button>
          </form>
        </div>

        <!-- Panel lateral: detalles y acciones -->
        <div class="space-y-6">
          <!-- Detalles del cliente -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Cliente</h2>
            <div v-if="client">
              <p class="font-medium text-gray-800">{{ client.name }}</p>
              <p class="text-sm text-gray-500">{{ client.email }}</p>
              <p class="text-sm text-gray-500">{{ client.phone }}</p>
              <p class="text-sm text-gray-500">{{ client.company }}</p>
              <p class="text-xs text-gray-400 mt-2">Última interacción: {{ formatDate(client.lastInteraction, 'relative') }}</p>
            </div>
            <div v-else class="text-gray-400">Sin datos de cliente</div>
          </div>

          <!-- Agente asignado -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Agente Asignado</h2>
            <div v-if="assignedAgent" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-blue-600">{{ assignedAgent.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ assignedAgent.name }}</p>
                <p class="text-xs text-gray-500">{{ assignedAgent.department }}</p>
              </div>
            </div>
            <div v-else class="text-gray-400 text-sm">Sin agente asignado</div>
          </div>

          <!-- Etiquetas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Etiquetas</h2>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tag in conversation?.tags"
                :key="tag"
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getTagColor(tag).bg,
                  getTagColor(tag).text
                ]"
              >
                {{ tag }}
              </span>
              <span v-if="!conversation?.tags?.length" class="text-sm text-gray-400">
                Sin etiquetas
              </span>
            </div>
          </div>

          <!-- Notas internas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Notas Internas</h2>
            <ul class="mb-2 max-h-32 overflow-y-auto">
              <li v-for="msg in internalNotes" :key="msg.id" class="text-xs text-yellow-800 bg-yellow-50 rounded px-2 py-1 mb-1">
                {{ extractInternalNoteContent(msg.content) }}
                <span class="ml-2 text-gray-400">({{ formatDate(msg.timestamp, 'time') }})</span>
              </li>
            </ul>
            <form @submit.prevent="addNote" class="flex items-center space-x-2">
              <input
                v-model="newNote"
                type="text"
                placeholder="Agregar nota interna..."
                class="flex-1 px-2 py-1 border border-gray-300 rounded-md text-xs"
              />
              <button type="submit" class="btn btn-secondary text-xs">Añadir</button>
            </form>
          </div>

          <!-- Acciones rápidas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Acciones</h2>
            <div class="flex flex-col gap-2">
              <button class="btn btn-primary" @click="showAgentModal = true">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Asignar/Reasignar
              </button>
              <button class="btn btn-secondary" @click="showTagModal = true">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Gestionar Etiquetas
              </button>
              <button 
                v-if="conversation?.status !== 'resolved'"
                class="btn btn-success" 
                @click="resolveConversation"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Marcar como Resuelta
              </button>
            </div>
          </div>

          <!-- Historial del cliente -->
          <ClientHistory v-if="client" :client-id="client.id" />
        </div>
      </div>
    </div>

    <!-- Modales -->
    <AgentAssignmentModal
      :is-open="showAgentModal"
      :conversation-id="conversationId"
      @close="showAgentModal = false"
      @assigned="onAgentAssigned"
    />
    
    <TagManagementModal
      :is-open="showTagModal"
      :conversation-id="conversationId"
      @close="showTagModal = false"
      @updated="onTagsUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCrmStore } from '@/stores/crm';
import { formatDate, extractInternalNoteContent, getStatusInfo, getPriorityInfo, getTagColor } from '@/utils/crm';
import AgentAssignmentModal from '@/components/crm/AgentAssignmentModal.vue';
import TagManagementModal from '@/components/crm/TagManagementModal.vue';
import ClientHistory from '@/components/crm/ClientHistory.vue';

const route = useRoute();
const router = useRouter();
const crmStore = useCrmStore();

const conversationId = Number(route.params.id);
const newMessage = ref('');
const newNote = ref('');
const showAgentModal = ref(false);
const showTagModal = ref(false);

const conversation = computed(() =>
  crmStore.conversations.find(c => c.id === conversationId)
);

const client = computed(() =>
  conversation.value ? crmStore.clients.find(c => c.id === conversation.value.clientId) : null
);

const assignedAgent = computed(() => {
  if (!conversation.value?.assignedAgentId) return null;
  return crmStore.agents.find(a => a.id === conversation.value.assignedAgentId);
});

const messages = computed(() =>
  crmStore.messages.filter(m => m.conversationId === conversationId)
);

const internalNotes = computed(() =>
  messages.value.filter(m => m.senderType === 'system' && m.content.includes('[NOTA INTERNA]'))
);

function goBack() {
  router.push('/app/crm');
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;
  await crmStore.sendMessage(conversationId, newMessage.value, 1, 'agent');
  newMessage.value = '';
}

async function addNote() {
  if (!newNote.value.trim()) return;
  await crmStore.addInternalNote(conversationId, newNote.value);
  newNote.value = '';
}

async function resolveConversation() {
  try {
    await crmStore.updateConversationStatus(conversationId, 'resolved');
    // Mostrar notificación de éxito
    console.log('Conversación marcada como resuelta');
  } catch (error) {
    console.error('Error al resolver conversación:', error);
  }
}

function onAgentAssigned(agentId) {
  console.log('Agente asignado:', agentId);
  // Aquí podrías mostrar una notificación de éxito
}

function onTagsUpdated(tags) {
  console.log('Etiquetas actualizadas:', tags);
  // Aquí podrías mostrar una notificación de éxito
}

onMounted(() => {
  crmStore.selectConversation(conversationId);
});
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}
.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
}
.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}
</style> 