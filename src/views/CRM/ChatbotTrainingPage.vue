<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Entrenamiento del Chatbot</h1>
          <p class="text-sm text-gray-500">Gestiona y mejora el modelo de IA del chatbot</p>
        </div>
        <button @click="goBack" class="btn btn-secondary">← Volver al CRM</button>
      </div>

      <!-- Componente de entrenamiento -->
      <ChatbotTraining />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ChatbotTraining from '@/components/crm/ChatbotTraining.vue';

const router = useRouter();

function goBack() {
  router.push('/app/crm');
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out;
}
.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
}
</style> 