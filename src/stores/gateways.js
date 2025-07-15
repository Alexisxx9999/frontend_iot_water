import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGatewayService } from '@/services/gateways.service'

export const useGatewaysStore = defineStore('gateways', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const gatewayService = useGatewayService()

  const getItems = computed(() => items.value)
  const getLoading = computed(() => loading.value)
  const getError = computed(() => error.value)

  const fetchItems = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await gatewayService.list()
      items.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar los gateways'
      console.error('Error en fetchItems:', err)
    } finally {
      loading.value = false
    }
  }

  const getItem = async (id) => {
    loading.value = true
    error.value = null
    try {
      // Si tu backend tiene endpoint para uno solo, usa eso. Si no, filtra localmente:
      let item = items.value.find(g => g.id == id)
      if (!item) {
        await fetchItems()
        item = items.value.find(g => g.id == id)
      }
      if (!item) throw new Error('Gateway no encontrado')
      return item
    } catch (err) {
      error.value = err.message || 'Error al cargar el gateway'
      console.error('Error en getItem:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createItem = async (data) => {
    loading.value = true
    error.value = null
    try {
      const newItem = await gatewayService.create(data)
      items.value.push(newItem)
      return newItem
    } catch (err) {
      error.value = err.message || 'Error al crear el gateway'
      console.error('Error en createItem:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const updatedItem = await gatewayService.update(id, data)
      const idx = items.value.findIndex(g => g.id == id)
      if (idx !== -1) items.value[idx] = updatedItem
      return updatedItem
    } catch (err) {
      error.value = err.message || 'Error al actualizar el gateway'
      console.error('Error en updateItem:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id) => {
    loading.value = true
    error.value = null
    try {
      await gatewayService.delete(id)
      const idx = items.value.findIndex(g => g.id == id)
      if (idx !== -1) items.value.splice(idx, 1)
    } catch (err) {
      error.value = err.message || 'Error al eliminar el gateway'
      console.error('Error en deleteItem:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    items,
    loading,
    error,
    getItems,
    getLoading,
    getError,
    fetchItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    clearError
  }
}) 