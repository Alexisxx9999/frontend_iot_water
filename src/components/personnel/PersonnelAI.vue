<template>
  <div>
    <h4 class="text-lg font-medium text-gray-900 mb-4">Entrenamiento del Chatbot</h4>
    <p class="mb-4 text-gray-600">El sistema utiliza las interacciones reales del empleado para entrenar al chatbot de servicio al cliente, mejorando sus respuestas basadas en su experiencia y conocimiento.</p>
    <div class="bg-white rounded-xl shadow p-6 text-center mb-6">
      <svg class="mx-auto mb-3 w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h5 class="text-lg font-semibold mb-2">Modelo de IA Actual</h5>
      <p class="text-gray-500 mb-2">Versión 2.3.5 - Actualizado hace 3 días</p>
      <button class="btn btn-primary">
        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582M20 20v-5h-.581M5 19a9 9 0 0014-14M19 5a9 9 0 00-14 14" />
        </svg>
        Actualizar con Nuevos Datos
      </button>
    </div>
    <h6 class="text-md font-semibold mb-3">Contribuciones Recientes al Modelo</h6>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm mb-4">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Fecha</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Tipo</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Interacciones</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Mejora</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="item in contributions" :key="item.id">
            <td class="px-4 py-2 whitespace-nowrap">{{ item.date }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ item.type }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ item.interactions }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ item.improvement }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 mt-4 rounded">
      <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1" />
      </svg>
      El sistema aprende automáticamente de las interacciones exitosas para mejorar las respuestas del chatbot.
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  contributions: Array
});
</script> 