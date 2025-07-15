<template>
  <transition name="simple-toast-fade">
    <div v-if="visible" class="simple-toast" :class="type">
      <span class="icon">{{ icon }}</span>
      <span class="msg">{{ message }}</span>
      <button class="close-btn" @click="close">×</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SimpleToast',
  props: {
    message: String,
    type: {
      type: String,
      default: 'success' // success, error, info, warning
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      visible: false,
      timeout: null
    }
  },
  computed: {
    icon() {
      switch (this.type) {
        case 'success': return '✔️'
        case 'error': return '❌'
        case 'warning': return '⚠️'
        case 'info': return 'ℹ️'
        default: return ''
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(this.close, this.duration)
    },
    close() {
      this.visible = false
      clearTimeout(this.timeout)
    }
  },
  mounted() {
    this.show()
  }
}
</script>

<style scoped>
.simple-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  min-width: 220px;
  max-width: 350px;
  background: #fff;
  color: #222;
  border-radius: 1rem;
  box-shadow: 0 4px 24px #0002;
  padding: 1rem 1.5rem 1rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.08rem;
  z-index: 9999;
  border-left: 6px solid #22c55e;
  animation: pop-in 0.2s;
}
.simple-toast.success { border-left-color: #22c55e; }
.simple-toast.error { border-left-color: #ef4444; }
.simple-toast.warning { border-left-color: #f59e42; }
.simple-toast.info { border-left-color: #2563eb; }
.icon {
  font-size: 1.4em;
  margin-right: 0.2em;
}
.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.3em;
  margin-left: auto;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover { color: #ef4444; }
@keyframes pop-in {
  0% { transform: translateY(-30px) scale(0.95); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.simple-toast-fade-enter-active, .simple-toast-fade-leave-active {
  transition: opacity 0.3s;
}
.simple-toast-fade-enter-from, .simple-toast-fade-leave-to {
  opacity: 0;
}
</style> 