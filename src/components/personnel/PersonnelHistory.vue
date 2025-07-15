<template>
  <div>
    <h4 class="text-lg font-medium text-gray-900 mb-4">Historial de Acciones</h4>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Fecha/Hora</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Acción</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Módulo</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Detalles</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="item in history" :key="item.id">
            <td class="px-4 py-2 whitespace-nowrap">{{ item.date }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ item.type }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ item.module }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ item.details }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav class="mt-4 flex justify-center" aria-label="Page navigation">
      <ul class="inline-flex -space-x-px">
        <li>
          <button class="px-3 py-1 rounded-l-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100" :disabled="page === 1" @click="$emit('change-page', page - 1)">Anterior</button>
        </li>
        <li v-for="p in totalPages" :key="p">
          <button class="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-blue-50" :class="{ 'bg-blue-600 text-white': p === page }" @click="$emit('change-page', p)">{{ p }}</button>
        </li>
        <li>
          <button class="px-3 py-1 rounded-r-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100" :disabled="page === totalPages" @click="$emit('change-page', page + 1)">Siguiente</button>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup>
const props = defineProps({
  history: Array,
  page: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
});
</script> 