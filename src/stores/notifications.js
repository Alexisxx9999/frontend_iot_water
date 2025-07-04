import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useNotificationsStore = defineStore('notifications', () => {
  // Estado reactivo
  const loading = ref(false)
  const error = ref(null)
  const notifications = ref([])
  const unreadCount = ref(0)

  // Getters
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const errorMessage = computed(() => error.value)
  const unreadNotifications = computed(() => notifications.value.filter(n => !n.leida))
  const criticalNotifications = computed(() => notifications.value.filter(n => n.prioridad === 'CRITICA' && !n.leida))

  // Acciones
  const loadNotifications = async () => {
    loading.value = true
    error.value = null

    try {
      // Simular llamada a API - en producción esto sería una llamada real
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generar notificaciones de ejemplo
      const mockNotifications = generateMockNotifications()
      notifications.value = mockNotifications
      unreadCount.value = mockNotifications.filter(n => !n.leida).length

    } catch (err) {
      error.value = 'Error al cargar notificaciones: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.leida) {
        notification.leida = true
        unreadCount.value--
        // Aquí se haría la llamada a la API
      }
    } catch (err) {
      error.value = 'Error al marcar como leída: ' + err.message
      throw err
    }
  }

  const markAsUnread = async (notificationId) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && notification.leida) {
        notification.leida = false
        unreadCount.value++
        // Aquí se haría la llamada a la API
      }
    } catch (err) {
      error.value = 'Error al marcar como no leída: ' + err.message
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      notifications.value.forEach(n => {
        if (!n.leida) {
          n.leida = true
        }
      })
      unreadCount.value = 0
      // Aquí se haría la llamada a la API
    } catch (err) {
      error.value = 'Error al marcar todo como leído: ' + err.message
      throw err
    }
  }

  const markMultipleAsRead = async (notificationIds) => {
    try {
      notificationIds.forEach(id => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification && !notification.leida) {
          notification.leida = true
        }
      })
      unreadCount.value = notifications.value.filter(n => !n.leida).length
      // Aquí se haría la llamada a la API
    } catch (err) {
      error.value = 'Error al marcar múltiples como leídas: ' + err.message
      throw err
    }
  }

  const archiveNotification = async (notificationId) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.archivada = true
        // Aquí se haría la llamada a la API
      }
    } catch (err) {
      error.value = 'Error al archivar notificación: ' + err.message
      throw err
    }
  }

  const unarchiveNotification = async (notificationId) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.archivada = false
        // Aquí se haría la llamada a la API
      }
    } catch (err) {
      error.value = 'Error al desarchivar notificación: ' + err.message
      throw err
    }
  }

  const archiveMultiple = async (notificationIds) => {
    try {
      notificationIds.forEach(id => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
          notification.archivada = true
        }
      })
      // Aquí se haría la llamada a la API
    } catch (err) {
      error.value = 'Error al archivar múltiples notificaciones: ' + err.message
      throw err
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
      unreadCount.value = notifications.value.filter(n => !n.leida).length
      // Aquí se haría la llamada a la API
    } catch (err) {
      error.value = 'Error al eliminar notificación: ' + err.message
      throw err
    }
  }

  const deleteMultiple = async (notificationIds) => {
    try {
      notifications.value = notifications.value.filter(n => !notificationIds.includes(n.id))
      unreadCount.value = notifications.value.filter(n => !n.leida).length
      // Aquí se haría la llamada a la API
    } catch (err) {
      error.value = 'Error al eliminar múltiples notificaciones: ' + err.message
      throw err
    }
  }

  const createNotification = async (notificationData) => {
    try {
      const newNotification = {
        id: Date.now(),
        fechaCreacion: new Date().toISOString(),
        leida: false,
        archivada: false,
        ...notificationData
      }

      notifications.value.unshift(newNotification)
      if (!newNotification.leida) {
        unreadCount.value++
      }

      // Aquí se haría la llamada a la API
      return newNotification
    } catch (err) {
      error.value = 'Error al crear notificación: ' + err.message
      throw err
    }
  }

  // Funciones auxiliares para generar datos de ejemplo
  const generateMockNotifications = () => {
    return [
      {
        id: 1,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'ALERTA_DISPOSITIVO',
        titulo: 'Batería baja en dispositivo DEV001',
        mensaje: 'El dispositivo DEV001 ubicado en Sector Norte tiene la batería al 15%. Se requiere mantenimiento.',
        metadata: {
          dispositivoId: 'DEV001',
          sector: 'Norte',
          bateria: 15
        },
        fechaCreacion: '2024-01-20T10:30:00Z',
        leida: false,
        archivada: false,
        canalPreferidoEnviado: 'IN_APP',
        prioridad: 'MEDIA'
      },
      {
        id: 2,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'NUEVA_DENUNCIA',
        titulo: 'Nueva denuncia ciudadana registrada',
        mensaje: 'Se ha registrado una nueva denuncia sobre fuga de agua en la calle Principal #123.',
        metadata: {
          denunciaId: 'DEN001',
          sector: 'Centro',
          direccion: 'Calle Principal #123'
        },
        fechaCreacion: '2024-01-20T09:15:00Z',
        leida: false,
        archivada: false,
        canalPreferidoEnviado: 'EMAIL',
        prioridad: 'ALTA'
      },
      {
        id: 3,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'INCIDENTE_ACTUALIZADO',
        titulo: 'Incidente INC001 actualizado',
        mensaje: 'El incidente INC001 ha sido asignado al técnico Juan Pérez y está en proceso de resolución.',
        metadata: {
          incidenteId: 'INC001',
          tecnico: 'Juan Pérez',
          estado: 'En Proceso'
        },
        fechaCreacion: '2024-01-20T08:45:00Z',
        leida: true,
        archivada: false,
        canalPreferidoEnviado: 'IN_APP',
        prioridad: 'MEDIA'
      },
      {
        id: 4,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'CONSUMO_ANORMAL',
        titulo: 'Consumo anormal detectado',
        mensaje: 'Se ha detectado un consumo anormal de 150 m³ en el sector Sur, superando el umbral establecido.',
        metadata: {
          sector: 'Sur',
          consumo: 150,
          umbral: 100
        },
        fechaCreacion: '2024-01-20T07:30:00Z',
        leida: false,
        archivada: false,
        canalPreferidoEnviado: 'WHATSAPP',
        prioridad: 'CRITICA'
      },
      {
        id: 5,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'MANTENIMIENTO_PROGRAMADO',
        titulo: 'Mantenimiento programado para mañana',
        mensaje: 'Se ha programado mantenimiento preventivo para el dispositivo DEV005 ubicado en Sector Este.',
        metadata: {
          dispositivoId: 'DEV005',
          sector: 'Este',
          fecha: '2024-01-21'
        },
        fechaCreacion: '2024-01-20T06:00:00Z',
        leida: true,
        archivada: false,
        canalPreferidoEnviado: 'IN_APP',
        prioridad: 'BAJA'
      },
      {
        id: 6,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'BATERIA_BAJA',
        titulo: 'Múltiples dispositivos con batería baja',
        mensaje: '5 dispositivos en el sector Oeste tienen la batería por debajo del 20%. Revisión requerida.',
        metadata: {
          sector: 'Oeste',
          dispositivos: ['DEV010', 'DEV011', 'DEV012', 'DEV013', 'DEV014'],
          cantidad: 5
        },
        fechaCreacion: '2024-01-19T18:20:00Z',
        leida: false,
        archivada: true,
        canalPreferidoEnviado: 'EMAIL',
        prioridad: 'ALTA'
      },
      {
        id: 7,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'ALERTA_DISPOSITIVO',
        titulo: 'Dispositivo DEV008 desconectado',
        mensaje: 'El dispositivo DEV008 no ha reportado datos en las últimas 2 horas. Verificar conexión.',
        metadata: {
          dispositivoId: 'DEV008',
          sector: 'Norte',
          ultimaComunicacion: '2024-01-19T16:00:00Z'
        },
        fechaCreacion: '2024-01-19T18:00:00Z',
        leida: true,
        archivada: false,
        canalPreferidoEnviado: 'SMS',
        prioridad: 'CRITICA'
      },
      {
        id: 8,
        idUsuarioDestinatario: 1,
        tipoNotificacion: 'NUEVA_DENUNCIA',
        titulo: 'Denuncia sobre calidad del agua',
        mensaje: 'Nueva denuncia sobre calidad del agua en el sector Este. Cliente reporta agua turbia.',
        metadata: {
          denunciaId: 'DEN002',
          sector: 'Este',
          tipo: 'Calidad del agua'
        },
        fechaCreacion: '2024-01-19T17:30:00Z',
        leida: true,
        archivada: false,
        canalPreferidoEnviado: 'IN_APP',
        prioridad: 'ALTA'
      }
    ]
  }

  return {
    // Estado
    loading,
    error,
    notifications,
    unreadCount,

    // Getters
    isLoading,
    hasError,
    errorMessage,
    unreadNotifications,
    criticalNotifications,

    // Acciones
    loadNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markMultipleAsRead,
    archiveNotification,
    unarchiveNotification,
    archiveMultiple,
    deleteNotification,
    deleteMultiple,
    createNotification
  }
}) 