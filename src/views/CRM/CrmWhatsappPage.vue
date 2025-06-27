<template>
  <div class="crm-whatsapp-page space-y-8 ml-8">
    <div class="min-h-screen w-full bg-blue-50 flex flex-col md:flex-row gap-4 py-4 px-2">
      <!-- Conversaciones -->
      <div class="w-full md:w-1/4 flex flex-col">
        <ConversationFilters class="mb-2" />
        <div class="flex-1 overflow-y-auto rounded-xl shadow-lg bg-blue-100 border border-blue-300">
          <CrmSidebar
            :conversations="conversations"
            :selectedConversationId="selectedId"
            @selectConversation="selectConversation"
          />
        </div>
      </div>

      <!-- Chat -->
      <div class="w-full md:w-2/4 flex flex-col">
        <div class="border-b border-cyan-300 p-5 flex items-center gap-4 bg-cyan-100 rounded-xl shadow mb-2">
          <div :style="{ background: getAvatarColor(selectedConversation.id) }" class="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg">
            {{ selectedConversation.nombre.charAt(0) }}
          </div>
          <div>
            <div class="font-bold text-cyan-900 text-lg">{{ selectedConversation.nombre }}</div>
            <div class="text-xs text-cyan-700 font-semibold">{{ selectedConversation.estado }}</div>
          </div>
        </div>
        <div class="bg-cyan-50 rounded-xl shadow flex-1 max-h-[400px] overflow-y-auto border border-cyan-200">
          <CrmChat
            :conversation="selectedConversation"
            :messages="messages"
            @sendMessage="sendMsg"
          />
        </div>
        <!-- Barra de acciones tipo chat -->
        <div class="flex items-center gap-2 justify-end mt-2 p-2 bg-cyan-100 rounded-xl shadow border-t border-cyan-200">
          <button @click="adjuntarArchivo" class="p-2 hover:bg-cyan-200 rounded" title="Adjuntar archivo">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.656-5.657l-7.07 7.07a6 6 0 108.485 8.485L19 13" /></svg>
          </button>
          <button @click="abrirEtiquetas" class="p-2 hover:bg-cyan-200 rounded" title="Etiquetas">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01" /></svg>
          </button>
          <button @click="sugerenciaIA" class="p-2 hover:bg-cyan-200 rounded flex items-center gap-1" title="IA">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" /></svg>
            <span class="text-xs font-semibold">IA</span>
          </button>
          <button @click="escalarConversacion" class="ml-4 px-3 py-1 bg-white border border-red-400 text-red-500 rounded hover:bg-red-50 font-semibold text-sm" title="Escalar">↑ Escalar</button>
          <button @click="resolverConversacion" class="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-semibold text-sm" title="Resolver">✔ Resolver</button>
        </div>
      </div>

      <!-- Info Cliente, KPIs y Estadísticas -->
      <div class="w-full md:w-1/4 flex flex-col gap-4">
        <div class="bg-blue-100 rounded-xl shadow p-6 pb-3 border-b border-blue-300">
          <h3 class="text-md font-bold text-blue-800 mb-2">Información del Cliente</h3>
          <div class="text-sm text-blue-700 mb-1"><b>Nombre:</b> {{ selectedConversation.nombre }}</div>
          <div class="text-sm text-blue-700 mb-1"><b>ID:</b> {{ selectedConversation.id }}</div>
          <div class="text-sm text-blue-700 mb-1"><b>Plan:</b> {{ selectedConversation.plan }}</div>
          <div class="text-sm text-blue-700 mb-1"><b>Sector:</b> {{ selectedConversation.sector }}</div>
        </div>
        <CrmKpiPanel :kpis="kpis" />
        <CaseDetails class="!bg-blue-50" />
        <ChatbotStats />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CrmSidebar from '@/components/CrmSidebar.vue'
import CrmChat from '@/components/CrmChat.vue'
import CrmKpiPanel from '@/components/CrmKpiPanel.vue'
import CaseDetails from '@/components/CaseDetails.vue'
import ChatbotStats from '@/components/ChatbotStats.vue'
import ConversationFilters from '@/components/ConversationFilters.vue'

// Datos simulados (mock)
const mockConversations = [
  { id: 1, nombre: 'Juan Pérez', estado: 'Activo', plan: 'Premium', sector: 'Residencial' },
  { id: 2, nombre: 'Ana Gómez', estado: 'Inactivo', plan: 'Básico', sector: 'Comercial' },
  { id: 3, nombre: 'Carlos Ruiz', estado: 'Pendiente', plan: 'Estándar', sector: 'Industrial' }
]
const mockMessages = {
  1: [
    { id: 1, from: 'cliente', text: 'Hola, tengo un problema con mi servicio.' },
    { id: 2, from: 'agente', text: '¡Hola Juan! ¿En qué puedo ayudarte?' }
  ],
  2: [
    { id: 1, from: 'cliente', text: '¿Cuándo se reactivará mi cuenta?' },
    { id: 2, from: 'agente', text: 'Estamos revisando tu caso, Ana.' }
  ],
  3: [
    { id: 1, from: 'cliente', text: 'Necesito información sobre mi plan.' },
    { id: 2, from: 'agente', text: 'Claro, Carlos. ¿Qué deseas saber?' }
  ]
}
const mockKpis = { respuestaPromedio: 2, resueltosPrimera: 80, nps: 75, satisfaccion: 90 }

const conversations = ref([])
const messages = ref([])
const selectedId = ref(null)
const kpis = ref({ respuestaPromedio: 0, resueltosPrimera: 0, nps: 0, satisfaccion: 0 })

// Cargar datos simulados al montar
onMounted(() => {
  conversations.value = mockConversations
  selectedId.value = mockConversations[0]?.id || null
  if (selectedId.value) {
    loadMessages(selectedId.value)
  }
  kpis.value = mockKpis
})

const selectedConversation = computed(() =>
  conversations.value.find(c => c.id === selectedId.value) || { nombre: '', id: '', plan: '', sector: '', estado: '' }
)

function loadMessages(conversationId) {
  messages.value = mockMessages[conversationId] || []
}

function selectConversation(id) {
  selectedId.value = id
  loadMessages(id)
}

function sendMsg(msg) {
  if (msg && msg.trim()) {
    // Simular envío agregando el mensaje localmente
    messages.value.push({ id: Date.now(), from: 'agente', text: msg })
  }
}

function getAvatarColor(id) {
  // Paleta de colores pastel
  const colors = [
    '#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171', '#38bdf8', '#818cf8', '#facc15', '#fb7185'
  ]
  return colors[id % colors.length]
}

// Acciones simuladas para los botones de la barra de chat
function adjuntarArchivo() {
  alert('Funcionalidad simulada: Adjuntar archivo')
}
function abrirEtiquetas() {
  alert('Funcionalidad simulada: Seleccionar etiqueta')
}
function sugerenciaIA() {
  // Simular sugerencia IA (por ejemplo, autocompletar input)
  alert('Funcionalidad simulada: Sugerencia de respuesta por IA')
}
function escalarConversacion() {
  if (selectedConversation.value) {
    selectedConversation.value.estado = 'Escalada'
    alert('La conversación ha sido escalada.')
  }
}
function resolverConversacion() {
  if (selectedConversation.value) {
    selectedConversation.value.estado = 'Resuelta'
    alert('La conversación ha sido marcada como resuelta.')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 4px;
}
.animate-pop {
  animation: pop 0.2s cubic-bezier(.4,2,.6,1) both;
}
@keyframes pop {
  0% { transform: scale(0.95) translateY(10px); opacity: 0.2; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
</style> 