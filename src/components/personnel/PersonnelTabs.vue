<template>
  <div>
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('set-active-tab', tab.id)"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200"
          :class="activeTab === tab.id
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
    
    <!-- Tab Content -->
    <div class="tab-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [
      { id: 'info', label: 'Roles y Permisos' },
      { id: 'history', label: 'Historial' },
      { id: 'interaction', label: 'Interacción' },
      { id: 'ai', label: 'IA' }
    ]
  },
  activeTab: {
    type: String,
    default: 'info'
  }
});
</script> 