<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Personal</h2>
    
    <!-- KPIs Principales -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-blue-600">Total Empleados</p>
            <p class="text-2xl font-bold text-blue-900">{{ stats.totalEmployees }}</p>
          </div>
        </div>
      </div>

      <div class="bg-green-50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-green-600">Activos</p>
            <p class="text-2xl font-bold text-green-900">{{ stats.activeEmployees }}</p>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-yellow-600">Nuevos (30 días)</p>
            <p class="text-2xl font-bold text-yellow-900">{{ stats.newEmployees }}</p>
          </div>
        </div>
      </div>

      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-purple-600">Departamentos</p>
            <p class="text-2xl font-bold text-purple-900">{{ stats.departments }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Distribución por Departamento -->
    <div class="mt-6">
      <h3 class="text-md font-medium text-gray-900 mb-3">Distribución por Departamento</h3>
      <div class="space-y-2">
        <div v-for="dept in departmentStats" :key="dept.name" class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: dept.color }"></div>
            <span class="text-sm text-gray-700">{{ dept.name }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                class="h-2 rounded-full transition-all duration-300" 
                :style="{ 
                  width: dept.percentage + '%', 
                  backgroundColor: dept.color 
                }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ dept.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePersonnelStore } from '@/stores/personnel';

const personnelStore = usePersonnelStore();

const stats = computed(() => {
  const personnel = personnelStore.personnel;
  const totalEmployees = personnel.length;
  const activeEmployees = personnel.filter(p => p.status === 'active').length;
  
  // Calcular empleados nuevos (últimos 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newEmployees = personnel.filter(p => new Date(p.startDate) >= thirtyDaysAgo).length;
  
  // Calcular departamentos únicos
  const departments = [...new Set(personnel.map(p => p.department))].length;
  
  return {
    totalEmployees,
    activeEmployees,
    newEmployees,
    departments
  };
});

const departmentStats = computed(() => {
  const personnel = personnelStore.personnel;
  const deptCount = {};
  
  personnel.forEach(p => {
    deptCount[p.department] = (deptCount[p.department] || 0) + 1;
  });
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  
  return Object.entries(deptCount).map(([name, count], index) => ({
    name,
    count,
    percentage: Math.round((count / personnel.length) * 100),
    color: colors[index % colors.length]
  }));
});
</script> 