<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-2">Entrenamiento del Chatbot</h2>
      <p class="text-sm text-gray-500">Gestiona y mejora el modelo de IA del chatbot</p>
    </div>

    <!-- Estado del Modelo -->
    <div class="mb-8">
      <h3 class="text-md font-medium text-gray-900 mb-4">Estado del Modelo IA</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-900">Versión Actual</p>
              <p class="text-lg font-semibold text-blue-700">{{ modelInfo.version }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-900">Última Actualización</p>
              <p class="text-lg font-semibold text-green-700">{{ formatDate(modelInfo.lastUpdate) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-purple-900">Precisión</p>
              <p class="text-lg font-semibold text-purple-700">{{ modelInfo.accuracy }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actualizar Modelo -->
    <div class="mb-8">
      <h3 class="text-md font-medium text-gray-900 mb-4">Actualizar Modelo</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700 mb-2">
              El modelo se entrenará con {{ trainingData.newInteractions }} nuevas interacciones y 
              {{ trainingData.improvements }} mejoras identificadas.
            </p>
            <p class="text-xs text-gray-500">
              Tiempo estimado: {{ trainingData.estimatedTime }}
            </p>
          </div>
          <button
            @click="startTraining"
            :disabled="isTraining"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              v-if="isTraining"
              class="w-4 h-4 mr-2 animate-spin" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg 
              v-else
              class="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            {{ isTraining ? 'Entrenando...' : 'Iniciar Entrenamiento' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contribuciones Recientes -->
    <div>
      <h3 class="text-md font-medium text-gray-900 mb-4">Contribuciones Recientes</h3>
      <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interacciones
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mejora
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="contribution in recentContributions" :key="contribution.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getContributionTypeColor(contribution.type).bg,
                  getContributionTypeColor(contribution.type).text
                ]">
                  {{ contribution.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ contribution.interactions }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ contribution.improvement }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(contribution.date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCrmStore } from '@/stores/crm';
import { formatDate } from '@/utils/crm';

const crmStore = useCrmStore();
const isTraining = ref(false);

const modelInfo = computed(() => crmStore.chatbotTraining.modelInfo);
const trainingData = computed(() => crmStore.chatbotTraining.trainingData);
const recentContributions = computed(() => crmStore.chatbotTraining.recentContributions);

const getContributionTypeColor = (type) => {
  const colorMap = {
    'feedback': { bg: 'bg-green-100', text: 'text-green-800' },
    'correction': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'new_pattern': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'optimization': { bg: 'bg-yellow-100', text: 'text-yellow-800' }
  };
  return colorMap[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

const startTraining = async () => {
  isTraining.value = true;
  try {
    await crmStore.trainChatbot();
    // Mostrar notificación de éxito
    console.log('Entrenamiento completado exitosamente');
  } catch (error) {
    console.error('Error durante el entrenamiento:', error);
  } finally {
    isTraining.value = false;
  }
};
</script> 