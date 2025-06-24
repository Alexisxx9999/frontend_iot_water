<template>
  <section class="crm-chat">
    <div class="crm-chat-header">
      <span>Chat con: <b>{{ conversation?.nombre }}</b></span>
      <span class="crm-chat-status" :class="conversation?.estado?.toLowerCase()">{{ conversation?.estado }}</span>
    </div>
    <div class="crm-chat-messages">
      <div v-for="msg in messages" :key="msg.id" :class="['crm-chat-message', msg.remitente === 'Agente' ? 'sent' : 'received']">
        <div class="crm-chat-msg-author">{{ msg.remitente === 'Agente' ? 'Agente: Tú' : 'Cliente' }}</div>
        <div class="crm-chat-msg-content">{{ msg.contenido }}</div>
        <div class="crm-chat-msg-time">{{ msg.hora }}</div>
      </div>
    </div>
    <div class="crm-chat-input">
      <input v-model="nuevoMensaje" type="text" placeholder="Escribe tu respuesta..." @keyup.enter="enviar" />
      <button @click="enviar" class="enviar">Enviar</button>
    </div>
  </section>
</template>
<script>
import { ref, watch } from 'vue';
export default {
  name: 'CrmChat',
  props: {
    conversation: Object,
    messages: Array
  },
  setup(props, { emit }) {
    const nuevoMensaje = ref('');
    function enviar() {
      if (nuevoMensaje.value.trim()) {
        emit('sendMessage', nuevoMensaje.value);
        nuevoMensaje.value = '';
      }
    }
    // Scroll automático al final
    watch(() => props.messages, () => {
      setTimeout(() => {
        const el = document.querySelector('.crm-chat-messages');
        if (el) el.scrollTop = el.scrollHeight;
      }, 100);
    }, { deep: true });
    return { nuevoMensaje, enviar };
  }
};
</script>
<style scoped>
.crm-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  border-right: 1px solid #e0e0e0;
  min-width: 0;
  min-height: 320px;
}
.crm-chat-header {
  background: #dbeafe;
  padding: 0.4rem 0.7rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2563eb33;
  color: #2563eb;
  font-size: 0.93rem;
}
.crm-chat-status.nuevo { color: #117a62; }
.crm-chat-status.en\ proceso { color: #ff9800; }
.crm-chat-status.escalado { color: #d32f2f; }
.crm-chat-status.resuelto { color: #388e3c; }
.crm-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0.4rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.crm-chat-message {
  max-width: 70%;
  padding: 0.3rem 0.5rem;
  border-radius: 9px;
  font-size: 0.89rem;
  box-shadow: 0 1px 2px #2563eb11;
  position: relative;
}
.crm-chat-message.sent {
  align-self: flex-end;
  background: #dbeafe;
  color: #2563eb;
}
.crm-chat-message.received {
  align-self: flex-start;
  background: #fff;
  color: #1e293b;
}
.crm-chat-msg-author {
  font-size: 0.75rem;
  margin-bottom: 0.1rem;
}
.crm-chat-msg-content {
  margin-bottom: 0.1rem;
}
.crm-chat-msg-time {
  font-size: 0.7rem;
}
.crm-chat-input {
  display: flex;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  border-top: 1px solid #2563eb33;
  background: #fff;
}
.crm-chat-input input {
  flex: 1;
  border-radius: 7px;
  border: 1px solid #2563eb;
  padding: 0.3rem 0.7rem;
  font-size: 0.89rem;
  color: #2563eb;
  background: #f1f5fd;
}
.crm-chat-input .enviar {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.3rem 0.9rem;
  font-weight: 700;
  font-size: 0.89rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 2px #2563eb22;
}
.crm-chat-input .enviar:hover {
  background: #1e40af;
}
</style> 