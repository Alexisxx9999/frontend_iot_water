<template>
  <div class="complaint-list-page">
    <div class="gradient-header">
      <div class="header-content">
        <h1>Gestión de Denuncias Ciudadanas</h1>
        <div class="subtitle">Administra, filtra y responde denuncias ciudadanas de forma profesional.</div>
      </div>
    </div>
    <div class="toolbar-section modern-toolbar">
      <div class="toolbar-content">
        <input v-model="store.search" placeholder="Buscar por título o ubicación..." class="filter-input" />
        <select v-model="store.filterType" class="filter-select">
          <option value="">Todos los tipos</option>
          <option v-for="type in store.types" :key="type" :value="type">{{ getTypeLabel(type) }}</option>
        </select>
        <select v-model="store.filterStatus" class="filter-select">
          <option value="">Todos los estados</option>
          <option v-for="status in store.statuses" :key="status" :value="status">{{ getStatusLabel(status) }}</option>
        </select>
        <select v-model="store.filterTechnician" class="filter-select">
          <option value="">Todos los técnicos</option>
          <option v-for="tech in store.technicians" :key="tech" :value="tech">{{ formatTechnician(tech) }}</option>
        </select>
        <input type="date" v-model="store.filterDate" class="filter-input" />
        <button class="btn-primary big-new-complaint-btn" @click="openNewComplaint">+ Nueva Denuncia</button>
      </div>
    </div>
    <div class="main-content">
      <div class="complaints-grid">
        <transition-group name="card-fade" tag="div" class="cards-wrapper">
          <div v-for="complaint in store.paginatedComplaints" :key="complaint.id" class="complaint-card-modern" @click="viewDetails(complaint)">
            <div class="card-header">
              <img v-if="complaint.image" :src="complaint.image" alt="Imagen denuncia" class="card-img" />
              <span v-else class="card-icon">{{ getComplaintEmoji(complaint.type) }}</span>
              <span :class="'status-badge-modern ' + (complaint.status || '').replace(/\s/g, '-').toLowerCase()">
                {{ getStatusLabel(complaint.status) }}
              </span>
            </div>
            <div class="card-body">
              <h2 class="card-title">{{ complaint.title }}</h2>
              <div class="card-info">
                <span class="card-type">{{ getTypeLabel(complaint.type) }}</span>
                <span class="card-date">{{ formatDate(complaint.date) }}</span>
              </div>
              <div class="card-location">
                <i class="fas fa-map-marker-alt"></i> {{ complaint.location }}
              </div>
              <div class="card-technician" v-if="complaint.technician">
                <i class="fas fa-user-cog"></i> {{ complaint.technician }}
              </div>
            </div>
            <div class="card-actions">
              <button class="card-btn edit" @click.stop="editComplaint(complaint)" title="Editar">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="card-btn delete" @click.stop="deleteComplaint(complaint)" title="Eliminar">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </div>
          </div>
          <div v-if="store.paginatedComplaints.length === 0" key="no-data" class="no-data-modern">No hay denuncias para mostrar.</div>
        </transition-group>
      </div>
      <div class="pagination-bar">
        <button :disabled="store.page === 1" @click="store.setPage(store.page - 1)" class="glass-button">Anterior</button>
        <span class="pagination-info">Página {{ store.page }} de {{ store.totalPages }}</span>
        <button :disabled="store.page === store.totalPages" @click="store.setPage(store.page + 1)" class="glass-button">Siguiente</button>
      </div>
      <!-- Modal Nueva Denuncia -->
      <transition name="bounce-modal">
        <div v-if="showModal" class="modal-overlay premium-modal-overlay">
          <div class="modal-content glass-modal premium-modal ultra-premium-modal super-premium-modal">
            <div class="modal-header-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#38bdf8"/><path d="M16 24l6 6 10-10" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h2 class="modal-title premium-title super-title">Nueva Denuncia</h2>
            <form class="complaint-form premium-form super-form" @submit.prevent="submitComplaint">
              <div v-if="submitSuccess" class="submit-success-feedback">
                <div class="success-check">
                  <svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#10b981"/><path d="M20 34l8 8 16-16" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="success-msg">¡Denuncia registrada con éxito!</div>
              </div>
              <div v-else>
                <div class="form-group premium-group super-group">
                  <label class="premium-label super-label">Tipo de Denuncia</label>
                  <select v-model="newComplaint.type" required class="premium-input super-input compact-input" :disabled="isSubmitting">
                    <option value="" disabled>Seleccione...</option>
                    <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                </div>
                <div class="form-group premium-group super-group">
                  <label class="premium-label super-label">Descripción Detallada</label>
                  <textarea v-model="newComplaint.description" required class="premium-input super-input" :disabled="isSubmitting"></textarea>
                </div>
                <div class="form-group premium-group super-group">
                  <label class="premium-label super-label">Adjuntar Fotografía</label>
                  <input ref="fileInput" type="file" @change="onFileChange" accept="image/*" style="display:none" :disabled="isSubmitting" />
                  <button type="button" class="btn-adjuntar" @click.prevent="$refs.fileInput.click()" :disabled="isSubmitting">
                    <span class="clip-icon">📎</span> Adjuntar
                  </button>
                  <span v-if="newComplaint.image" class="file-success" style="color:#10b981;font-weight:600;margin-left:10px;">Imagen cargada</span>
                  <div v-if="newComplaint.image" style="margin-top:10px;text-align:center;">
                    <img :src="newComplaint.image" alt="Preview" style="max-width:120px;max-height:80px;border-radius:10px;box-shadow:0 2px 8px #0ea5e933;" />
                  </div>
                </div>
                <div class="form-group premium-group super-group">
                  <label class="premium-label super-label">Ubicación</label>
                  <input v-model="newComplaint.location" placeholder="Ej: Av. Amazonas y Colón" required class="premium-input super-input" :disabled="isSubmitting" />
                </div>
                <div class="form-group premium-group super-group">
                  <label class="premium-label super-label">Contacto (teléfono/email)</label>
                  <input v-model="newComplaint.contact" required class="premium-input super-input" :disabled="isSubmitting" />
                </div>
                <div class="modal-actions premium-actions super-actions">
                  <button type="submit" class="glass-button primary premium-btn super-btn" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner"></span>
                    Registrar
                  </button>
                  <button type="button" class="glass-button premium-btn-cancel super-btn-cancel" @click="closeModal" :disabled="isSubmitting">Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </transition>
      <!-- Modal Confirmación Eliminación -->
      <transition name="fade-modal">
        <div v-if="showDeleteModal" class="modal-overlay premium-modal-overlay">
          <div class="modal-content glass-modal premium-modal ultra-premium-modal super-premium-modal" style="max-width:340px;text-align:center;">
            <div class="modal-header-icon">
              <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;color:#ef4444;"></i>
            </div>
            <h2 class="modal-title premium-title super-title">¿Eliminar denuncia?</h2>
            <p style="margin-bottom:1.2rem;">¿Estás seguro de que deseas eliminar la denuncia <b>{{ complaintToDelete?.title }}</b>?</p>
            <div class="modal-actions premium-actions super-actions" style="justify-content:center;gap:1.2rem;">
              <button class="glass-button premium-btn-cancel super-btn-cancel" @click="cancelDelete">Cancelar</button>
              <button class="glass-button primary premium-btn super-btn" style="background:#ef4444;color:white;" @click="confirmDelete">Eliminar</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useComplaintsStore } from '@/stores/complaints'

const store = useComplaintsStore()
const router = useRouter()
const showModal = ref(false)
const newComplaint = ref({
  type: '',
  description: '',
  image: '',
  location: '',
  contact: ''
})
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const fileInput = ref(null)
const editingComplaint = ref(null)
const showDeleteModal = ref(false)
const complaintToDelete = ref(null)

const typeOptions = [
  { value: 'water-leak', label: 'Fuga de agua' },
  { value: 'contamination', label: 'Contaminación' },
  { value: 'meter-issue', label: 'Problema de medidor' },
  { value: 'pressure', label: 'Baja presión' }
]
const statusLabels = {
  'urgent': 'urgente',
  'in-progress': 'en progreso',
  'pending': 'pendiente',
  'resolved': 'resuelto',
  'closed': 'cerrado',
  '': '-'
}

onMounted(() => {
  store.fetchComplaints()
})

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' })
}
function openNewComplaint() {
  showModal.value = true
  newComplaint.value = { type: '', description: '', image: '', location: '', contact: '' }
  submitSuccess.value = false
  isSubmitting.value = false
  nextTick(() => {
    const modal = document.querySelector('.super-premium-modal')
    if (modal) modal.scrollTop = 0
  })
}
function closeModal() { showModal.value = false }
function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = ev => { newComplaint.value.image = ev.target.result }
    reader.readAsDataURL(file)
  }
}
async function submitComplaint() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  if (editingComplaint.value) {
    // Modo edición: actualizar denuncia existente
    await store.updateComplaint(editingComplaint.value.id, { ...newComplaint.value })
    editingComplaint.value = null
  } else {
    // Modo creación
    await store.createComplaint({
      title: newComplaint.value.description.slice(0, 30) + (newComplaint.value.description.length > 30 ? '...' : ''),
      type: newComplaint.value.type,
      location: newComplaint.value.location,
      date: new Date().toISOString().slice(0, 10),
      status: 'pendiente',
      technician: '-',
      image: newComplaint.value.image,
      contact: newComplaint.value.contact,
      description: newComplaint.value.description
    })
  }
  submitSuccess.value = true
  await nextTick()
  const modal = document.querySelector('.super-premium-modal')
  if (modal) modal.scrollTop = 0
  setTimeout(() => {
    showModal.value = false
    isSubmitting.value = false
    submitSuccess.value = false
    newComplaint.value = { type: '', description: '', image: '', location: '', contact: '' }
  }, 1200)
}
function viewDetails(complaint) {
  router.push({ name: 'ComplaintDetail', params: { id: complaint.id } })
}
function editComplaint(complaint) {
  editingComplaint.value = { ...complaint }
  newComplaint.value = { ...complaint }
  showModal.value = true
  submitSuccess.value = false
  isSubmitting.value = false
}
function deleteComplaint(complaint) {
  complaintToDelete.value = complaint
  showDeleteModal.value = true
}
function confirmDelete() {
  // Aquí puedes llamar a la acción del store para eliminar
  store.complaints = store.complaints.filter(c => c.id !== complaintToDelete.value.id)
  showDeleteModal.value = false
  complaintToDelete.value = null
}
function cancelDelete() {
  showDeleteModal.value = false
  complaintToDelete.value = null
}
function getTypeLabel(type) {
  if (!type) return '-';
  if (type === 'water-leak') return 'Fuga de agua';
  if (type === 'contamination') return 'Contaminación';
  if (type === 'meter-issue') return 'Problema de medidor';
  if (type === 'pressure') return 'Baja presión';
  if (type.toLowerCase().includes('fuga')) return 'Fuga de agua';
  if (type.toLowerCase().includes('contamin')) return 'Contaminación';
  if (type.toLowerCase().includes('medidor')) return 'Problema de medidor';
  if (type.toLowerCase().includes('presión') || type.toLowerCase().includes('presion')) return 'Baja presión';
  return type;
}
function getStatusLabel(status) {
  if (!status) return '-';
  const s = status.toLowerCase();
  if (s === 'urgent' || s === 'urgente') return 'urgente';
  if (s === 'in-progress' || s === 'en progreso') return 'en progreso';
  if (s === 'pending' || s === 'pendiente') return 'pendiente';
  if (s === 'resolved' || s === 'resuelto') return 'resuelto';
  if (s === 'closed' || s === 'cerrado') return 'cerrado';
  return status;
}
function getComplaintEmoji(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('fuga')) return '💧';
  if (t.includes('contamin')) return '🦠';
  if (t.includes('medidor')) return '📟';
  if (t.includes('presión') || t.includes('presion')) return '⚡';
  return '💧';
}
function formatTechnician(tech) {
  if (!tech) return '-';
  return tech.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_complaints.scss' as *;
.table-container.glass-table {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 12px 48px rgba(14, 165, 233, 0.13);
  padding: 1.5rem 2.5rem 1.5rem 2.5rem;
  margin: 2.5rem auto;
  width: 95vw;
  max-width: 1600px;
}
.premium-table {
  width: 100%;
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
  background: transparent;
}
.premium-table th, .premium-table td {
  font-size: 1em;
  color: #1e293b;
  padding: 0.6em 0.5em;
  border-bottom: 1.5px solid #e0f2fe;
  background: transparent;
  text-align: left;
  white-space: normal;
  word-break: break-word;
}
.premium-table th {
  font-weight: 700;
  color: #0ea5e9;
  letter-spacing: 0.01em;
}
.premium-table td.complaint-title {
  font-weight: 600;
  color: #2563eb;
  font-size: 1em;
}
.premium-table td img[alt='Imagen denuncia'],
.premium-table td span[style*='font-size:2em'],
.premium-table td span[style*='font-size:2em'] * {
  font-size: 2.8em !important;
  width: 48px !important;
  height: 48px !important;
  max-width: 48px;
  max-height: 48px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 8px #0ea5e933;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.premium-table td.complaint-title {
  font-weight: 600;
  color: #2563eb;
  font-size: 1em;
}
.premium-table tr:last-child td {
  border-bottom: none;
}
.table-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.3em;
}
.table-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 1.15em;
  padding: 0.18em 0.38em;
  border-radius: 6px;
  transition: background 0.18s, color 0.18s;
  cursor: pointer;
}
.table-btn:hover {
  background: #e0f2fe;
  color: #0ea5e9;
}
.premium-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1.2rem;
}
.premium-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(14, 165, 233, 0.15);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  overflow-y: auto;
  box-sizing: border-box;
  animation: fadein 0.4s;
}
.premium-modal, .super-premium-modal {
  max-width: 320px;
  padding: 0.3rem 0.5rem 0.6rem 0.5rem;
  font-size: 0.91rem;
  border-radius: 18px;
}
.ultra-premium-modal {
  border: 2.5px solid #38bdf822;
  background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
}
.super-premium-modal {
  padding-bottom: 0.7rem;
}
.modal-header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  margin-top: -1.2rem;
  animation: bounce-in 0.7s cubic-bezier(0.39, 0.575, 0.565, 1);
}
.premium-title, .super-title {
  font-size: 0.97rem;
  margin-bottom: 0.25rem;
}
.premium-form, .super-form {
  gap: 0.09rem;
  padding-bottom: 0.05rem;
}
.premium-group, .super-group {
  gap: 0.04rem;
  margin-bottom: 0.06rem;
}
.premium-label, .super-label {
  font-size: 0.86rem;
  margin-bottom: 0.03rem;
}
.premium-input, .super-input, .compact-input {
  border-radius: 8px;
  border: 1.5px solid #bae6fd;
  background: #fff;
  padding: 0.32rem 0.7rem;
  font-size: 0.93rem;
  font-family: inherit;
  box-shadow: none;
  transition: border 0.22s, box-shadow 0.22s, background 0.22s;
  outline: none;
  margin-bottom: 0.1rem;
  width: 100%;
  min-height: 38px;
}
.premium-input:focus, .super-input:focus, .compact-input:focus {
  border: 1.5px solid #0ea5e9;
  box-shadow: 0 0 0 2px #bae6fd88;
  background: #fff;
}
.glass-button.primary.premium-btn.super-btn {
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%) !important;
  color: #fff !important;
  border-radius: 1.2rem;
  font-weight: 700;
  font-size: 0.91rem;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.13);
  border: none;
  padding: 0.28rem 1.1rem;
  margin-top: 0.09rem;
  margin-bottom: 0.06rem;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s, filter 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
}
.glass-button.primary.premium-btn.super-btn:hover {
  background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%) !important;
  box-shadow: 0 8px 24px 0 rgba(14,165,233,0.18);
  transform: translateY(-1px) scale(1.03);
  filter: brightness(1.07);
}
.glass-button.premium-btn-cancel.super-btn-cancel {
  background: none !important;
  color: #2563eb !important;
  border: none;
  font-weight: 600;
  font-size: 0.89rem;
  box-shadow: none;
  padding: 0.18rem 0.7rem;
  margin-top: 0.09rem;
  margin-bottom: 0.06rem;
  transition: color 0.2s, text-decoration 0.2s;
  text-align: center;
  min-height: 32px;
}
.glass-button.premium-btn-cancel.super-btn-cancel:hover {
  color: #0ea5e9 !important;
  text-decoration: underline;
}
.premium-actions, .super-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.18rem;
}
.glass-button.primary.premium-btn.super-btn,
.glass-button.premium-btn-cancel.super-btn-cancel {
  min-width: 110px;
  min-height: 36px;
  margin: 0;
}
.clip-icon {
  font-size: 1.1em;
  margin-right: 0.15em;
}
.bounce-modal-enter-active, .bounce-modal-leave-active {
  transition: opacity 0.3s;
}
.bounce-modal-enter-from, .bounce-modal-leave-to {
  opacity: 0;
}
@keyframes fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.85) translateY(60px); }
  60% { opacity: 1; transform: scale(1.04) translateY(-8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes glass-fade-in {
  0% { opacity: 0; transform: scale(0.98) translateY(24px); }
  100% { opacity: 1; transform: none; }
}
@media (max-width: 600px) {
  .premium-modal, .super-premium-modal {
    max-width: 99vw;
    padding: 0.08rem 0.01rem 0.2rem 0.01rem;
  }
  .glass-table {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
  .premium-modal-overlay {
    min-height: 100vh;
    height: 100vh;
    width: 100vw;
    overflow: auto;
  }
}
.submit-success-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: 2.5rem 0 1.5rem 0;
  animation: fadein 0.5s;
}
.success-check {
  margin-bottom: 1.2rem;
  animation: bounce-in 0.7s cubic-bezier(0.39, 0.575, 0.565, 1);
}
.success-msg {
  color: #10b981;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px #bae6fd99;
}
.spinner {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border: 2.5px solid #38bdf8;
  border-top: 2.5px solid #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 0.7em;
  vertical-align: middle;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.btn-adjuntar {
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%) !important;
  color: #fff !important;
  border-radius: 1.2rem;
  font-weight: 700;
  font-size: 0.93rem;
  box-shadow: 0 10px 32px rgba(14, 165, 233, 0.20), 0 2px 8px rgba(80,102,144,0.10);
  border: none;
  padding: 0.38rem 0.9rem;
  margin-top: 0.18rem;
  margin-bottom: 0.1rem;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s, filter 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  filter: drop-shadow(0 2px 8px #38bdf822);
  min-height: 36px;
}
.btn-adjuntar:hover {
  background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%) !important;
  box-shadow: 0 16px 48px 0 rgba(14,165,233,0.22), 0 8px 32px 0 rgba(80,102,144,0.13);
  transform: translateY(-2px) scale(1.04);
  filter: brightness(1.08);
}
</style>
