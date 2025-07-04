<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900">KPIs de Atención</h2>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">Actualizado</span>
        <div class="flex items-center">
          <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span class="text-sm text-green-600 font-medium">En tiempo real</span>
        </div>
        <button
          @click="refreshKPIs"
          :disabled="isRefreshing"
          class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          :class="{ 'animate-spin': isRefreshing }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Tiempo Promedio de Respuesta -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600 mb-1">Tiempo Promedio</p>
            <p class="text-2xl font-bold text-blue-900">{{ kpis.averageResponseTime }}</p>
            <p class="text-xs text-blue-600 mt-1">de respuesta</p>
          </div>
          <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span class="text-xs text-blue-600">Meta: &lt; 10m</span>
          <div class="ml-auto">
            <span :class="[
              'text-xs font-medium px-2 py-1 rounded-full',
              getResponseTimeStatus(kpis.averageResponseTime)
            ]">
              {{ getResponseTimeStatusText(kpis.averageResponseTime) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Resolución en Primera Respuesta -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600 mb-1">Primera Respuesta</p>
            <p class="text-2xl font-bold text-green-900">{{ kpis.firstResponseResolution }}</p>
            <p class="text-xs text-green-600 mt-1">resolución</p>
          </div>
          <div class="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span class="text-xs text-green-600">Meta: &gt; 75%</span>
          <div class="ml-auto">
            <span :class="[
              'text-xs font-medium px-2 py-1 rounded-full',
              getResolutionStatus(kpis.firstResponseResolution)
            ]">
              {{ getResolutionStatusText(kpis.firstResponseResolution) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Net Promoter Score -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600 mb-1">NPS</p>
            <p class="text-2xl font-bold text-purple-900">{{ kpis.netPromoterScore }}</p>
            <p class="text-xs text-purple-600 mt-1">Net Promoter Score</p>
          </div>
          <div class="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span class="text-xs text-purple-600">Meta: &gt; 50</span>
          <div class="ml-auto">
            <span :class="[
              'text-xs font-medium px-2 py-1 rounded-full',
              getNPSStatus(kpis.netPromoterScore)
            ]">
              {{ getNPSStatusText(kpis.netPromoterScore) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Satisfacción del Cliente -->
      <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-orange-600 mb-1">Satisfacción</p>
            <p class="text-2xl font-bold text-orange-900">{{ kpis.customerSatisfaction }}</p>
            <p class="text-xs text-orange-600 mt-1">del cliente</p>
          </div>
          <div class="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center">
          <span class="text-xs text-orange-600">Meta: &gt; 90%</span>
          <div class="ml-auto">
            <span :class="[
              'text-xs font-medium px-2 py-1 rounded-full',
              getSatisfactionStatus(kpis.customerSatisfaction)
            ]">
              {{ getSatisfactionStatusText(kpis.customerSatisfaction) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas Adicionales -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900">{{ kpis.totalConversations }}</p>
        <p class="text-sm text-gray-600">Conversaciones Totales</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-blue-600">{{ kpis.activeConversations }}</p>
        <p class="text-sm text-gray-600">Conversaciones Activas</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-green-600">{{ kpis.resolvedToday }}</p>
        <p class="text-sm text-gray-600">Resueltas Hoy</p>
      </div>
    </div>

    <!-- Gráfico de tendencia (simulado) -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-900">Tendencia de Satisfacción (Últimos 7 días)</h3>
        <div class="flex space-x-2">
          <button
            v-for="period in ['7d', '30d', '90d']"
            :key="period"
            @click="changePeriod(period)"
            :class="[
              'px-3 py-1 text-xs rounded-md transition-colors',
              selectedPeriod === period
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ period }}
          </button>
        </div>
      </div>
      <div class="h-32 bg-gray-50 rounded-lg flex items-end justify-center space-x-1 p-4">
        <div
          v-for="(value, index) in trendData"
          :key="index"
          class="bg-blue-500 rounded-t"
          :style="{ height: `${value}%`, width: '20px' }"
          :title="`Día ${index + 1}: ${value}%`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCrmStore } from '@/stores/crm';

const props = defineProps({
  autoRefresh: {
    type: Boolean,
    default: true
  },
  refreshInterval: {
    type: Number,
    default: 30000 // 30 segundos
  }
});

const emit = defineEmits(['kpis-updated']);

const crmStore = useCrmStore();
const isRefreshing = ref(false);
const selectedPeriod = ref('7d');
const refreshInterval = ref(null);

const kpis = computed(() => crmStore.getRealTimeKPIs);

// Datos de tendencia simulados
const trendData = ref([85, 88, 92, 89, 94, 91, 93]);

const getResponseTimeStatus = (time) => {
  const minutes = parseInt(time.replace(/[^0-9]/g, ''));
  if (minutes <= 5) return 'bg-green-100 text-green-800';
  if (minutes <= 10) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getResponseTimeStatusText = (time) => {
  const minutes = parseInt(time.replace(/[^0-9]/g, ''));
  if (minutes <= 5) return 'Excelente';
  if (minutes <= 10) return 'Bueno';
  return 'Necesita mejora';
};

const getResolutionStatus = (percentage) => {
  const value = parseInt(percentage.replace('%', ''));
  if (value >= 80) return 'bg-green-100 text-green-800';
  if (value >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getResolutionStatusText = (percentage) => {
  const value = parseInt(percentage.replace('%', ''));
  if (value >= 80) return 'Excelente';
  if (value >= 70) return 'Bueno';
  return 'Necesita mejora';
};

const getNPSStatus = (nps) => {
  if (nps >= 50) return 'bg-green-100 text-green-800';
  if (nps >= 30) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getNPSStatusText = (nps) => {
  if (nps >= 50) return 'Excelente';
  if (nps >= 30) return 'Bueno';
  return 'Necesita mejora';
};

const getSatisfactionStatus = (percentage) => {
  const value = parseInt(percentage.replace('%', ''));
  if (value >= 90) return 'bg-green-100 text-green-800';
  if (value >= 80) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getSatisfactionStatusText = (percentage) => {
  const value = parseInt(percentage.replace('%', ''));
  if (value >= 90) return 'Excelente';
  if (value >= 80) return 'Bueno';
  return 'Necesita mejora';
};

const refreshKPIs = async () => {
  isRefreshing.value = true;
  try {
    await crmStore.updateKPIs();
    emit('kpis-updated', kpis.value);
  } catch (error) {
    console.error('Error al actualizar KPIs:', error);
  } finally {
    isRefreshing.value = false;
  }
};

const changePeriod = (period) => {
  selectedPeriod.value = period;
  // Aquí se actualizarían los datos de tendencia según el período
  // Por ahora solo simulamos
  if (period === '30d') {
    trendData.value = [82, 85, 87, 89, 91, 88, 90, 92, 89, 93, 91, 94, 88, 92, 90, 93, 87, 91, 89, 92, 88, 90, 93, 91, 89, 92, 90, 94, 91, 93];
  } else if (period === '90d') {
    trendData.value = [80, 82, 85, 87, 89, 91, 88, 90, 92, 89, 93, 91, 94, 88, 92, 90, 93, 87, 91, 89, 92, 88, 90, 93, 91, 89, 92, 90, 94, 91, 93, 88, 90, 92, 89, 93, 91, 94, 88, 92, 90, 93, 87, 91, 89, 92, 88, 90, 93, 91, 89, 92, 90, 94, 91, 93, 88, 90, 92, 89, 93, 91, 94, 88, 92, 90, 93, 87, 91, 89, 92, 88, 90, 93, 91, 89, 92, 90, 94, 91, 93, 88, 90, 92, 89, 93, 91, 94, 88, 92];
  } else {
    trendData.value = [85, 88, 92, 89, 94, 91, 93];
  }
};

const startAutoRefresh = () => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshInterval.value = setInterval(refreshKPIs, props.refreshInterval);
  }
};

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
};

onMounted(() => {
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style> 