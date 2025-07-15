import api from './api';

export const crmService = {
  // ===== CONVERSACIONES =====
  
  // Obtener lista de conversaciones con filtros
  getConversations(filters = {}) {
    return api.get('/crm/conversations', { params: filters });
  },

  // Obtener conversación por ID
  getConversationById(id) {
    return api.get(`/crm/conversations/${id}`);
  },

  // Crear nueva conversación
  createConversation(data) {
    return api.post('/crm/conversations', data);
  },

  // Actualizar conversación
  updateConversation(id, data) {
    return api.put(`/crm/conversations/${id}`, data);
  },

  // Eliminar conversación
  deleteConversation(id) {
    return api.delete(`/crm/conversations/${id}`);
  },

  // Cambiar estado de conversación
  updateConversationStatus(id, status) {
    return api.patch(`/crm/conversations/${id}/status`, { status });
  },

  // Asignar agente a conversación
  assignAgent(conversationId, agentId) {
    return api.post(`/crm/conversations/${conversationId}/assign`, { agentId });
  },

  // Reasignar conversación
  reassignConversation(conversationId, agentId) {
    return api.post(`/crm/conversations/${conversationId}/reassign`, { agentId });
  },

  // Resolver conversación
  resolveConversation(id, resolutionData = {}) {
    return api.post(`/crm/conversations/${id}/resolve`, resolutionData);
  },

  // Cerrar conversación
  closeConversation(id) {
    return api.post(`/crm/conversations/${id}/close`);
  },

  // ===== MENSAJES =====

  // Obtener mensajes de una conversación
  getMessages(conversationId) {
    return api.get(`/crm/conversations/${conversationId}/messages`);
  },

  // Enviar mensaje
  sendMessage(conversationId, messageData) {
    return api.post(`/crm/conversations/${conversationId}/messages`, messageData);
  },

  // Marcar mensaje como leído
  markMessageAsRead(messageId) {
    return api.patch(`/crm/messages/${messageId}/read`);
  },

  // Marcar todos los mensajes como leídos
  markAllMessagesAsRead(conversationId) {
    return api.post(`/crm/conversations/${conversationId}/messages/read-all`);
  },

  // ===== CLIENTES =====

  // Obtener lista de clientes
  getClients(filters = {}) {
    return api.get('/crm/clients', { params: filters });
  },

  // Obtener cliente por ID
  getClientById(id) {
    return api.get(`/crm/clients/${id}`);
  },

  // Crear nuevo cliente
  createClient(data) {
    return api.post('/crm/clients', data);
  },

  // Actualizar cliente
  updateClient(id, data) {
    return api.put(`/crm/clients/${id}`, data);
  },

  // Obtener historial de interacciones del cliente
  getClientHistory(clientId) {
    return api.get(`/crm/clients/${clientId}/history`);
  },

  // Obtener reclamaciones del cliente
  getClientComplaints(clientId) {
    return api.get(`/crm/clients/${clientId}/complaints`);
  },

  // ===== ETIQUETAS =====

  // Obtener todas las etiquetas disponibles
  getTags() {
    return api.get('/crm/tags');
  },

  // Agregar etiquetas a conversación
  addTagsToConversation(conversationId, tags) {
    return api.post(`/crm/conversations/${conversationId}/tags`, { tags });
  },

  // Remover etiquetas de conversación
  removeTagsFromConversation(conversationId, tags) {
    return api.delete(`/crm/conversations/${conversationId}/tags`, { data: { tags } });
  },

  // Crear nueva etiqueta
  createTag(tagData) {
    return api.post('/crm/tags', tagData);
  },

  // ===== NOTAS INTERNAS =====

  // Obtener notas internas de una conversación
  getInternalNotes(conversationId) {
    return api.get(`/crm/conversations/${conversationId}/notes`);
  },

  // Agregar nota interna
  addInternalNote(conversationId, noteData) {
    return api.post(`/crm/conversations/${conversationId}/notes`, noteData);
  },

  // Actualizar nota interna
  updateInternalNote(noteId, noteData) {
    return api.put(`/crm/notes/${noteId}`, noteData);
  },

  // Eliminar nota interna
  deleteInternalNote(noteId) {
    return api.delete(`/crm/notes/${noteId}`);
  },

  // ===== AGENTES =====

  // Obtener lista de agentes
  getAgents() {
    return api.get('/crm/agents');
  },

  // Obtener agente por ID
  getAgentById(id) {
    return api.get(`/crm/agents/${id}`);
  },

  // Obtener conversaciones asignadas a un agente
  getAgentConversations(agentId) {
    return api.get(`/crm/agents/${agentId}/conversations`);
  },

  // Obtener estadísticas del agente
  getAgentStats(agentId, dateRange = {}) {
    return api.get(`/crm/agents/${agentId}/stats`, { params: dateRange });
  },

  // ===== KPIs Y MÉTRICAS =====

  // Obtener KPIs en tiempo real
  getRealTimeKPIs() {
    return api.get('/crm/kpis/realtime');
  },

  // Obtener KPIs históricos
  getHistoricalKPIs(dateRange = {}) {
    return api.get('/crm/kpis/historical', { params: dateRange });
  },

  // Obtener métricas de atención
  getAttentionMetrics(dateRange = {}) {
    return api.get('/crm/metrics/attention', { params: dateRange });
  },

  // Obtener tiempo promedio de respuesta
  getAverageResponseTime(dateRange = {}) {
    return api.get('/crm/metrics/response-time', { params: dateRange });
  },

  // Obtener porcentaje de resolución en primera respuesta
  getFirstResponseResolution(dateRange = {}) {
    return api.get('/crm/metrics/first-response-resolution', { params: dateRange });
  },

  // Obtener Net Promoter Score
  getNetPromoterScore(dateRange = {}) {
    return api.get('/crm/metrics/nps', { params: dateRange });
  },

  // Obtener satisfacción del cliente
  getCustomerSatisfaction(dateRange = {}) {
    return api.get('/crm/metrics/satisfaction', { params: dateRange });
  },

  // ===== CHATBOT Y IA =====

  // Obtener estado del modelo IA
  getChatbotStatus() {
    return api.get('/crm/chatbot/status');
  },

  // Iniciar entrenamiento del modelo
  startChatbotTraining(trainingData = {}) {
    return api.post('/crm/chatbot/train', trainingData);
  },

  // Obtener progreso del entrenamiento
  getTrainingProgress() {
    return api.get('/crm/chatbot/training/progress');
  },

  // Obtener contribuciones recientes
  getRecentContributions() {
    return api.get('/crm/chatbot/contributions');
  },

  // Agregar contribución al modelo
  addContribution(contributionData) {
    return api.post('/crm/chatbot/contributions', contributionData);
  },

  // Obtener versiones del modelo
  getModelVersions() {
    return api.get('/crm/chatbot/versions');
  },

  // Revertir a versión anterior
  revertToVersion(versionId) {
    return api.post(`/crm/chatbot/versions/${versionId}/revert`);
  },

  // ===== REPORTES =====

  // Generar reporte de conversaciones
  generateConversationsReport(filters = {}) {
    return api.get('/crm/reports/conversations', {
      params: filters,
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
  },

  // Generar reporte de agentes
  generateAgentsReport(dateRange = {}) {
    return api.get('/crm/reports/agents', {
      params: dateRange,
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
  },

  // Generar reporte de satisfacción
  generateSatisfactionReport(dateRange = {}) {
    return api.get('/crm/reports/satisfaction', {
      params: dateRange,
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
  },

  // Exportar datos a Excel
  exportToExcel(filters = {}) {
    return api.get('/crm/export/excel', {
      params: filters,
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  },

  // ===== CONFIGURACIÓN =====

  // Obtener configuración del CRM
  getCrmConfig() {
    return api.get('/crm/config');
  },

  // Actualizar configuración del CRM
  updateCrmConfig(configData) {
    return api.put('/crm/config', configData);
  },

  // Obtener plantillas de respuesta
  getResponseTemplates() {
    return api.get('/crm/templates');
  },

  // Crear plantilla de respuesta
  createResponseTemplate(templateData) {
    return api.post('/crm/templates', templateData);
  },

  // Actualizar plantilla de respuesta
  updateResponseTemplate(templateId, templateData) {
    return api.put(`/crm/templates/${templateId}`, templateData);
  },

  // Eliminar plantilla de respuesta
  deleteResponseTemplate(templateId) {
    return api.delete(`/crm/templates/${templateId}`);
  },

  // ===== NOTIFICACIONES =====

  // Obtener notificaciones
  getNotifications() {
    return api.get('/crm/notifications');
  },

  // Marcar notificación como leída
  markNotificationAsRead(notificationId) {
    return api.patch(`/crm/notifications/${notificationId}/read`);
  },

  // Marcar todas las notificaciones como leídas
  markAllNotificationsAsRead() {
    return api.post('/crm/notifications/read-all');
  },

  // ===== WEBSOCKET/REAL-TIME =====

  // Configurar WebSocket para mensajes en tiempo real
  setupWebSocket(conversationId) {
    // Esta función se implementaría con WebSocket o Server-Sent Events
    return new Promise((resolve) => {
      // Simular conexión WebSocket
      setTimeout(() => {
        resolve({ connected: true, conversationId });
      }, 100);
    });
  },

  // Cerrar conexión WebSocket
  closeWebSocket() {
    // Implementar cierre de WebSocket
    return Promise.resolve({ connected: false });
  }
};
