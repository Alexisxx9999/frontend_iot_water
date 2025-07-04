<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Bandeja de Conversaciones</h1>
          <p class="text-sm text-gray-500">
            Gestiona y responde todas las conversaciones de clientes en tiempo real.
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="goToTraining"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            Entrenamiento IA
          </button>
        </div>
      </div>

      <!-- KPIs -->
      <CrmKpiPanel class="mb-8" />

      <!-- Lista de conversaciones -->
      <ConversationList @conversation-selected="goToDetail" />
    </div>
  </div>
</template>

<script setup>
import CrmKpiPanel from '@/components/crm/CrmKpiPanel.vue';
import ConversationList from '@/components/crm/ConversationList.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDetail(conversation) {
  router.push(`/app/crm/conversations/${conversation.id}`);
}

function goToTraining() {
  router.push('/app/crm/training');
}
</script>

<style scoped>
.section-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
h1 {
  font-size: 2.5rem;
  color: #2196f3;
}
</style> 