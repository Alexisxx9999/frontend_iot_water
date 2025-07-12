import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sectorsService } from '@/services/sectors.service'

export const useSectorsStore = defineStore('sectors', () => {
  // Estado
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getItems = computed(() => items.value)
  const getLoading = computed(() => loading.value)
  const getError = computed(() => error.value)

  // Acciones
  const fetchItems = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await sectorsService.getItems()
      items.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar los sectores'
      console.error('Error en fetchItems:', err)
    } finally {
      loading.value = false
    }
  }

  const getItem = async (id) => {
    loading.value = true
    error.value = null

    try {
      const data = await sectorsService.getItem(id)
      return data
    } catch (err) {
      error.value = err.message || 'Error al cargar el sector'
      console.error('Error en getItem:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createItem = async (itemData) => {
    loading.value = true
    error.value = null

    try {
      const newItem = await sectorsService.createItem(itemData)
      items.value.push(newItem)
      return newItem
    } catch (err) {
      error.value = err.message || 'Error al crear el sector'
      console.error('Error en createItem:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id, itemData) => {
    loading.value = true
    error.value = null

    try {
      const updatedItem = await sectorsService.updateItem(id, itemData)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      return updatedItem
    } catch (err) {
      error.value = err.message || 'Error al actualizar el sector'
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
      await sectorsService.deleteItem(id)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message || 'Error al eliminar el sector'
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
    // Estado
    items,
    loading,
    error,

    // Getters
    getItems,
    getLoading,
    getError,

    // Acciones
    fetchItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    clearError
  }
}) 