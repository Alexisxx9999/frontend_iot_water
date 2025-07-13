import axios from 'axios'
import { handleError, showNotification } from '../utils/errorHandler'

const API_BASE_URL = 'http://localhost:3000/api'
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = handleError(error, 'API Request')
    showNotification(errorMessage, 'error')
    return Promise.reject(error)
  }
)

let mockNodes = [
  {
    id: 1,
    codigo: 'NODO-001',
    tipo: 'Sensor de Temperatura',
    fechaInstalacion: '2024-01-01',
    bateria: 85,
    activo: true
  },
  {
    id: 2,
    codigo: 'NODO-002',
    tipo: 'Actuador de Riego',
    fechaInstalacion: '2024-02-15',
    bateria: 60,
    activo: false
  }
]

const USE_MOCK_DATA = true // Cambia a false para usar API real

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const nodeService = {
  async getAllNodes() {
    try {
      if (USE_MOCK_DATA) {
        await delay(300)
        return [...mockNodes]
      }
      const response = await api.get('/nodes')
      return response.data
    } catch (error) {
      showNotification('Error al obtener nodos', 'error')
      throw error
    }
  },
  async getNodeById(id) {
    try {
      if (USE_MOCK_DATA) {
        await delay(200)
        const node = mockNodes.find(n => n.id === Number(id))
        if (!node) throw new Error('Nodo no encontrado')
        return node
      }
      const response = await api.get(`/nodes/${id}`)
      return response.data
    } catch (error) {
      showNotification('Error al obtener nodo', 'error')
      throw error
    }
  },
  async createNode(data) {
    try {
      if (USE_MOCK_DATA) {
        await delay(300)
        if (!data.codigo || !data.tipo) {
          throw new Error('Código y tipo son obligatorios')
        }
        // Permitir códigos repetidos para pruebas
        const newId = mockNodes.length ? Math.max(...mockNodes.map(n => n.id)) + 1 : 1
        const newNode = { ...data, id: newId }
        mockNodes.push(newNode)
        showNotification('Nodo creado exitosamente', 'success')
        return newNode
      }
      const response = await api.post('/nodes', data)
      showNotification('Nodo creado exitosamente', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al crear nodo', 'error')
      throw error
    }
  },
  async updateNode(id, data) {
    try {
      if (USE_MOCK_DATA) {
        await delay(300)
        const idx = mockNodes.findIndex(n => n.id === Number(id))
        if (idx === -1) throw new Error('Nodo no encontrado')
        mockNodes[idx] = { ...mockNodes[idx], ...data }
        showNotification('Nodo actualizado exitosamente', 'success')
        return mockNodes[idx]
      }
      const response = await api.put(`/nodes/${id}`, data)
      showNotification('Nodo actualizado exitosamente', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al actualizar nodo', 'error')
      throw error
    }
  },
  async deleteNode(id) {
    try {
      if (USE_MOCK_DATA) {
        await delay(200)
        const idx = mockNodes.findIndex(n => n.id === Number(id))
        if (idx === -1) throw new Error('Nodo no encontrado')
        mockNodes.splice(idx, 1)
        showNotification('Nodo eliminado exitosamente', 'success')
        return true
      }
      const response = await api.delete(`/nodes/${id}`)
      showNotification('Nodo eliminado exitosamente', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al eliminar nodo', 'error')
      throw error
    }
  },
  async activateNode(id) {
    try {
      if (USE_MOCK_DATA) {
        await delay(200)
        const node = mockNodes.find(n => n.id === Number(id))
        if (node) node.activo = true
        showNotification('Nodo activado', 'success')
        return node
      }
      const response = await api.post(`/nodes/${id}/activate`)
      showNotification('Nodo activado', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al activar nodo', 'error')
      throw error
    }
  },
  async deactivateNode(id) {
    try {
      if (USE_MOCK_DATA) {
        await delay(200)
        const node = mockNodes.find(n => n.id === Number(id))
        if (node) node.activo = false
        showNotification('Nodo desactivado', 'success')
        return node
      }
      const response = await api.post(`/nodes/${id}/deactivate`)
      showNotification('Nodo desactivado', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al desactivar nodo', 'error')
      throw error
    }
  },
  generateNodeCode() {
    const next = mockNodes.length ? Math.max(...mockNodes.map(n => parseInt(n.codigo.replace('NODO-', '')))) + 1 : 1
    return `NODO-${String(next).padStart(3, '0')}`
  }
}
