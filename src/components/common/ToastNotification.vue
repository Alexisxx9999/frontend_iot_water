<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="['toast', type]">
      {{ message }}
    </div>
  </transition>
</template>
<script setup>
const props = defineProps({
  message: String,
  type: { type: String, default: 'info' }, // info, success, error
  visible: Boolean
})
</script>
<style scoped>
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  min-width: 220px;
  background: #fff;
  color: #23272f;
  border-radius: 8px;
  box-shadow: 0 2px 12px #0002;
  padding: 1rem 1.5rem;
  font-weight: 500;
  z-index: 9999;
  border-left: 6px solid #2563eb;
  animation: toast-in 0.3s;
}
.toast.success { border-left-color: #16a34a; color: #16a34a; }
.toast.error { border-left-color: #dc2626; color: #dc2626; }
.toast.info { border-left-color: #2563eb; color: #2563eb; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; }
@keyframes toast-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
</style> 