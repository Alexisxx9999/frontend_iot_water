<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 class="text-lg font-medium text-gray-900 mb-4">Nivel de Interacción con Clientes</h4>
      <div class="bg-gray-50 rounded-xl p-6 flex items-center justify-center mb-4 h-32">
        <span class="text-gray-400">[Gráfico de Interacción]</span>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Satisfacción del Cliente</label>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div class="bg-success-500 h-2 rounded-full transition-all duration-300" :style="{ width: satisfaction + '%' }"></div>
        </div>
        <div class="text-xs text-gray-500">{{ satisfaction }}%</div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo de Respuesta</label>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div class="bg-info-500 h-2 rounded-full transition-all duration-300" :style="{ width: responseTime + '%' }"></div>
        </div>
        <div class="text-xs text-gray-500">{{ responseTime }}%</div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Casos Resueltos</label>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div class="bg-primary-500 h-2 rounded-full transition-all duration-300" :style="{ width: resolvedCases + '%' }"></div>
        </div>
        <div class="text-xs text-gray-500">{{ resolvedCases }}%</div>
      </div>
    </div>
    <div>
      <h4 class="text-lg font-medium text-gray-900 mb-4">Métricas Clave</h4>
      <div class="bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 mb-1">Interacciones Totales</p>
          <p class="text-xs text-gray-500">Últimos 30 días</p>
        </div>
        <p class="text-2xl font-bold text-primary-600">{{ totalInteractions }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 mb-1">Promedio de Calificación</p>
          <p class="text-xs text-gray-500">De clientes</p>
        </div>
        <p class="text-2xl font-bold text-yellow-600">{{ averageRating }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 mb-1">Tiempo Promedio</p>
          <p class="text-xs text-gray-500">Resolución de casos</p>
        </div>
        <p class="text-2xl font-bold text-success-600">{{ averageResolutionTime }}h</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  satisfaction: Number,
  responseTime: Number,
  resolvedCases: Number,
  totalInteractions: Number,
  averageRating: Number,
  averageResolutionTime: Number
});
</script> 