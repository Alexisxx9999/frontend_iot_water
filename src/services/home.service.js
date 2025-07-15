// Datos simulados para el módulo Home
let homeItems = [
  {
    id: 1,
    nombre: 'IoT Water Solutions',
    email: 'contacto@iotwater.com',
    celular: '0991234567',
    mision: 'Proporcionar soluciones tecnológicas innovadoras para la gestión eficiente del agua, contribuyendo a la sostenibilidad ambiental y el desarrollo de ciudades inteligentes.',
    vision: 'Ser líderes en la implementación de tecnologías IoT para la gestión integral del agua, creando un futuro más sostenible y conectado.',
    estado: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
]

let nextId = 2

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const homeService = {
  // Obtener todos los registros
  async getItems() {
    await delay(800) // Simular delay de red

    // Simular error aleatorio (5% de probabilidad)
    if (Math.random() < 0.05) {
      throw new Error('Error de conexión al servidor')
    }

    return [...homeItems]
  },

  // Obtener un registro por ID
  async getItem(id) {
    await delay(500)

    const item = homeItems.find(item => item.id === parseInt(id))
    if (!item) {
      throw new Error('Registro no encontrado')
    }

    return { ...item }
  },

  // Crear un nuevo registro
  async createItem(itemData) {
    await delay(1000)

    const newItem = {
      id: nextId++,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    homeItems.push(newItem)
    return { ...newItem }
  },

  // Actualizar un registro existente
  async updateItem(id, itemData) {
    await delay(800)

    const index = homeItems.findIndex(item => item.id === parseInt(id))
    if (index === -1) {
      throw new Error('Registro no encontrado')
    }

    const updatedItem = {
      ...homeItems[index],
      ...itemData,
      id: parseInt(id), // Asegurar que el ID no cambie
      updatedAt: new Date().toISOString()
    }

    homeItems[index] = updatedItem
    return { ...updatedItem }
  },

  // Eliminar un registro
  async deleteItem(id) {
    await delay(600)

    const index = homeItems.findIndex(item => item.id === parseInt(id))
    if (index === -1) {
      throw new Error('Registro no encontrado')
    }

    homeItems.splice(index, 1)
    return true
  },

  // Buscar registros por término
  async searchItems(searchTerm) {
    await delay(400)

    const term = searchTerm.toLowerCase()
    return homeItems.filter(item =>
      item.nombre.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.mision.toLowerCase().includes(term) ||
      item.vision.toLowerCase().includes(term)
    )
  },

  // Filtrar por estado
  async filterByStatus(status) {
    await delay(300)

    if (!status) return [...homeItems]

    return homeItems.filter(item => item.estado === status)
  },

  // Obtener estadísticas
  async getStats() {
    await delay(200)

    const total = homeItems.length
    const active = homeItems.filter(item => item.estado === 'active').length
    const inactive = total - active

    return {
      total,
      active,
      inactive,
      percentageActive: total > 0 ? Math.round((active / total) * 100) : 0
    }
  }
} 