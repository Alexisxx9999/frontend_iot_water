import axios from 'axios'

// Datos mock para simular la base de datos
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
  }
]

export const rolesService = {
  async getRoles() {
    // Simula una petición a la API
    // return axios.get('/api/roles')
    return Promise.resolve([...mockRoles])
  },
  async getRoleById(id) {
    // return axios.get(`/api/roles/${id}`)
    const role = mockRoles.find(r => r.id === Number(id))
    return Promise.resolve(role)
  },
  async createRole(data) {
    // return axios.post('/api/roles', data)
    const newRole = { ...data, id: Date.now() }
    mockRoles.push(newRole)
    return Promise.resolve(newRole)
  },
  async updateRole(id, data) {
    // return axios.put(`/api/roles/${id}`, data)
    const idx = mockRoles.findIndex(r => r.id === Number(id))
    if (idx !== -1) {
      mockRoles[idx] = { ...mockRoles[idx], ...data }
      return Promise.resolve(mockRoles[idx])
    }
    return Promise.reject('Rol no encontrado')
  }
} 