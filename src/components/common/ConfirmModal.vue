<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Confirmar acción</h3>
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="$emit('confirm')">Eliminar</button>
          <button class="btn btn-secondary" @click="$emit('cancel')">Cancelar</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
const props = defineProps({
  visible: Boolean,
  message: String
})
const emit = defineEmits(['confirm', 'cancel'])
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 32px #0002;
  padding: 2rem 2.5rem;
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
}
.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #23272f;
}
.modal-message {
  color: #374151;
  margin-bottom: 1.5rem;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
.btn {
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-danger {
  background: #dc2626;
  color: #fff;
}
.btn-danger:hover {
  background: #b91c1c;
}
.btn-secondary {
  background: #f3f4f6;
  color: #23272f;
}
.btn-secondary:hover {
  background: #e5e7eb;
}
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style> 