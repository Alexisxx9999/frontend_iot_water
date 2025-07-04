import { defineStore } from 'pinia';

// Datos mock para el CRM
const mockConversations = [
  {
    id: 1,
    clientId: 1,
    subject: 'Problema con facturación',
    lastMessage: 'Necesito ayuda con mi factura del mes pasado',
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'new', // new, in_progress, escalated, resolved
    tags: ['facturación', 'urgente'],
    assignedAgentId: null,
    priority: 'high',
    customerSatisfaction: null,
    resolutionTime: null,
    firstResponseTime: null
  },
  {
    id: 2,
    clientId: 2,
    subject: 'Consulta sobre servicios',
    lastMessage: '¿Qué servicios adicionales tienen disponibles?',
    timestamp: new Date('2024-01-15T09:15:00'),
    status: 'in_progress',
    tags: ['consulta', 'servicios'],
    assignedAgentId: 1,
    priority: 'medium',
    customerSatisfaction: null,
    resolutionTime: null,
    firstResponseTime: '5m'
  },
  {
    id: 3,
    clientId: 3,
    subject: 'Reclamo por servicio',
    lastMessage: 'El servicio no funciona correctamente desde ayer',
    timestamp: new Date('2024-01-15T08:45:00'),
    status: 'escalated',
    tags: ['reclamo', 'técnico'],
    assignedAgentId: 2,
    priority: 'high',
    customerSatisfaction: null,
    resolutionTime: null,
    firstResponseTime: '3m'
  },
  {
    id: 4,
    clientId: 4,
    subject: 'Solicitud de información',
    lastMessage: 'Gracias por la ayuda, todo resuelto',
    timestamp: new Date('2024-01-14T16:20:00'),
    status: 'resolved',
    tags: ['información', 'resuelto'],
    assignedAgentId: 1,
    priority: 'low',
    customerSatisfaction: 5,
    resolutionTime: '2h 15m',
    firstResponseTime: '8m'
  }
];

const mockClients = [
  {
    id: 1,
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '3001234567',
    company: 'Empresa ABC',
    plan: 'Premium',
    joinDate: '2023-03-15',
    lastInteraction: '2024-01-15T10:30:00',
    totalInteractions: 12,
    satisfaction: 4.2
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '3009876543',
    company: 'Corporación XYZ',
    plan: 'Standard',
    joinDate: '2023-08-20',
    lastInteraction: '2024-01-15T09:15:00',
    totalInteractions: 8,
    satisfaction: 4.5
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '3005551234',
    company: 'Startup Tech',
    plan: 'Premium',
    joinDate: '2023-11-10',
    lastInteraction: '2024-01-15T08:45:00',
    totalInteractions: 15,
    satisfaction: 3.8
  },
  {
    id: 4,
    name: 'Luis Pérez',
    email: 'luis.perez@email.com',
    phone: '3007778888',
    company: 'Consultora Delta',
    plan: 'Basic',
    joinDate: '2023-05-05',
    lastInteraction: '2024-01-14T16:20:00',
    totalInteractions: 6,
    satisfaction: 4.7
  }
];

const mockMessages = [
  {
    id: 1,
    conversationId: 1,
    senderId: 1,
    senderType: 'client', // client, agent, system
    content: 'Hola, tengo un problema con mi factura del mes pasado',
    timestamp: new Date('2024-01-15T10:30:00'),
    isRead: true
  },
  {
    id: 2,
    conversationId: 2,
    senderId: 2,
    senderType: 'client',
    content: '¿Qué servicios adicionales tienen disponibles?',
    timestamp: new Date('2024-01-15T09:15:00'),
    isRead: true
  },
  {
    id: 3,
    conversationId: 2,
    senderId: 1,
    senderType: 'agent',
    content: 'Hola Carlos, tenemos varios servicios adicionales disponibles. ¿Te gustaría que te envíe el catálogo completo?',
    timestamp: new Date('2024-01-15T09:20:00'),
    isRead: true
  },
  {
    id: 4,
    conversationId: 3,
    senderId: 3,
    senderType: 'client',
    content: 'El servicio no funciona correctamente desde ayer',
    timestamp: new Date('2024-01-15T08:45:00'),
    isRead: true
  },
  {
    id: 5,
    conversationId: 3,
    senderId: 2,
    senderType: 'agent',
    content: 'Entiendo el problema Ana. Voy a escalar esto a nuestro equipo técnico para una solución rápida.',
    timestamp: new Date('2024-01-15T08:48:00'),
    isRead: true
  }
];

const mockAgents = [
  { id: 1, name: 'Juan Pérez', email: 'juan.perez@empresa.com', status: 'online', department: 'Soporte' },
  { id: 2, name: 'María Gómez', email: 'maria.gomez@empresa.com', status: 'online', department: 'Técnico' },
  { id: 3, name: 'Carlos López', email: 'carlos.lopez@empresa.com', status: 'offline', department: 'Ventas' }
];

const mockTags = [
  'facturación', 'técnico', 'consulta', 'reclamo', 'urgente', 'resuelto', 'servicios', 'información'
];

export const useCrmStore = defineStore('crm', {
  state: () => ({
    conversations: [...mockConversations],
    clients: [...mockClients],
    messages: [...mockMessages],
    agents: [...mockAgents],
    tags: [...mockTags],
    currentConversation: null,
    currentClient: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      status: '',
      tags: [],
      assignedAgent: '',
      priority: '',
      dateRange: null
    },
    kpis: {
      averageResponseTime: '8.5m',
      firstResponseResolution: '78%',
      netPromoterScore: 4.2,
      customerSatisfaction: '92%',
      totalConversations: 156,
      activeConversations: 23,
      resolvedToday: 12
    },
    chatbotTraining: {
      modelInfo: {
        version: 'v2.1.4',
        lastUpdate: '2024-01-10T14:30:00',
        accuracy: 87
      },
      trainingData: {
        newInteractions: 156,
        improvements: 23,
        estimatedTime: '15-20 minutos'
      },
      trainingStatus: 'idle', // idle, training, completed, error
      recentContributions: [
        {
          id: 1,
          type: 'feedback',
          interactions: 150,
          improvement: '+15% accuracy',
          date: '2024-01-10T14:30:00'
        },
        {
          id: 2,
          type: 'correction',
          interactions: 89,
          improvement: '+8% satisfaction',
          date: '2024-01-08T11:20:00'
        },
        {
          id: 3,
          type: 'new_pattern',
          interactions: 234,
          improvement: '+22% precision',
          date: '2024-01-05T09:15:00'
        },
        {
          id: 4,
          type: 'optimization',
          interactions: 67,
          improvement: '+12% response_time',
          date: '2024-01-03T16:45:00'
        }
      ]
    }
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    
    // Filtrado de conversaciones
    getFilteredConversations: (state) => {
      let filtered = [...state.conversations];
      
      // Búsqueda
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        filtered = filtered.filter(conv => {
          const client = state.clients.find(c => c.id === conv.clientId);
          return (
            client?.name.toLowerCase().includes(search) ||
            conv.subject.toLowerCase().includes(search) ||
            conv.lastMessage.toLowerCase().includes(search)
          );
        });
      }
      
      // Filtro por estado
      if (state.filters.status) {
        filtered = filtered.filter(conv => conv.status === state.filters.status);
      }
      
      // Filtro por etiquetas
      if (state.filters.tags.length > 0) {
        filtered = filtered.filter(conv => 
          state.filters.tags.some(tag => conv.tags.includes(tag))
        );
      }
      
      // Filtro por agente asignado
      if (state.filters.assignedAgent) {
        filtered = filtered.filter(conv => conv.assignedAgentId == state.filters.assignedAgent);
      }
      
      // Filtro por prioridad
      if (state.filters.priority) {
        filtered = filtered.filter(conv => conv.priority === state.filters.priority);
      }
      
      return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    
    // Obtener conversación actual
    getCurrentConversation: (state) => state.currentConversation,
    
    // Obtener cliente actual
    getCurrentClient: (state) => {
      if (!state.currentConversation) return null;
      return state.clients.find(c => c.id === state.currentConversation.clientId);
    },
    
    // Obtener mensajes de conversación actual
    getCurrentMessages: (state) => {
      if (!state.currentConversation) return [];
      return state.messages
        .filter(m => m.conversationId === state.currentConversation.id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
    
    // Obtener agente asignado
    getAssignedAgent: (state) => (conversationId) => {
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (!conversation?.assignedAgentId) return null;
      return state.agents.find(a => a.id === conversation.assignedAgentId);
    },
    
    // Estadísticas por estado
    getStatusStats: (state) => {
      const stats = {
        new: 0,
        in_progress: 0,
        escalated: 0,
        resolved: 0
      };
      
      state.conversations.forEach(conv => {
        stats[conv.status]++;
      });
      
      return stats;
    },
    
    // KPIs en tiempo real
    getRealTimeKPIs: (state) => state.kpis,
    
    // Estado del chatbot
    getChatbotStatus: (state) => state.chatbotTraining
  },

  actions: {
    // Configurar filtros
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    
    // Limpiar filtros
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        tags: [],
        assignedAgent: '',
        priority: '',
        dateRange: null
      };
    },
    
    // Seleccionar conversación
    selectConversation(conversationId) {
      this.currentConversation = this.conversations.find(c => c.id === conversationId);
    },
    
    // Enviar mensaje
    async sendMessage(conversationId, content, senderId, senderType = 'agent') {
      const newMessage = {
        id: Date.now(),
        conversationId,
        senderId,
        senderType,
        content,
        timestamp: new Date(),
        isRead: false
      };
      
      this.messages.push(newMessage);
      
      // Actualizar último mensaje en conversación
      const conversation = this.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = content;
        conversation.timestamp = new Date();
      }
      
      return newMessage;
    },
    
    // Asignar agente
    async assignAgent(conversationId, agentId) {
      const conversation = this.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.assignedAgentId = agentId;
        if (conversation.status === 'new') {
          conversation.status = 'in_progress';
        }
      }
    },
    
    // Cambiar estado de conversación
    async updateConversationStatus(conversationId, status) {
      const conversation = this.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.status = status;
        if (status === 'resolved') {
          conversation.resolutionTime = this.calculateResolutionTime(conversation);
        }
      }
    },
    
    // Agregar/remover etiquetas
    async updateConversationTags(conversationId, tags) {
      const conversation = this.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.tags = tags;
      }
    },
    
    // Agregar nota interna
    async addInternalNote(conversationId, note) {
      const noteMessage = {
        id: Date.now(),
        conversationId,
        senderId: 'system',
        senderType: 'system',
        content: `[NOTA INTERNA] ${note}`,
        timestamp: new Date(),
        isRead: true
      };
      
      this.messages.push(noteMessage);
    },
    
    // Calcular tiempo de resolución
    calculateResolutionTime(conversation) {
      const firstMessage = this.messages
        .filter(m => m.conversationId === conversation.id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
      
      if (!firstMessage) return null;
      
      const resolutionTime = new Date() - new Date(firstMessage.timestamp);
      const hours = Math.floor(resolutionTime / (1000 * 60 * 60));
      const minutes = Math.floor((resolutionTime % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    },
    
    // Actualizar KPIs
    updateKPIs() {
      // Simular actualización de KPIs en tiempo real
      this.kpis.averageResponseTime = `${Math.floor(Math.random() * 10) + 5}m`;
      this.kpis.firstResponseResolution = `${Math.floor(Math.random() * 20) + 70}%`;
      this.kpis.customerSatisfaction = `${Math.floor(Math.random() * 10) + 85}%`;
    },
    
    // Entrenar chatbot
    async trainChatbot() {
      this.chatbotTraining.trainingStatus = 'training';
      
      // Simular proceso de entrenamiento
      setTimeout(() => {
        this.chatbotTraining.trainingStatus = 'completed';
        this.chatbotTraining.modelInfo.version = `v2.1.${Math.floor(Math.random() * 10) + 5}`;
        this.chatbotTraining.modelInfo.lastUpdate = new Date().toISOString();
        this.chatbotTraining.modelInfo.accuracy = Math.floor(Math.random() * 15) + 80;
        
        // Agregar nueva contribución
        this.chatbotTraining.recentContributions.unshift({
          id: Date.now(),
          type: 'optimization',
          interactions: Math.floor(Math.random() * 200) + 100,
          improvement: `+${Math.floor(Math.random() * 20) + 10}% accuracy`,
          date: new Date().toISOString()
        });
      }, 5000);
    },
    
    // Cargar datos iniciales
    async fetchInitialData() {
      this.loading = true;
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.updateKPIs();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    // Limpiar error
    clearError() {
      this.error = null;
    }
  }
});
