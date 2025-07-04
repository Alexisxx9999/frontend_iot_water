// ===== FORMATEO DE FECHAS Y TIEMPO =====

/**
 * Formatea una fecha para mostrar en la interfaz
 * @param {Date|string} date - Fecha a formatear
 * @param {string} format - Formato deseado ('short', 'long', 'time', 'relative')
 * @returns {string} Fecha formateada
 */
export function formatDate(date, format = 'short') {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    
    case 'long':
      return dateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    case 'time':
      return dateObj.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'datetime':
      return dateObj.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'relative':
      return getRelativeTime(dateObj);
    
    default:
      return dateObj.toLocaleDateString('es-ES');
  }
}

/**
 * Obtiene el tiempo relativo (ej: "hace 5 minutos")
 * @param {Date} date - Fecha a comparar
 * @returns {string} Tiempo relativo
 */
export function getRelativeTime(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace un momento';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }
  
  return formatDate(date, 'short');
}

/**
 * Calcula el tiempo transcurrido entre dos fechas
 * @param {Date|string} startDate - Fecha de inicio
 * @param {Date|string} endDate - Fecha de fin (opcional, usa fecha actual si no se proporciona)
 * @returns {string} Tiempo formateado
 */
export function calculateTimeElapsed(startDate, endDate = null) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffInMs = end - start;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    return `${diffInDays}d ${diffInHours % 24}h ${diffInMinutes % 60}m`;
  } else if (diffInHours > 0) {
    return `${diffInHours}h ${diffInMinutes % 60}m`;
  } else {
    return `${diffInMinutes}m`;
  }
}

// ===== ESTADOS Y PRIORIDADES =====

/**
 * Obtiene la información del estado de una conversación
 * @param {string} status - Estado de la conversación
 * @returns {object} Información del estado
 */
export function getStatusInfo(status) {
  const statusMap = {
    new: {
      label: 'Nuevo',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: '🔵'
    },
    in_progress: {
      label: 'En Proceso',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '🟡'
    },
    escalated: {
      label: 'Escalado',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: '🔴'
    },
    resolved: {
      label: 'Resuelto',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '🟢'
    },
    closed: {
      label: 'Cerrado',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: '⚫'
    }
  };
  
  return statusMap[status] || statusMap.new;
}

/**
 * Obtiene la información de prioridad
 * @param {string} priority - Prioridad de la conversación
 * @returns {object} Información de prioridad
 */
export function getPriorityInfo(priority) {
  const priorityMap = {
    low: {
      label: 'Baja',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '⬇️'
    },
    medium: {
      label: 'Media',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '➡️'
    },
    high: {
      label: 'Alta',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: '⬆️'
    },
    urgent: {
      label: 'Urgente',
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: '🚨'
    }
  };
  
  return priorityMap[priority] || priorityMap.medium;
}

// ===== VALIDACIONES =====

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Valida el contenido de un mensaje
 * @param {string} content - Contenido del mensaje
 * @returns {object} Resultado de la validación
 */
export function validateMessageContent(content) {
  const minLength = 1;
  const maxLength = 1000;
  
  if (!content || content.trim().length < minLength) {
    return {
      isValid: false,
      error: 'El mensaje no puede estar vacío'
    };
  }
  
  if (content.length > maxLength) {
    return {
      isValid: false,
      error: `El mensaje no puede tener más de ${maxLength} caracteres`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
}

// ===== CÁLCULOS DE KPIs =====

/**
 * Calcula el tiempo promedio de respuesta
 * @param {Array} conversations - Lista de conversaciones
 * @returns {string} Tiempo promedio formateado
 */
export function calculateAverageResponseTime(conversations) {
  const conversationsWithResponseTime = conversations.filter(conv => conv.firstResponseTime);
  
  if (conversationsWithResponseTime.length === 0) {
    return '0m';
  }
  
  const totalMinutes = conversationsWithResponseTime.reduce((total, conv) => {
    const timeStr = conv.firstResponseTime;
    const minutes = parseInt(timeStr.replace(/[^0-9]/g, ''));
    return total + minutes;
  }, 0);
  
  const averageMinutes = Math.round(totalMinutes / conversationsWithResponseTime.length);
  return `${averageMinutes}m`;
}

/**
 * Calcula el porcentaje de resolución en primera respuesta
 * @param {Array} conversations - Lista de conversaciones
 * @returns {string} Porcentaje formateado
 */
export function calculateFirstResponseResolution(conversations) {
  const resolvedConversations = conversations.filter(conv => conv.status === 'resolved');
  
  if (resolvedConversations.length === 0) {
    return '0%';
  }
  
  const firstResponseResolved = resolvedConversations.filter(conv => 
    conv.firstResponseTime && conv.resolutionTime === conv.firstResponseTime
  );
  
  const percentage = Math.round((firstResponseResolved.length / resolvedConversations.length) * 100);
  return `${percentage}%`;
}

/**
 * Calcula el Net Promoter Score (NPS)
 * @param {Array} conversations - Lista de conversaciones
 * @returns {number} NPS calculado
 */
export function calculateNPS(conversations) {
  const conversationsWithSatisfaction = conversations.filter(conv => 
    conv.customerSatisfaction !== null && conv.customerSatisfaction !== undefined
  );
  
  if (conversationsWithSatisfaction.length === 0) {
    return 0;
  }
  
  const promoters = conversationsWithSatisfaction.filter(conv => conv.customerSatisfaction >= 4).length;
  const detractors = conversationsWithSatisfaction.filter(conv => conv.customerSatisfaction <= 2).length;
  const total = conversationsWithSatisfaction.length;
  
  const nps = ((promoters - detractors) / total) * 100;
  return Math.round(nps);
}

/**
 * Calcula la satisfacción promedio del cliente
 * @param {Array} conversations - Lista de conversaciones
 * @returns {string} Satisfacción promedio formateada
 */
export function calculateCustomerSatisfaction(conversations) {
  const conversationsWithSatisfaction = conversations.filter(conv => 
    conv.customerSatisfaction !== null && conv.customerSatisfaction !== undefined
  );
  
  if (conversationsWithSatisfaction.length === 0) {
    return '0%';
  }
  
  const totalSatisfaction = conversationsWithSatisfaction.reduce((total, conv) => {
    return total + conv.customerSatisfaction;
  }, 0);
  
  const averageSatisfaction = totalSatisfaction / conversationsWithSatisfaction.length;
  const percentage = Math.round((averageSatisfaction / 5) * 100);
  
  return `${percentage}%`;
}

// ===== UTILIDADES DE ETIQUETAS =====

/**
 * Obtiene el color para una etiqueta
 * @param {string} tag - Nombre de la etiqueta
 * @returns {object} Información de color
 */
export function getTagColor(tag) {
  const tagColors = {
    'facturación': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'técnico': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'consulta': { bg: 'bg-green-100', text: 'text-green-800' },
    'reclamo': { bg: 'bg-red-100', text: 'text-red-800' },
    'urgente': { bg: 'bg-orange-100', text: 'text-orange-800' },
    'resuelto': { bg: 'bg-gray-100', text: 'text-gray-800' },
    'servicios': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    'información': { bg: 'bg-cyan-100', text: 'text-cyan-800' }
  };
  
  return tagColors[tag] || { bg: 'bg-gray-100', text: 'text-gray-800' };
}

/**
 * Filtra etiquetas por texto de búsqueda
 * @param {Array} tags - Lista de etiquetas
 * @param {string} searchText - Texto de búsqueda
 * @returns {Array} Etiquetas filtradas
 */
export function filterTags(tags, searchText) {
  if (!searchText) return tags;
  
  return tags.filter(tag => 
    tag.toLowerCase().includes(searchText.toLowerCase())
  );
}

// ===== UTILIDADES DE MENSAJES =====

/**
 * Obtiene la información del tipo de remitente
 * @param {string} senderType - Tipo de remitente
 * @returns {object} Información del remitente
 */
export function getSenderInfo(senderType) {
  const senderMap = {
    client: {
      label: 'Cliente',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: '👤'
    },
    agent: {
      label: 'Agente',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: '🛡️'
    },
    system: {
      label: 'Sistema',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '⚙️'
    }
  };
  
  return senderMap[senderType] || senderMap.client;
}

/**
 * Verifica si un mensaje es una nota interna
 * @param {object} message - Mensaje a verificar
 * @returns {boolean} True si es nota interna
 */
export function isInternalNote(message) {
  return message.senderType === 'system' && 
         message.content.includes('[NOTA INTERNA]');
}

/**
 * Extrae el contenido de una nota interna
 * @param {string} content - Contenido del mensaje
 * @returns {string} Contenido sin el prefijo de nota interna
 */
export function extractInternalNoteContent(content) {
  return content.replace('[NOTA INTERNA]', '').trim();
}

// ===== UTILIDADES DE EXPORTACIÓN =====

/**
 * Prepara datos para exportación
 * @param {Array} conversations - Lista de conversaciones
 * @returns {Array} Datos formateados para exportación
 */
export function prepareDataForExport(conversations) {
  return conversations.map(conv => ({
    ID: conv.id,
    Cliente: conv.clientName || 'N/A',
    Asunto: conv.subject,
    Estado: getStatusInfo(conv.status).label,
    Prioridad: getPriorityInfo(conv.priority).label,
    'Último Mensaje': conv.lastMessage,
    'Fecha': formatDate(conv.timestamp, 'datetime'),
    'Tiempo de Respuesta': conv.firstResponseTime || 'N/A',
    'Tiempo de Resolución': conv.resolutionTime || 'N/A',
    'Satisfacción': conv.customerSatisfaction || 'N/A',
    'Etiquetas': conv.tags.join(', ') || 'N/A'
  }));
}

// ===== UTILIDADES DE NOTIFICACIONES =====

/**
 * Crea una notificación
 * @param {string} type - Tipo de notificación
 * @param {string} message - Mensaje de la notificación
 * @param {object} data - Datos adicionales
 * @returns {object} Notificación formateada
 */
export function createNotification(type, message, data = {}) {
  return {
    id: Date.now(),
    type,
    message,
    timestamp: new Date(),
    read: false,
    data
  };
}

/**
 * Obtiene el icono para el tipo de notificación
 * @param {string} type - Tipo de notificación
 * @returns {string} Icono
 */
export function getNotificationIcon(type) {
  const icons = {
    new_conversation: '💬',
    message_received: '📨',
    conversation_assigned: '👤',
    conversation_resolved: '✅',
    urgent_conversation: '🚨',
    system_alert: '⚠️'
  };
  
  return icons[type] || '📢';
} 