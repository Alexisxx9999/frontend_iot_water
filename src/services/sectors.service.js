// Servicio de Sectores listo para backend real
// Para conectar a un backend, descomenta la sección de axios y comenta la de mocks
// import axios from 'axios';
// const API_URL = 'https://tu-backend.com/api/sectors';

let sectorsItems = [
  {
    id: 1,
    nombreSector: 'Centro Histórico',
    codigoPostalSector: '170101',
    descripcionSector: 'Sector céntrico de la ciudad con alta densidad poblacional y comercio tradicional',
    estado: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    nombreSector: 'La Mariscal',
    codigoPostalSector: '170102',
    descripcionSector: 'Zona comercial y de entretenimiento con alta actividad nocturna',
    estado: 'active',
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z'
  },
  {
    id: 3,
    nombreSector: 'Quito Norte',
    codigoPostalSector: '170103',
    descripcionSector: 'Sector residencial de clase media-alta con amplias avenidas',
    estado: 'active',
    createdAt: '2024-03-10T09:45:00Z',
    updatedAt: '2024-03-10T09:45:00Z'
  },
  {
    id: 4,
    nombreSector: 'Valle de los Chillos',
    codigoPostalSector: '170104',
    descripcionSector: 'Valle al sur de Quito con clima templado y desarrollo residencial',
    estado: 'inactive',
    createdAt: '2024-04-05T16:20:00Z',
    updatedAt: '2024-04-05T16:20:00Z'
  }
]
let nextId = 5
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const sectorsService = {
  // Obtener todos los registros
  async getItems() {
    // --- BACKEND REAL ---
    // return axios.get(API_URL).then(res => res.data)
    // --- MOCK ---
    await delay(800)
    if (Math.random() < 0.05) throw new Error('Error de conexión al servidor')
    return [...sectorsItems]
  },
  // Obtener un registro por ID
  async getItem(id) {
    // --- BACKEND REAL ---
    // return axios.get(`${API_URL}/${id}`).then(res => res.data)
    // --- MOCK ---
    await delay(500)
    const item = sectorsItems.find(item => item.id === parseInt(id))
    if (!item) throw new Error('Sector no encontrado')
    return { ...item }
  },
  // Crear un nuevo registro
  async createItem(itemData) {
    // --- BACKEND REAL ---
    // return axios.post(API_URL, itemData).then(res => res.data)
    // --- MOCK ---
    await delay(1000)
    const existingSector = sectorsItems.find(item => item.codigoPostalSector === itemData.codigoPostalSector)
    if (existingSector) throw new Error('Ya existe un sector con este código postal')
    const newItem = {
      id: nextId++,
      ...itemData,
      estado: itemData.estado || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    sectorsItems.push(newItem)
    return { ...newItem }
  },
  // Actualizar un registro existente
  async updateItem(id, itemData) {
    // --- BACKEND REAL ---
    // return axios.put(`${API_URL}/${id}`, itemData).then(res => res.data)
    // --- MOCK ---
    await delay(800)
    const index = sectorsItems.findIndex(item => item.id === parseInt(id))
    if (index === -1) throw new Error('Sector no encontrado')
    const existingSector = sectorsItems.find(item => item.codigoPostalSector === itemData.codigoPostalSector && item.id !== parseInt(id))
    if (existingSector) throw new Error('Ya existe un sector con este código postal')
    const updatedItem = {
      ...sectorsItems[index],
      ...itemData,
      id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    sectorsItems[index] = updatedItem
    return { ...updatedItem }
  },
  // Eliminar un registro
  async deleteItem(id) {
    // --- BACKEND REAL ---
    // return axios.delete(`${API_URL}/${id}`)
    // --- MOCK ---
    await delay(600)
    const index = sectorsItems.findIndex(item => item.id === parseInt(id))
    if (index === -1) throw new Error('Sector no encontrado')
    sectorsItems.splice(index, 1)
    return true
  },
  // Buscar registros por término
  async searchItems(searchTerm) {
    // --- BACKEND REAL ---
    // return axios.get(`${API_URL}?q=${searchTerm}`).then(res => res.data)
    // --- MOCK ---
    await delay(400)
    const term = searchTerm.toLowerCase()
    return sectorsItems.filter(item =>
      item.nombreSector.toLowerCase().includes(term) ||
      item.codigoPostalSector.toLowerCase().includes(term) ||
      item.descripcionSector.toLowerCase().includes(term)
    )
  },
  // Filtrar por estado
  async filterByStatus(status) {
    // --- BACKEND REAL ---
    // return axios.get(`${API_URL}?estado=${status}`).then(res => res.data)
    // --- MOCK ---
    await delay(300)
    if (!status) return [...sectorsItems]
    return sectorsItems.filter(item => item.estado === status)
  },
  // Obtener estadísticas
  async getStats() {
    // --- BACKEND REAL ---
    // return axios.get(`${API_URL}/stats`).then(res => res.data)
    // --- MOCK ---
    await delay(200)
    const total = sectorsItems.length
    const active = sectorsItems.filter(item => item.estado === 'active').length
    const inactive = total - active
    return {
      total,
      active,
      inactive,
      percentageActive: total > 0 ? Math.round((active / total) * 100) : 0
    }
  }
} 