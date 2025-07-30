<template>
  <div class="medidor-list">
    <div class="header">
      <h1><i class="fas fa-network-wired"></i> Lista de Gateways</h1>
      <router-link to="/app/gateways/create" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nuevo Gateway
      </router-link>
    </div>
    <!-- Banner institucional de video (estilo nodos) -->
    <div class="institutional-video-banner">
      <video class="banner-video" autoplay loop muted playsinline poster="/src/assets/images/logo.png">
        <source src="/videos/istockphoto-1487086951-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Gateways IoT</h2>
        <p>Controla y supervisa los dispositivos de comunicación de la red.</p>
      </div>
    </div>
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por código, dirección o estado..."
          class="search-input"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
      </div>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Gateway</th>
            <th>Dirección</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Altitud</th>
            <th>Fecha Instalación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="gateway in filteredGateways" :key="gateway.id" class="table-row">
            <td class="codigo-cell">
              <strong>{{ gateway.code }}</strong>
              <div v-if="gateway.description" class="text-cell">{{ gateway.description }}</div>
            </td>
            <td>{{ gateway.address }}</td>
            <td>{{ gateway.latitude }}</td>
            <td>{{ gateway.longitude }}</td>
            <td>{{ gateway.altitude }}</td>
            <td>{{ formatDate(gateway.installationDate, true) }}</td>
            <td>
              <span :class="['status-badge', gateway.status === 'active' ? 'active' : gateway.status === 'maintenance' ? 'maintenance' : 'inactive']">
                {{ getStatusText(gateway.status) }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons custom-action-buttons">
              
                <router-link :to="`/app/gateways/${gateway.id}/edit`" class="action-btn edit" title="Editar">
                  <font-awesome-icon :icon="['fas', 'edit']" />
                </router-link>
                <button @click="() => { gatewayToDelete = gateway; showDeleteModal = true }" class="action-btn delete" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredGateways.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>No se encontraron gateways con los filtros aplicados</p>
        <router-link to="/app/gateways/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Crear primer gateway
        </router-link>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>¿Eliminar gateway?</h3>
          <button @click="showDeleteModal = false" class="btn-close">
            <font-awesome-icon :icon="['fas', 'times']"/>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar este gateway?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancelar</button>
          <button @click="confirmDelete(gatewayToDelete?.id)" class="btn btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
    <!-- MODAL VISUAL DE ENVÍO DE DATOS -->
    <div v-if="showSendModal" class="modal-overlay">
      <div class="send-modal">
        <div v-if="sendingData">
          <div class="spinner"></div>
          <h3>Enviando datos al gateway...</h3>
          <p v-if="gatewaySending">{{ gatewaySending.code }}<span v-if="gatewaySending.description"> — {{ gatewaySending.description }}</span></p>
        </div>
        <div v-else-if="sendSuccess">
          <i class="fas fa-check-circle send-success-icon"></i>
          <h3>¡Datos enviados exitosamente!</h3>
          <button class="btn-main" @click="closeSendModal"><i class="fas fa-times"></i> Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'GatewayListPage',
  setup() {
    const { showToast } = useToast()
    
    const gateways = ref([])
    const searchTerm = ref('')
    const statusFilter = ref('')
    const showDeleteModal = ref(false)
    const gatewayToDelete = ref(null)
    // NUEVO: Estado para modal de envío de datos
    const showSendModal = ref(false)
    const sendingData = ref(false)
    const sendSuccess = ref(false)
    const gatewaySending = ref(null)

    // Mock data
    const mockGateways = [
      {
        id: 1,
        code: 'GW-001',
        address: 'Av. Principal 123, Quito',
        latitude: '-0.1807',
        longitude: '-78.4678',
        altitude: '2850',
        installationDate: '2023-01-01',
        status: 'active',
        description: 'Gateway principal del sector norte',
        dataUrl: 'https://api.example.com/gateway-data',
        lastActivity: new Date('2024-01-15T10:30:00')
      },
      {
        id: 2,
        code: 'GW-002',
        address: 'Calle 10 de Agosto 456, Guayaquil',
        latitude: '-2.1709',
        longitude: '-79.9224',
        altitude: '4',
        installationDate: '2023-02-10',
        status: 'active',
        description: 'Gateway del centro comercial',
        dataUrl: 'https://api.example.com/gateway-data',
        lastActivity: new Date('2024-01-15T09:15:00')
      },
      {
        id: 3,
        code: 'GW-003',
        address: 'Av. Amazonas 789, Cuenca',
        latitude: '-2.9006',
        longitude: '-79.0045',
        altitude: '2560',
        installationDate: '2023-03-05',
        status: 'maintenance',
        description: 'Gateway en mantenimiento programado',
        dataUrl: null,
        lastActivity: new Date('2024-01-14T16:45:00')
      },
      {
        id: 4,
        code: 'GW-004',
        address: 'Calle Bolívar 321, Manta',
        latitude: '-0.9677',
        longitude: '-80.7089',
        altitude: '6',
        installationDate: '2023-04-20',
        status: 'inactive',
        description: 'Gateway temporalmente desactivado',
        dataUrl: 'https://api.example.com/gateway-data',
        lastActivity: new Date('2024-01-10T14:20:00')
      }
    ]

    const filteredGateways = computed(() => {
      let filtered = gateways.value

      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(gateway =>
          gateway.code.toLowerCase().includes(term) ||
          gateway.address.toLowerCase().includes(term) ||
          getStatusText(gateway.status).toLowerCase().includes(term)
        )
      }

      if (statusFilter.value) {
        filtered = filtered.filter(gateway => gateway.status === statusFilter.value)
      }

      return filtered
    })

    const getStatusText = (status) => {
      const statusMap = {
        active: 'Activo',
        inactive: 'Inactivo',
        maintenance: 'Mantenimiento'
      }
      return statusMap[status] || status
    }

    const formatDate = (date, onlyDate = false) => {
      if (!date) return ''
      const d = new Date(date)
      if (onlyDate) {
        return d.toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: '2-digit' })
      }
      return new Intl.DateTimeFormat('es-EC', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d)
    }

    const loadGateways = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500))
        // Usar array global si existe (para mock de edición)
        if (window && window.__GATEWAYS__) {
          gateways.value = window.__GATEWAYS__
        } else {
          gateways.value = mockGateways
          window.__GATEWAYS__ = mockGateways
        }
      } catch (error) {
        showToast('Error al cargar los gateways', 'error')
        console.error('Error loading gateways:', error)
      }
    }

    const toggleStatus = async (gateway) => {
      try {
        const newStatus = gateway.status === 'active' ? 'inactive' : 'active'
        
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        gateway.status = newStatus
        gateway.lastActivity = new Date()
        
        const action = newStatus === 'active' ? 'activado' : 'desactivado'
        showToast(`Gateway ${action} exitosamente`, 'success')
      } catch (error) {
        showToast('Error al cambiar el estado del gateway', 'error')
        console.error('Error toggling gateway status:', error)
      }
    }

    const sendData = async (gateway) => {
      try {
        showSendModal.value = true
        sendingData.value = true
        sendSuccess.value = false
        gatewaySending.value = gateway
        // Simular envío de datos
        await new Promise(resolve => setTimeout(resolve, 2000))
        sendingData.value = false
        sendSuccess.value = true
        showToast('Datos enviados exitosamente', 'success')
      } catch (error) {
        sendingData.value = false
        sendSuccess.value = false
        showSendModal.value = false
        showToast('Error al enviar los datos', 'error')
        console.error('Error sending data:', error)
      }
    }
    const closeSendModal = () => {
      showSendModal.value = false
      sendSuccess.value = false
      sendingData.value = false
      gatewaySending.value = null
    }

    const confirmDelete = async (id) => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const index = gateways.value.findIndex(g => g.id === id)
        if (index > -1) {
          gateways.value.splice(index, 1)
        }
        
        showToast('Gateway eliminado exitosamente', 'success')
        showDeleteModal.value = false
        gatewayToDelete.value = null
        window.showSimpleToast('Gateway eliminado correctamente', 'success')
      } catch (error) {
        showToast('Error al eliminar el gateway', 'error')
        console.error('Error deleting gateway:', error)
        window.showSimpleToast('Error al eliminar el gateway', 'error')
      }
    }

    onMounted(() => {
      loadGateways()
    })

    return {
      gateways,
      searchTerm,
      statusFilter,
      filteredGateways,
      showDeleteModal,
      gatewayToDelete,
      getStatusText,
      formatDate,
      toggleStatus,
      sendData,
      confirmDelete,
      // NUEVO
      showSendModal,
      sendingData,
      sendSuccess,
      closeSendModal,
      gatewaySending
    }
  }
}
</script> 

<style scoped>
.medidor-list {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(34, 91, 140, 0.10);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1200px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #225b8c;
  display: flex;
  align-items: center;
  gap: 10px;
}
.filters-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.search-box {
  position: relative;
  flex: 1;
}
.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  font-size: 1rem;
  background: #f4f8fb;
  color: #222;
}
.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #66adf4;
  font-size: 18px;
}
.filter-controls {
  display: flex;
  gap: 1rem;
}
.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  background: #f4f8fb;
  font-size: 1rem;
  color: #222;
}
.table-container {
  background: #f8f9fa;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.05);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.data-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}
.data-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}
.table-row:hover {
  background-color: #f8f9fa;
}
.codigo-cell {
  font-weight: 600;
}
.text-cell {
  color: #7f8c8d;
  font-size: 13px;
}
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
  text-transform: none;
}
.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}
.status-badge.maintenance {
  background-color: #fff3cd;
  color: #856404;
}
.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}
.actions-cell {
  text-align: center;
}
.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
}
.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 1.2rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: #f1f5f9;
  color: #334155;
  box-shadow: 0 1px 4px #2563eb11;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.12s;
  position: relative;
  outline: none;
  min-height: 28px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.btn-sm:focus {
  outline: 2px solid #2563eb;
}
.btn-sm:hover {
  background: #e0e7ff;
  color: #2563eb;
  box-shadow: 0 2px 8px #2563eb22;
  transform: scale(1.03);
}
.btn-warning {
  background-color: #ffc107;
  color: #212529;
}
.btn-warning:hover {
  background-color: #e0a800;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-danger:hover {
  background-color: #c82333;
}
.btn-info {
  background-color: #17a2b8;
  color: white;
}
.btn-info:hover {
  background-color: #138496;
}
.btn-primary {
  background-color: #00bcd4;
  color: #fff;
}
.btn-primary:hover {
  background-color: #0097a7;
  color: #fff;
}
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}
.no-results i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #ddd;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #95a5a6;
}
.modal-body {
  padding: 20px;
}
.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-top: 10px;
}
.modal-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.send-modal {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px #2563eb22;
  max-width: 350px;
  width: 100%;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #e3f2fd;
  border-top: 5px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.send-success-icon {
  color: #22c55e;
  font-size: 2.5rem;
  margin-bottom: 0.2rem;
}
.send-modal .btn-main {
  background: linear-gradient(90deg, #2563eb 60%, #38bdf8 100%);
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.85rem 1.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #2563eb22;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.send-modal .btn-main:hover {
  background: linear-gradient(90deg, #1d4ed8 60%, #0ea5e9 100%);
  transform: translateY(-2px) scale(1.03);
}
.video-section {
  margin-bottom: 2rem;
  text-align: center;
}
.video-description {
  font-size: 1.15rem;
  font-weight: 500;
  color: #225b8c;
  margin-bottom: 0.7rem;
}
.video-demo {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px #225b8c22;
}
.institutional-video-banner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2.5rem auto;
  position: relative;
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(34, 91, 140, 0.10);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-video {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 18px;
  z-index: 0;
  display: block;
}
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(20,40,60,0.55) 60%, rgba(0,0,0,0.35) 100%);
  z-index: 1;
}
.banner-caption {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-left: 2.5rem;
  z-index: 2;
}
.banner-caption h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.banner-caption p {
  font-size: 1.15rem;
  color: #e0e6f0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.gateways-modern-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 700;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}
.gateways-modern-table td {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px #225b8c11;
  vertical-align: middle;
}
.gateways-modern-row {
  transition: box-shadow 0.18s, background 0.18s;
}
.gateways-modern-row:hover {
  background-color: #e3f2fd33;
  box-shadow: 0 2px 8px #225b8c22;
}
.gateway-code {
  color: #2563eb;
  font-weight: 700;
  font-size: 1.08rem;
}
.status-badge-modern {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
  text-transform: none;
}
.status-badge-modern.active {
  background-color: #d4edda;
  color: #155724;
}
.status-badge-modern.maintenance {
  background-color: #fff3cd;
  color: #856404;
}
.status-badge-modern.inactive {
  background-color: #f8d7da;
  color: #721c24;
}
.action-buttons-modern {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.action-icon-btn {
  border: none;
  background: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  cursor: pointer;
  box-shadow: 0 1px 4px #2563eb11;
  outline: none;
}
.action-icon-btn.send {
  color: #2563eb;
  background: #e3f2fd;
}
.action-icon-btn.send:hover {
  background: #2563eb;
  color: #fff;
}
.action-icon-btn.edit {
  color: #ffc107;
  background: #fffbe6;
}
.action-icon-btn.edit:hover {
  background: #ffc107;
  color: #fff;
}
.action-icon-btn.delete {
  color: #dc3545;
  background: #fdeaea;
}
.action-icon-btn.delete:hover {
  background: #dc3545;
  color: #fff;
}
.btn-sm i {
  color: #fff !important;
  font-size: 1.25em;
  pointer-events: none;
}
.custom-action-buttons {
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
}
.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  border: none;
  cursor: pointer;
  transition: box-shadow 0.18s, background 0.18s, color 0.18s;
  box-shadow: 0 1px 4px #2563eb11;
  outline: none;
  padding: 0;
}
.action-btn.view {
  background: #c8f3fa;
}
.action-btn.view i {
  color: #1976d2;
}
.action-btn.edit {
  background: #ffd54f;
}
.action-btn.edit i {
  color: #222;
}
.action-btn.delete {
  background: #f76c6c;
}
.action-btn.delete i {
  color: #fff;
}
.action-btn:hover {
  box-shadow: 0 2px 8px #2563eb22;
  transform: scale(1.07);
}
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  .filter-controls {
    flex-direction: column;
  }
  .data-table {
    font-size: 14px;
  }
  .data-table th,
  .data-table td {
    padding: 10px 8px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 3px;
  }
}
</style> 
