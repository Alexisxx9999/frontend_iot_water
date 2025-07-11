import { ref } from 'vue'

const mockGateways = ref([
  { id: 1, code: 'GW-001', address: 'Av. Central', latitude: -0.19, longitude: -78.5, altitude: 2800, installationDate: '2023-01-10', state: 'activo' },
  { id: 2, code: 'GW-002', address: 'Calle 10', latitude: -0.21, longitude: -78.6, altitude: 2850, installationDate: '2023-02-15', state: 'desactivado' },
  { id: 3, code: 'GW-003', address: 'Av. Amazonas', latitude: -0.18, longitude: -78.47, altitude: 2780, installationDate: '2023-03-20', state: 'activo' },
  { id: 4, code: 'GW-004', address: 'Calle 12', latitude: -0.22, longitude: -78.61, altitude: 2870, installationDate: '2023-04-05', state: 'desactivado' },
  { id: 5, code: 'GW-005', address: 'Av. República', latitude: -0.20, longitude: -78.52, altitude: 2810, installationDate: '2023-05-12', state: 'activo' },
  { id: 6, code: 'GW-006', address: 'Calle 15', latitude: -0.23, longitude: -78.62, altitude: 2880, installationDate: '2023-06-18', state: 'desactivado' },
  { id: 7, code: 'GW-007', address: 'Av. Naciones Unidas', latitude: -0.17, longitude: -78.46, altitude: 2770, installationDate: '2023-07-22', state: 'activo' },
  { id: 8, code: 'GW-008', address: 'Calle 20', latitude: -0.24, longitude: -78.63, altitude: 2890, installationDate: '2023-08-30', state: 'desactivado' }
])

export function useGatewayService() {
  return {
    async list() {
      return mockGateways.value
    },
    async create(data) {
      mockGateways.value.push({ ...data, id: Date.now() })
    },
    async update(id, data) {
      const idx = mockGateways.value.findIndex(g => g.id === id)
      if (idx !== -1) mockGateways.value[idx] = { ...mockGateways.value[idx], ...data }
    },
    async deactivate(id) {
      const gw = mockGateways.value.find(g => g.id === id)
      if (gw) gw.state = 'desactivado'
    },
    async activate(id) {
      const gw = mockGateways.value.find(g => g.id === id)
      if (gw) gw.state = 'activo'
    },
    async delete(id) {
      mockGateways.value = mockGateways.value.filter(g => g.id !== id)
    },
    async sendData(gateway, url) {
      // Simular envío de datos
      await new Promise(r => setTimeout(r, 1500))
      // Aquí iría la llamada real al backend
    }
  }
} 