import api from './api'

export const notificationsService = {
  // Obtener notificaciones
  async getNotifications(filters = {}) {
    try {
      const response = await api.get('/notifications', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error)
      throw error
    }
  },

  // Marcar notificación como leída
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Error marcando notificación como leída:', error)
      throw error
    }
  },

  // Marcar notificación como no leída
  async markAsUnread(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/unread`)
      return response.data
    } catch (error) {
      console.error('Error marcando notificación como no leída:', error)
      throw error
    }
  },

  // Marcar todas las notificaciones como leídas
  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/read-all')
      return response.data
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error)
      throw error
    }
  },

  // Archivar notificación
  async archiveNotification(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/archive`)
      return response.data
    } catch (error) {
      console.error('Error archivando notificación:', error)
      throw error
    }
  },

  // Desarchivar notificación
  async unarchiveNotification(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/unarchive`)
      return response.data
    } catch (error) {
      console.error('Error desarchivando notificación:', error)
      throw error
    }
  },

  // Eliminar notificación
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando notificación:', error)
      throw error
    }
  },

  // Obtener configuración de alertas
  async getAlertsConfiguration() {
    try {
      const response = await api.get('/notifications/alerts/config')
      return response.data
    } catch (error) {
      console.error('Error obteniendo configuración de alertas:', error)
      throw error
    }
  },

  // Crear tipo de alerta
  async createAlertType(alertType) {
    try {
      const response = await api.post('/notifications/alerts/types', alertType)
      return response.data
    } catch (error) {
      console.error('Error creando tipo de alerta:', error)
      throw error
    }
  },

  // Actualizar tipo de alerta
  async updateAlertType(alertTypeId, alertType) {
    try {
      const response = await api.put(`/notifications/alerts/types/${alertTypeId}`, alertType)
      return response.data
    } catch (error) {
      console.error('Error actualizando tipo de alerta:', error)
      throw error
    }
  },

  // Eliminar tipo de alerta
  async deleteAlertType(alertTypeId) {
    try {
      const response = await api.delete(`/notifications/alerts/types/${alertTypeId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando tipo de alerta:', error)
      throw error
    }
  },

  // Activar/desactivar tipo de alerta
  async toggleAlertType(alertTypeId, active) {
    try {
      const response = await api.put(`/notifications/alerts/types/${alertTypeId}/toggle`, { active })
      return response.data
    } catch (error) {
      console.error('Error cambiando estado de tipo de alerta:', error)
      throw error
    }
  },

  // Crear destinatario de alerta
  async createAlertRecipient(recipient) {
    try {
      const response = await api.post('/notifications/alerts/recipients', recipient)
      return response.data
    } catch (error) {
      console.error('Error creando destinatario de alerta:', error)
      throw error
    }
  },

  // Actualizar destinatario de alerta
  async updateAlertRecipient(recipientId, recipient) {
    try {
      const response = await api.put(`/notifications/alerts/recipients/${recipientId}`, recipient)
      return response.data
    } catch (error) {
      console.error('Error actualizando destinatario de alerta:', error)
      throw error
    }
  },

  // Eliminar destinatario de alerta
  async deleteAlertRecipient(recipientId) {
    try {
      const response = await api.delete(`/notifications/alerts/recipients/${recipientId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando destinatario de alerta:', error)
      throw error
    }
  },

  // Guardar configuración general
  async saveGeneralConfig(config) {
    try {
      const response = await api.put('/notifications/config/general', config)
      return response.data
    } catch (error) {
      console.error('Error guardando configuración general:', error)
      throw error
    }
  },

  // Obtener configuración general
  async getGeneralConfig() {
    try {
      const response = await api.get('/notifications/config/general')
      return response.data
    } catch (error) {
      console.error('Error obteniendo configuración general:', error)
      throw error
    }
  },

  // Enviar notificación de prueba
  async sendTestNotification(notificationData) {
    try {
      const response = await api.post('/notifications/test', notificationData)
      return response.data
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error)
      throw error
    }
  },

  // Obtener estadísticas de notificaciones
  async getNotificationStats() {
    try {
      const response = await api.get('/notifications/stats')
      return response.data
    } catch (error) {
      console.error('Error obteniendo estadísticas de notificaciones:', error)
      throw error
    }
  },

  // Suscribirse a notificaciones en tiempo real (WebSocket)
  subscribeToNotifications(callback) {
    // En producción, esto usaría WebSocket o Server-Sent Events
    // Por ahora, simulamos con polling
    const interval = setInterval(async () => {
      try {
        const notifications = await this.getNotifications({ unread: true })
        callback(notifications)
      } catch (error) {
        console.error('Error en suscripción a notificaciones:', error)
      }
    }, 30000) // Poll cada 30 segundos

    return () => clearInterval(interval)
  }
}

export default notificationsService 