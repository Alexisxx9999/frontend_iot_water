<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
    <div 
      v-for="stat in stats" 
      :key="stat.priority"
      class="indicator-card transform hover:scale-105 transition-all duration-200"
      :class="stat.cardClass"
    >
      <div class="flex items-center space-x-3">
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center"
          :class="stat.iconBg"
        >
          <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div>
          <span class="count" :class="stat.countColor">{{ stat.count }}</span>
          <span class="label text-gray-600">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Array,
    default: () => [
      {
        priority: 'Crítico',
        count: 0,
        label: 'Críticos',
        cardClass: 'critical',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        countColor: 'text-red-600'
      },
      {
        priority: 'Alto',
        count: 0,
        label: 'Altos',
        cardClass: 'high',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        countColor: 'text-orange-600'
      },
      {
        priority: 'Medio',
        count: 0,
        label: 'Medios',
        cardClass: 'medium',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        countColor: 'text-yellow-600'
      },
      {
        priority: 'Bajo',
        count: 0,
        label: 'Bajos',
        cardClass: 'low',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        countColor: 'text-green-600'
      }
    ]
  }
});
</script>

<style scoped>
.indicator-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: white;
  border: 1px solid #f3f4f6;
  font-weight: 600;
  font-size: 1.1rem;
}

.indicator-card .count {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.indicator-card.critical {
  border-left: 4px solid #ef4444;
}

.indicator-card.high {
  border-left: 4px solid #f97316;
}

.indicator-card.medium {
  border-left: 4px solid #eab308;
}

.indicator-card.low {
  border-left: 4px solid #22c55e;
}
</style> 