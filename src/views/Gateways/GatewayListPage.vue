<template>
  <div class="gateway-list-page">
    <div class="gateway-header">
      Administración de Gateways
    </div>
    <div class="header header-actions">
      <input
        v-model="search"
        type="text"
        class="gateway-search"
        placeholder="Buscar gateway por código, dirección o estado..."
      />
      <button class="btn-primary" @click="openCreateModal">Crear Gateway</button>
    </div>
    <div class="table-container">
      <table class="gateway-table">
        <thead>
          <tr>
            <th>Código</th>
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
          <tr v-for="(gateway, idx) in filteredGateways" :key="gateway.id" :class="{ 'zebra': idx % 2 === 1 }">
            <td :title="gateway.code">{{ gateway.code }}</td>
            <td :title="gateway.address">{{ gateway.address }}</td>
            <td>{{ gateway.latitude }}</td>
            <td>{{ gateway.longitude }}</td>
            <td>{{ gateway.altitude }}</td>
            <td>{{ formatDate(gateway.installationDate) }}</td>
            <td>
              <span :class="['state-badge', gateway.state === 'activo' ? 'badge-active' : 'badge-inactive']">
                {{ gateway.state }}
              </span>
            </td>
            <td>
              <div class="gateway-actions">
                <button @click="openEditModal(gateway)" title="Editar">✏️</button>
                <button v-if="gateway.state === 'activo'" @click="deactivateGateway(gateway)" title="Desactivar">⏸️</button>
                <button v-if="gateway.state === 'desactivado'" @click="activateGateway(gateway)" title="Activar">▶️</button>
                <button @click="openSendModal(gateway)" title="Enviar datos">📤</button>
                <button @click="askDeleteGateway(gateway)" class="delete-btn" title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <GatewayFormModal
      v-if="showFormModal"
      :gateway="selectedGateway"
      :is-editing="isEditing"
      @close="closeFormModal"
      @saved="saveGateway"
    />
    <SendDataModal
      v-if="showSendModal"
      :gateway="selectedGateway"
      :send-url="sendUrl"
      @close="closeSendModal"
      @send="sendGatewayData"
    />
    <ConfirmModal
      :visible="showConfirmModal"
      message="¿Estás seguro de que deseas eliminar este gateway? Esta acción no se puede deshacer."
      @confirm="confirmDeleteGateway"
      @cancel="cancelDeleteGateway"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import GatewayFormModal from '@/components/gateways/GatewayFormModal.vue'
import SendDataModal from '@/components/gateways/SendDataModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useGatewayService } from '@/services/gateways.service'

const gateways = ref([])
const showFormModal = ref(false)
const showSendModal = ref(false)
const selectedGateway = ref(null)
const isEditing = ref(false)
const sendUrl = ref('https://api.ejemplo.com/enviar-datos')
const loadingGateway = ref(false)
const loadingAction = ref(false)
const search = ref('')

const gatewayService = useGatewayService()

const fetchGateways = async () => {
  gateways.value = await gatewayService.list()
}

const openCreateModal = () => {
  selectedGateway.value = null
  isEditing.value = false
  showFormModal.value = true
}
const openEditModal = (gateway) => {
  selectedGateway.value = { ...gateway }
  isEditing.value = true
  showFormModal.value = true
}
const closeFormModal = () => {
  showFormModal.value = false
  fetchGateways()
}
const deactivateGateway = async (gateway) => {
  loadingAction.value = true
  showToast('Desactivando gateway...', 'info', 10000)
  try {
    await gatewayService.deactivate(gateway.id)
    showToast('Gateway desactivado exitosamente', 'success')
    fetchGateways()
  } catch (e) {
    showToast('Error al desactivar el gateway', 'error')
  } finally {
    loadingAction.value = false
  }
}
const activateGateway = async (gateway) => {
  loadingAction.value = true
  showToast('Activando gateway...', 'info', 10000)
  try {
    await gatewayService.activate(gateway.id)
    showToast('Gateway activado exitosamente', 'success')
    fetchGateways()
  } catch (e) {
    showToast('Error al activar el gateway', 'error')
  } finally {
    loadingAction.value = false
  }
}
const deleteGateway = async (gateway) => {
  if (confirm('¿Estás seguro de que deseas eliminar este gateway? Esta acción no se puede deshacer.')) {
    showToast('Eliminando gateway...', 'info')
    try {
      await gatewayService.delete(gateway.id)
      showToast('Gateway eliminado exitosamente', 'success')
      fetchGateways()
    } catch (e) {
      showToast('Error al eliminar el gateway', 'error')
    }
  }
}
const openSendModal = (gateway) => {
  selectedGateway.value = { ...gateway }
  showSendModal.value = true
}
const closeSendModal = () => {
  showSendModal.value = false
}
const sendGatewayData = async (gateway, url) => {
  loadingAction.value = true
  showToast('Enviando datos del gateway...', 'info', 10000)
  try {
    await gatewayService.sendData(gateway, url)
    showToast('Datos enviados exitosamente', 'success')
  } catch (e) {
    showToast('Error al enviar los datos', 'error')
  } finally {
    loadingAction.value = false
    closeSendModal()
  }
}

// Usar provide/inject para acceder a showToast global
const showToast = inject('showToast', () => {})

const saveGateway = async (gatewayData) => {
  loadingGateway.value = true
  showToast('Enviando datos...', 'info', 10000) // Toast largo
  try {
    if (isEditing.value) {
      await gatewayService.update(selectedGateway.value.id, gatewayData)
      showToast('Gateway actualizado exitosamente', 'success')
    } else {
      await gatewayService.create(gatewayData)
      showToast('Gateway creado exitosamente', 'success')
    }
    closeFormModal()
    fetchGateways()
  } catch (e) {
    showToast('Error al guardar el gateway', 'error')
  } finally {
    loadingGateway.value = false
  }
}

const showConfirmModal = ref(false)
const gatewayToDelete = ref(null)

const askDeleteGateway = (gateway) => {
  gatewayToDelete.value = gateway
  showConfirmModal.value = true
}
const confirmDeleteGateway = async () => {
  showConfirmModal.value = false
  if (gatewayToDelete.value) {
    loadingAction.value = true
    showToast('Eliminando gateway...', 'info', 10000)
    try {
      await gatewayService.delete(gatewayToDelete.value.id)
      showToast('Gateway eliminado exitosamente', 'success')
      fetchGateways()
    } catch (e) {
      showToast('Error al eliminar el gateway', 'error')
    } finally {
      loadingAction.value = false
      gatewayToDelete.value = null
    }
  }
}
const cancelDeleteGateway = () => {
  showConfirmModal.value = false
  gatewayToDelete.value = null
}

const filteredGateways = computed(() => {
  if (!search.value.trim()) return gateways.value
  const term = search.value.trim().toLowerCase()
  return gateways.value.filter(gw =>
    gw.code.toLowerCase().includes(term) ||
    gw.address.toLowerCase().includes(term) ||
    (gw.state && gw.state.toLowerCase().includes(term))
  )
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: '2-digit' })
}

onMounted(fetchGateways)
</script>

<style scoped>
.gateway-list-page { padding: 2rem; }
.gateway-header {
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
  background: linear-gradient(90deg, #e0f2fe 0%, #f1f5f9 100%);
  border-bottom: 2px solid #2563eb22;
  border-radius: 12px 12px 0 0;
  padding: 1.2rem 2rem 1rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px #2563eb11;
}
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 0.5rem;
}
.table-container { background: #fff; border-radius: 8px; box-shadow: 0 1px 4px #0001; overflow-x: auto; }
.gateway-table { width: 100%; border-collapse: collapse; }
.gateway-table th, .gateway-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #eee; }
.gateway-table th {
  text-align: center;
  font-weight: 700;
  color: #2563eb;
  background: #f1f5f9;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.gateway-table td {
  text-align: center;
  vertical-align: middle;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.state-active { color: #16a34a; font-weight: bold; }
.state-inactive { color: #dc2626; font-weight: bold; }
.zebra {
  background: #f8fafc;
}
.state-badge {
  display: inline-block;
  padding: 0.35em 1.1em;
  border-radius: 999px;
  font-size: 0.98em;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: capitalize;
}
.badge-active {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.badge-inactive {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
button { margin-right: 0.5rem; }
.gateway-actions {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  justify-content: center;
}
.gateway-actions button {
  background: none;
  border: none;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s;
}
.gateway-actions button:hover {
  background: #e0e7ef;
}
.delete-btn {
  color: #dc2626;
  font-weight: bold;
}
.btn-primary {
  background: linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px #2563eb22;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}
.btn-primary:hover {
  background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
  box-shadow: 0 4px 16px #2563eb33;
  transform: translateY(-2px) scale(1.03);
}
.gateway-search {
  min-width: 320px;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  margin-right: 1.5rem;
  outline: none;
  transition: border 0.2s;
}
.gateway-search:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #2563eb22;
}
@media (max-width: 900px) {
  .gateway-table th, .gateway-table td { font-size: 0.95rem; padding: 0.5rem 0.5rem; }
  .gateway-header { font-size: 1.3rem; padding: 0.7rem 1rem 0.7rem 1rem; }
  .gateway-search { min-width: 180px; font-size: 0.95rem; }
}
</style> 