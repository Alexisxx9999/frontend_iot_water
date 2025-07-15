<script>
import { createToastComponent } from '@/composables/useToast'
import { onMounted, ref } from 'vue'
import SimpleToast from '@/components/common/SimpleToast.vue'

export default {
  name: 'App',
  components: {
    ToastContainer: createToastComponent(),
    SimpleToast
  },
  setup() {
    // Estado global para el toast simple
    const toastMsg = ref('')
    const toastType = ref('success')
    const toastKey = ref(0)
    const toastVisible = ref(false)
    const toastDuration = ref(3000)

    // Función global para mostrar el toast
    window.showSimpleToast = (msg, type = 'success', duration = 3000) => {
      toastMsg.value = msg
      toastType.value = type
      toastDuration.value = duration
      toastKey.value++ // Forzar remount
      toastVisible.value = false
      setTimeout(() => { toastVisible.value = true }, 10)
    }

    return {
      toastMsg, toastType, toastKey, toastVisible, toastDuration
    }
  }
}
</script>

<template>
  <div id="app">
    <router-view />
    <ToastContainer />
    <SimpleToast
      v-if="toastVisible"
      :key="toastKey"
      :message="toastMsg"
      :type="toastType"
      :duration="toastDuration"
      @close="toastVisible = false"
    />
  </div>
</template>

<style>
body, #app {
  min-height: 100vh;
  background: #f3f4f6 !important;
  overflow-y: auto !important;
}
</style>
