<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div 
      v-for="stat in stats" 
      :key="stat.id"
      class="bg-white rounded-2xl shadow-lg p-7 hover:shadow-2xl transition-all duration-200 flex items-center justify-between"
    >
      <div>
        <p class="text-base font-semibold text-gray-600">{{ stat.label }}</p>
        <p class="text-4xl font-extrabold text-gray-900 mt-2">{{ stat.value }}</p>
        <div class="flex items-center mt-2">
          <component 
            :is="stat.trend === 'up' ? ArrowUpIcon : ArrowDownIcon"
            class="w-5 h-5 mr-1"
            :class="stat.trend === 'up' ? 'text-success-500' : 'text-danger-500'"
          />
          <span 
            class="text-base font-semibold"
            :class="stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'"
          >
            {{ stat.change }}
          </span>
          <span class="text-base text-gray-400 ml-1">vs mes anterior</span>
        </div>
      </div>
      <div 
        class="w-14 h-14 rounded-xl flex items-center justify-center"
        :class="stat.bgColor"
        style="opacity: 0.9"
      >
        <component :is="stat.icon" class="w-8 h-8 text-white" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline';
const props = defineProps({
  stats: Array
});
</script> 