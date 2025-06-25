<template>
  <header class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Incidentes</h1>
      <p class="text-gray-600">Monitoreo y resolución de problemas técnicos</p>
    </div>
    <div class="flex space-x-3 mt-4 md:mt-0">
      <button 
        class="btn btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
        @click="$emit('new-incident')"
      >
        <slot name="new-incident-icon" />
        <span>Nuevo Reporte</span>
      </button>
      <button 
        class="btn btn-secondary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        @click="$emit('export-data')"
      >
        <slot name="export-icon" />
        <span>Exportar</span>
      </button>
    </div>
  </header>
</template>

<script setup>
// No props needed for this component
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.2s;
  outline: none;
}

.btn:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1);
}

.btn-primary:hover {
  background: linear-gradient(to right, #1d4ed8, #1e40af);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.05);
}

.btn-primary:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1);
}

.btn-secondary:hover {
  background-color: #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.05);
}

.btn-secondary:focus {
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.5);
}
</style> 