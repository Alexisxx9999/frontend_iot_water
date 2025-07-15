// Servicio de Gateways con datos simulados (mock)

let gatewaysItems = [
  {
    id: 1,
    code: 'GW-001',
    address: 'Av. Central',
    latitude: -0.19,
    longitude: -78.5,
    altitude: 2800,
    installationDate: '2023-01-10',
    state: 'activo'
  },
  {
    id: 2,
    code: 'GW-002',
    address: 'Calle 10',
    latitude: -0.21,
    longitude: -78.6,
    altitude: 2850,
    installationDate: '2023-02-15',
    state: 'desactivado'
  }
]
let nextId = 3
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function useGatewayService() {
  return {
    async list() {
      await delay(500)
      return [...gatewaysItems]
    },
    async create(data) {
      await delay(700)
      // Validación simple: código único
      if (gatewaysItems.some(gw => gw.code === data.code)) {
        throw new Error('Ya existe un gateway con ese código')
      }
      const newItem = {
        id: nextId++,
        ...data
      }
      gatewaysItems.push(newItem)
      return { ...newItem }
    },
    async update(id, data) {
      await delay(700)
      const index = gatewaysItems.findIndex(gw => gw.id === parseInt(id))
      if (index === -1) throw new Error('Gateway no encontrado')
      // Validar código único (excepto el propio)
      if (gatewaysItems.some(gw => gw.code === data.code && gw.id !== parseInt(id))) {
        throw new Error('Ya existe un gateway con ese código')
      }
      const updatedItem = { ...gatewaysItems[index], ...data, id: parseInt(id) }
      gatewaysItems[index] = updatedItem
      // Actualizar también window.__GATEWAYS__ si existe
      if (typeof window !== 'undefined' && window.__GATEWAYS__) {
        const idx = window.__GATEWAYS__.findIndex(g => g.id === parseInt(id))
        if (idx !== -1) window.__GATEWAYS__[idx] = { ...updatedItem }
      }
      return { ...updatedItem }
    },
    async deactivate(id) {
      await delay(400)
      const index = gatewaysItems.findIndex(gw => gw.id === parseInt(id))
      if (index === -1) throw new Error('Gateway no encontrado')
      gatewaysItems[index].state = 'desactivado'
      return { ...gatewaysItems[index] }
    },
    async activate(id) {
      await delay(400)
      const index = gatewaysItems.findIndex(gw => gw.id === parseInt(id))
      if (index === -1) throw new Error('Gateway no encontrado')
      gatewaysItems[index].state = 'activo'
      return { ...gatewaysItems[index] }
    },
    async delete(id) {
      await delay(400)
      const index = gatewaysItems.findIndex(gw => gw.id === parseInt(id))
      if (index === -1) throw new Error('Gateway no encontrado')
      gatewaysItems.splice(index, 1)
      return true
    },
    async sendData(gateway, url) {
      await delay(1000)
      // Simulación de envío de datos
      return true
    }
  }
} 