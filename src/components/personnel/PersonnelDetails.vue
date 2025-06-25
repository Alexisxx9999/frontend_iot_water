<template>
  <div v-if="selectedEmployee" class="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <img :src="selectedEmployee.photo" class="w-16 h-16 rounded-full object-cover">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ selectedEmployee.name }}</h2>
          <p class="text-gray-600">{{ selectedEmployee.position }}</p>
          <div class="flex items-center mt-2">
            <slot name="role-badge" :employee="selectedEmployee" />
            <span class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
              Activo
            </span>
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
        <button class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200" @click="$emit('edit', selectedEmployee)">
          <slot name="edit-icon" />
          Editar
        </button>
        <button class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200" @click="$emit('print', selectedEmployee)">
          <slot name="print-icon" />
          Imprimir
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="space-y-4">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">ID Empleado</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.employeeId }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">Departamento</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.department }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">Posición</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.position }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">Fecha Ingreso</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.startDate }}</span>
        </div>
      </div>
      <div class="space-y-4">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">Email</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.email }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">Teléfono</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.phone }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">Ubicación</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.location }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-500">Experiencia</span>
          <span class="text-sm text-gray-900">{{ selectedEmployee.experience }}</span>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
<script setup>
const props = defineProps(['selectedEmployee']);
</script> 