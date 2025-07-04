<template>
  <div class="alerts-configuration">
    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === tab.id 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tipos de Alerta -->
    <div v-if="activeTab === 'types'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">📋 Tipos de Alerta</h3>
        <button 
          @click="showNewAlertModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Nuevo Tipo de Alerta
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="alert in alertTypes" :key="alert.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ alert.nombre }}</div>
                  <div class="text-sm text-gray-500">{{ alert.descripcion }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ alert.codigo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getPriorityClass(alert.prioridadDefault)"
                >
                  {{ alert.prioridadDefault }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="alert.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ alert.activa ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editAlertType(alert)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  ✏️ Editar
                </button>
                <button 
                  @click="toggleAlertStatus(alert.id)"
                  class="text-gray-600 hover:text-gray-900"
                >
                  {{ alert.activa ? '⏸️ Desactivar' : '▶️ Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Destinatarios -->
    <div v-if="activeTab === 'recipients'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">👥 Destinatarios</h3>
        <button 
          @click="showNewRecipientModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Nuevo Destinatario
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alerta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destinatario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Canal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="recipient in alertRecipients" :key="recipient.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getAlertTypeName(recipient.idConfigAlerta) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getRecipientName(recipient) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ recipient.canalEnvio }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editRecipient(recipient)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  ✏️ Editar
                </button>
                <button 
                  @click="deleteRecipient(recipient.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Configuración General -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">⚙️ Configuración General</h3>
      
      <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <!-- Frecuencia de alertas -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">⏰ Frecuencia de Alertas</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Frecuencia mínima entre alertas del mismo tipo (horas)</label>
              <input 
                v-model="generalConfig.frecuenciaMinima"
                type="number"
                min="1"
                max="168"
                class="w-20 p-2 border border-gray-300 rounded-lg"
              >
            </div>
            <p class="text-xs text-gray-500">Evita el spam de alertas del mismo tipo</p>
          </div>
        </div>

        <!-- Canales de notificación -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">📡 Canales de Notificación</h4>
          <div class="space-y-3">
            <label class="flex items-center space-x-2">
              <input 
                v-model="generalConfig.canales.inApp"
                type="checkbox"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-gray-700">Notificaciones en la aplicación</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                v-model="generalConfig.canales.email"
                type="checkbox"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-gray-700">Notificaciones por email</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                v-model="generalConfig.canales.sms"
                type="checkbox"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-gray-700">Notificaciones por SMS</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                v-model="generalConfig.canales.whatsapp"
                type="checkbox"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-gray-700">Notificaciones por WhatsApp</span>
            </label>
          </div>
        </div>

        <!-- Horarios de notificación -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">🕐 Horarios de Notificación</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Hora de inicio</label>
              <input 
                v-model="generalConfig.horarioInicio"
                type="time"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Hora de fin</label>
              <input 
                v-model="generalConfig.horarioFin"
                type="time"
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Las alertas críticas se enviarán fuera de estos horarios</p>
        </div>

        <!-- Guardar configuración -->
        <div class="pt-4 border-t border-gray-200">
          <button 
            @click="saveGeneralConfig"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            💾 Guardar Configuración
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo Tipo de Alerta -->
    <div v-if="showNewAlertModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-900">➕ Nuevo Tipo de Alerta</h3>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              v-model="newAlertType.nombre"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Alerta de Batería Baja"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
            <input 
              v-model="newAlertType.codigo"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: ALERT_BAT_LOW"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              v-model="newAlertType.descripcion"
              rows="3"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción del tipo de alerta"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad por defecto</label>
            <select 
              v-model="newAlertType.prioridadDefault"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICA">Crítica</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Regla de activación</label>
            <textarea 
              v-model="newAlertType.reglaJson"
              rows="3"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder='{"campo": "bateria", "operador": "<", "valor": 20}'
            ></textarea>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            @click="showNewAlertModal = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="createAlertType"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo Destinatario -->
    <div v-if="showNewRecipientModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-900">➕ Nuevo Destinatario</h3>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Alerta</label>
            <select 
              v-model="newRecipient.idConfigAlerta"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar tipo de alerta</option>
              <option v-for="alert in alertTypes" :key="alert.id" :value="alert.id">
                {{ alert.nombre }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Destinatario</label>
            <select 
              v-model="newRecipient.tipoDestinatario"
              @change="onTipoDestinatarioChange"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rol">Por Rol</option>
              <option value="usuario">Por Usuario</option>
            </select>
          </div>
          
          <div v-if="newRecipient.tipoDestinatario === 'rol'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select 
              v-model="newRecipient.idRolDestinatario"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="tecnico">Técnico</option>
              <option value="operador">Operador</option>
            </select>
          </div>
          
          <div v-if="newRecipient.tipoDestinatario === 'usuario'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <select 
              v-model="newRecipient.idUsuarioDestinatario"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar usuario</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.nombre }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Canal de Envío</label>
            <select 
              v-model="newRecipient.canalEnvio"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="IN_APP">En la aplicación</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            @click="showNewRecipientModal = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="createRecipient"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'AlertsConfiguration',
  setup() {
    const notificationsStore = useNotificationsStore()
    
    // Estado reactivo
    const activeTab = ref('types')
    const showNewAlertModal = ref(false)
    const showNewRecipientModal = ref(false)
    
    const tabs = [
      { id: 'types', label: 'Tipos de Alerta' },
      { id: 'recipients', label: 'Destinatarios' },
      { id: 'general', label: 'Configuración General' }
    ]

    // Datos de ejemplo
    const alertTypes = ref([
      {
        id: 1,
        nombre: 'Alerta de Batería Baja',
        codigo: 'ALERT_BAT_LOW',
        descripcion: 'Se activa cuando la batería de un dispositivo está por debajo del 20%',
        prioridadDefault: 'MEDIA',
        activa: true,
        reglaJson: '{"campo": "bateria", "operador": "<", "valor": 20}',
        frecuenciaEnvioMinHoras: 24
      },
      {
        id: 2,
        nombre: 'Consumo Anormal',
        codigo: 'ALERT_CONSUMPTION_HIGH',
        descripcion: 'Se activa cuando el consumo de agua supera el umbral establecido',
        prioridadDefault: 'ALTA',
        activa: true,
        reglaJson: '{"campo": "consumo", "operador": ">", "valor": 100}',
        frecuenciaEnvioMinHoras: 6
      },
      {
        id: 3,
        nombre: 'Dispositivo Desconectado',
        codigo: 'ALERT_DEVICE_OFFLINE',
        descripcion: 'Se activa cuando un dispositivo no reporta datos por más de 1 hora',
        prioridadDefault: 'CRITICA',
        activa: true,
        reglaJson: '{"campo": "ultima_comunicacion", "operador": "<", "valor": "1_hora"}',
        frecuenciaEnvioMinHoras: 1
      }
    ])

    const alertRecipients = ref([
      {
        id: 1,
        idConfigAlerta: 1,
        idRolDestinatario: 'tecnico',
        idUsuarioDestinatario: null,
        canalEnvio: 'IN_APP'
      },
      {
        id: 2,
        idConfigAlerta: 2,
        idRolDestinatario: null,
        idUsuarioDestinatario: 1,
        canalEnvio: 'EMAIL'
      },
      {
        id: 3,
        idConfigAlerta: 3,
        idRolDestinatario: 'admin',
        idUsuarioDestinatario: null,
        canalEnvio: 'WHATSAPP'
      }
    ])

    const users = ref([
      { id: 1, nombre: 'Juan Pérez' },
      { id: 2, nombre: 'María García' },
      { id: 3, nombre: 'Carlos López' }
    ])

    const generalConfig = ref({
      frecuenciaMinima: 24,
      canales: {
        inApp: true,
        email: true,
        sms: false,
        whatsapp: true
      },
      horarioInicio: '08:00',
      horarioFin: '18:00'
    })

    const newAlertType = ref({
      nombre: '',
      codigo: '',
      descripcion: '',
      prioridadDefault: 'MEDIA',
      reglaJson: ''
    })

    const newRecipient = ref({
      idConfigAlerta: '',
      tipoDestinatario: 'rol',
      idRolDestinatario: '',
      idUsuarioDestinatario: '',
      canalEnvio: 'IN_APP'
    })

    // Methods
    const getPriorityClass = (prioridad) => {
      const classMap = {
        'BAJA': 'bg-gray-100 text-gray-800',
        'MEDIA': 'bg-yellow-100 text-yellow-800',
        'ALTA': 'bg-orange-100 text-orange-800',
        'CRITICA': 'bg-red-100 text-red-800'
      }
      return classMap[prioridad] || 'bg-gray-100 text-gray-800'
    }

    const getAlertTypeName = (alertId) => {
      const alert = alertTypes.value.find(a => a.id === alertId)
      return alert ? alert.nombre : 'Desconocido'
    }

    const getRecipientName = (recipient) => {
      if (recipient.idRolDestinatario) {
        return `Rol: ${recipient.idRolDestinatario}`
      } else if (recipient.idUsuarioDestinatario) {
        const user = users.value.find(u => u.id === recipient.idUsuarioDestinatario)
        return user ? user.nombre : 'Usuario desconocido'
      }
      return 'Destinatario no especificado'
    }

    const editAlertType = (alert) => {
      // Implementar edición
      console.log('Editar alerta:', alert)
    }

    const toggleAlertStatus = async (alertId) => {
      const alert = alertTypes.value.find(a => a.id === alertId)
      if (alert) {
        alert.activa = !alert.activa
        // Aquí se haría la llamada a la API
      }
    }

    const editRecipient = (recipient) => {
      // Implementar edición
      console.log('Editar destinatario:', recipient)
    }

    const deleteRecipient = async (recipientId) => {
      if (confirm('¿Estás seguro de que quieres eliminar este destinatario?')) {
        alertRecipients.value = alertRecipients.value.filter(r => r.id !== recipientId)
        // Aquí se haría la llamada a la API
      }
    }

    const createAlertType = async () => {
      if (!newAlertType.value.nombre || !newAlertType.value.codigo) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      const newAlert = {
        id: Date.now(),
        ...newAlertType.value,
        activa: true,
        frecuenciaEnvioMinHoras: 24
      }

      alertTypes.value.push(newAlert)
      showNewAlertModal.value = false
      
      // Resetear formulario
      newAlertType.value = {
        nombre: '',
        codigo: '',
        descripcion: '',
        prioridadDefault: 'MEDIA',
        reglaJson: ''
      }
    }

    const createRecipient = async () => {
      if (!newRecipient.value.idConfigAlerta || !newRecipient.value.canalEnvio) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      if (newRecipient.value.tipoDestinatario === 'rol' && !newRecipient.value.idRolDestinatario) {
        alert('Por favor selecciona un rol')
        return
      }

      if (newRecipient.value.tipoDestinatario === 'usuario' && !newRecipient.value.idUsuarioDestinatario) {
        alert('Por favor selecciona un usuario')
        return
      }

      const newRec = {
        id: Date.now(),
        ...newRecipient.value
      }

      alertRecipients.value.push(newRec)
      showNewRecipientModal.value = false
      
      // Resetear formulario
      newRecipient.value = {
        idConfigAlerta: '',
        tipoDestinatario: 'rol',
        idRolDestinatario: '',
        idUsuarioDestinatario: '',
        canalEnvio: 'IN_APP'
      }
    }

    const onTipoDestinatarioChange = () => {
      newRecipient.value.idRolDestinatario = ''
      newRecipient.value.idUsuarioDestinatario = ''
    }

    const saveGeneralConfig = async () => {
      // Aquí se haría la llamada a la API para guardar la configuración
      alert('Configuración guardada exitosamente')
    }

    // Lifecycle
    onMounted(() => {
      // Cargar configuración desde el store si es necesario
    })

    return {
      activeTab,
      showNewAlertModal,
      showNewRecipientModal,
      tabs,
      alertTypes,
      alertRecipients,
      users,
      generalConfig,
      newAlertType,
      newRecipient,
      getPriorityClass,
      getAlertTypeName,
      getRecipientName,
      editAlertType,
      toggleAlertStatus,
      editRecipient,
      deleteRecipient,
      createAlertType,
      createRecipient,
      onTipoDestinatarioChange,
      saveGeneralConfig
    }
  }
}
</script> 