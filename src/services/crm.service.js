// Servicio CRM solo con mocks, sin axios

// Datos simulados para desarrollo
const mockConversations = [
  { id: 1, nombre: 'Juan López', estado: 'Nuevo', hora: '10:25', asunto: 'Problema con consumo de agua', plan: 'Residencial Plus', sector: 'Norte' },
  { id: 2, nombre: 'María Pérez', estado: 'En proceso', hora: '09:42', asunto: 'Consulta sobre facturación', plan: 'Empresarial', sector: 'Centro' },
  { id: 3, nombre: 'Roberto Álvarez', estado: 'Resuelto', hora: '08:30', asunto: 'Reclamo por corte de servicio', plan: 'Residencial', sector: 'Sur' },
  { id: 4, nombre: 'Ana González', estado: 'Nuevo', hora: 'Ayer', asunto: 'Consulta sobre fechas de facturación', plan: 'Residencial', sector: 'Este' },
];

const mockMessagesByConversation = {
  1: [
    { id: 1, remitente: 'Cliente', contenido: 'Hola, tengo un problema con el consumo de agua este mes.', hora: '10:25' },
    { id: 2, remitente: 'Agente', contenido: '¡Hola Juan! ¿Podrías darme más detalles?', hora: '10:26' },
  ],
  2: [
    { id: 1, remitente: 'Cliente', contenido: 'Tengo dudas sobre mi factura.', hora: '09:42' },
    { id: 2, remitente: 'Agente', contenido: 'Claro, ¿en qué puedo ayudarte?', hora: '09:43' },
  ],
  3: [
    { id: 1, remitente: 'Cliente', contenido: '¿Por qué hubo un corte de servicio?', hora: '08:30' },
    { id: 2, remitente: 'Agente', contenido: 'Estamos revisando el incidente, pronto restableceremos el servicio.', hora: '08:31' },
  ],
  4: [
    { id: 1, remitente: 'Cliente', contenido: '¿Cuándo se factura este mes?', hora: 'Ayer' },
    { id: 2, remitente: 'Agente', contenido: 'La facturación será el día 28.', hora: 'Ayer' },
  ],
};

export const crmService = {
  // Obtener todas las conversaciones
  getConversations() {
    return Promise.resolve({ data: mockConversations });
  },

  // Obtener mensajes de una conversación
  getMessages(conversationId) {
    return Promise.resolve({ data: mockMessagesByConversation[conversationId] || [] });
  },

  // Enviar un mensaje a una conversación
  sendMessage(conversationId, message) {
    mockMessagesByConversation[conversationId] = mockMessagesByConversation[conversationId] || [];
    mockMessagesByConversation[conversationId].push({
      id: Date.now(),
      remitente: 'Agente',
      contenido: message,
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    });
    return Promise.resolve({ data: { success: true } });
  },

  // (Opcional) Obtener detalles de un cliente
  getClientDetails(clientId) {
    return Promise.resolve({ data: {} });
  },

  // (Opcional) Obtener KPIs del CRM
  getKpis() {
    return Promise.resolve({ data: { respuestaPromedio: 2.4, resueltosPrimera: 78, nps: 62, satisfaccion: 94 } });
  }
};
