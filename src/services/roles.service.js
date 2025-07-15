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

let mockRoles = [
  {
    id: 1,
    nombreRol: 'Administrador',
    descripcionRol: 'Acceso total al sistema',
    estadoRol: 'Activo'
  },
  {
    id: 2,
    nombreRol: 'Usuario',
    descripcionRol: 'Acceso limitado',
    estadoRol: 'Inactivo'
  },
  {
    id: 3,
    nombreRol: 'Supervisor',
    descripcionRol: 'Supervisa operaciones y reportes',
    estadoRol: 'Activo'
  },
  {
    id: 4,
    nombreRol: 'Invitado',
    descripcionRol: 'Acceso solo lectura',
    estadoRol: 'Inactivo'
  },
  {
    id: 5,
    nombreRol: 'Técnico',
    descripcionRol: 'Gestiona dispositivos y mantenimiento',
    estadoRol: 'Activo'
  }
]

const USE_MOCK_DATA = true // Cambia a false para usar API real

export const rolesService = {
  async getRoles() {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400))
        return [...mockRoles]
      }
      const response = await api.get('/roles')
      return response.data
    } catch (error) {
      showNotification('Error al obtener roles', 'error')
      throw error
    }
  },
  async getRoleById(id) {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const role = mockRoles.find(r => r.id === Number(id))
        if (!role) throw new Error('Rol no encontrado')
        return role
      }
      const response = await api.get(`/roles/${id}`)
      return response.data
    } catch (error) {
      showNotification('Error al obtener rol', 'error')
      throw error
    }
  },
  async createRole(data) {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400))
        if (!data.nombreRol || !data.descripcionRol) {
          throw new Error('Nombre y descripción son obligatorios')
        }
        // Eliminada la validación de nombre repetido
        const newRole = { ...data, id: Date.now() }
        mockRoles.push(newRole)
        showNotification('Rol creado exitosamente', 'success')
        return newRole
      }
      const response = await api.post('/roles', data)
      showNotification('Rol creado exitosamente', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al crear rol', 'error')
      throw error
    }
  },
  async updateRole(id, data) {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400))
        const idx = mockRoles.findIndex(r => r.id === Number(id))
        if (idx === -1) throw new Error('Rol no encontrado')
        mockRoles[idx] = { ...mockRoles[idx], ...data }
        showNotification('Rol actualizado exitosamente', 'success')
        return mockRoles[idx]
      }
      const response = await api.put(`/roles/${id}`, data)
      showNotification('Rol actualizado exitosamente', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al actualizar rol', 'error')
      throw error
    }
  },
  async deleteRole(id) {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const idx = mockRoles.findIndex(r => r.id === Number(id))
        if (idx === -1) throw new Error('Rol no encontrado')
        mockRoles.splice(idx, 1)
        showNotification('Rol eliminado exitosamente', 'success')
        return true
      }
      const response = await api.delete(`/roles/${id}`)
      showNotification('Rol eliminado exitosamente', 'success')
      return response.data
    } catch (error) {
      showNotification('Error al eliminar rol', 'error')
      throw error
    }
  }
} 