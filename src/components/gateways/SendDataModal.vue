<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Enviar datos del Gateway</h2>
      <p>Se enviarán los datos del gateway a la siguiente ruta:</p>
      <input v-model="url" class="url-input" />
      <div v-if="sending" class="sending-msg">Enviando datos...</div>
      <div class="modal-actions">
        <button class="btn btn-primary" :disabled="sending" @click="handleSend">Enviar</button>
        <button class="btn btn-secondary" :disabled="sending" @click="$emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  gateway: Object,
  sendUrl: String
})
const emit = defineEmits(['close', 'send'])
const url = ref(props.sendUrl)
const sending = ref(false)
watch(() => props.sendUrl, (val) => { url.value = val }, { immediate: true })
const handleSend = async () => {
  sending.value = true
  await emit('send', props.gateway, url.value)
  sending.value = false
}
</script>
<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0008; display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 8px; padding: 2rem; min-width: 350px; max-width: 95vw; }
.url-input { width: 100%; margin: 1rem 0; padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd; }
.sending-msg { color: #2563eb; font-weight: bold; margin-bottom: 1rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
</style> 