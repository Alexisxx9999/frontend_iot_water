<template>
  <div>
    <div class="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Equipo</h3>
        <slot name="new-employee-btn" />
      </div>
      <!-- Search Box -->
      <div class="relative mb-6">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <slot name="search-icon" />
        </div>
        <input 
          type="text" 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          placeholder="Buscar personal..." 
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
        >
      </div>
      <!-- Role Tabs -->
      <div class="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button 
          v-for="tab in roleTabs" 
          :key="tab.value"
          @click="$emit('set-active-tab', tab.value)"
          class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
          :class="activeTab === tab.value 
            ? 'bg-white text-primary-700 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'"
        >
          {{ tab.label }}
        </button>
      </div>
      <!-- Employee List -->
      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div 
          v-for="employee in filteredEmployees" 
          :key="employee.id"
          @click="$emit('select-employee', employee)"
          class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
          :class="selectedEmployee?.id === employee.id ? 'bg-primary-50 border border-primary-200' : ''"
        >
          <img :src="employee.photo" class="w-10 h-10 rounded-full object-cover">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ employee.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ employee.position }}</p>
            <div class="flex items-center mt-1">
              <slot name="role-badge" :employee="employee" />
              <div class="flex items-center ml-2">
                <slot name="star-icon" />
                <span class="text-xs text-gray-500 ml-1">{{ employee.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>
<script setup>
const props = defineProps([
  'employees',
  'filteredEmployees',
  'roleTabs',
  'activeTab',
  'searchQuery',
  'selectedEmployee'
]);
</script> 