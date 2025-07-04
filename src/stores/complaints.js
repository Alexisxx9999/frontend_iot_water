import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import complaintsService from '@/services/complaints.service'

export const useComplaintsStore = defineStore('complaints', () => {
  // Estado
  const complaints = ref([])
  const selectedComplaint = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const pageSize = ref(5)
  const search = ref('')
  const filterType = ref('')
  const filterStatus = ref('')
  const filterTechnician = ref('')
  const filterDate = ref('')

  // Getters
  const types = computed(() => [...new Set(complaints.value.map(c => c.category || c.type))])
  const statuses = computed(() => [...new Set(complaints.value.map(c => c.status))])
  const technicians = computed(() => [...new Set(complaints.value.map(c => c.technician || c.assignedTo || '-'))])

  const filteredComplaints = computed(() => {
    return complaints.value.filter(c => {
      const matchesSearch =
        (c.title?.toLowerCase().includes(search.value.toLowerCase()) ||
         c.location?.toLowerCase().includes(search.value.toLowerCase()) ||
         c.description?.toLowerCase().includes(search.value.toLowerCase()))
      const matchesType = !filterType.value || (c.category || c.type) === filterType.value
      const matchesStatus = !filterStatus.value || c.status === filterStatus.value
      const matchesTechnician = !filterTechnician.value || (c.technician || c.assignedTo) === filterTechnician.value
      const matchesDate = !filterDate.value || (c.createdAt ? c.createdAt.slice(0,10) : c.date) === filterDate.value
      return matchesSearch && matchesType && matchesStatus && matchesTechnician && matchesDate
    })
  })
  const totalPages = computed(() => Math.ceil(filteredComplaints.value.length / pageSize.value) || 1)
  const paginatedComplaints = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredComplaints.value.slice(start, start + pageSize.value)
  })

  // Acciones
  async function fetchComplaints() {
    loading.value = true
    error.value = null
    try {
      // Usar mock o API real
      complaints.value = await complaintsService.getMockComplaints()
      // complaints.value = await complaintsService.getAll()
    } catch (e) {
      error.value = 'Error al cargar denuncias'
    } finally {
      loading.value = false
    }
  }

  async function getComplaintById(id) {
    loading.value = true
    error.value = null
    try {
      selectedComplaint.value = await complaintsService.getMockComplaintById(id)
      // selectedComplaint.value = await complaintsService.getById(id)
    } catch (e) {
      error.value = 'Error al cargar la denuncia'
    } finally {
      loading.value = false
    }
  }

  async function createComplaint(data) {
    loading.value = true
    error.value = null
    try {
      const newComplaint = await complaintsService.createMockComplaint(data)
      // const newComplaint = await complaintsService.create(data)
      complaints.value.unshift(newComplaint)
      return newComplaint
    } catch (e) {
      error.value = 'Error al crear la denuncia'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateComplaint(id, data) {
    loading.value = true
    error.value = null
    try {
      // const updated = await complaintsService.update(id, data)
      // Actualizar en el mock local
      const idx = complaints.value.findIndex(c => c.id === id)
      if (idx !== -1) {
        complaints.value[idx] = { ...complaints.value[idx], ...data }
      }
      return complaints.value[idx]
    } catch (e) {
      error.value = 'Error al actualizar la denuncia'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setPage(newPage) { page.value = newPage }
  function setSearch(val) { search.value = val }
  function setFilterType(val) { filterType.value = val }
  function setFilterStatus(val) { filterStatus.value = val }
  function setFilterTechnician(val) { filterTechnician.value = val }
  function setFilterDate(val) { filterDate.value = val }

  return {
    complaints,
    selectedComplaint,
    loading,
    error,
    page,
    pageSize,
    search,
    filterType,
    filterStatus,
    filterTechnician,
    filterDate,
    types,
    statuses,
    technicians,
    filteredComplaints,
    totalPages,
    paginatedComplaints,
    fetchComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    setPage,
    setSearch,
    setFilterType,
    setFilterStatus,
    setFilterTechnician,
    setFilterDate
  }
})



