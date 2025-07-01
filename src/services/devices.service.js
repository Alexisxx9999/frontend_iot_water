import api from './api'
import { 
  mockDevices, 
  mockSectors, 
  mockClients, 
  mockGateways, 
  mockMaintenance, 
  mockLogs,
  generatePaginatedData,
  simulateApiDelay 
} from '@/utils/mockData'

// Tipos de dispositivos
export const DEVICE_TYPES = {
  MEDIDOR: 'Medidor',
  VALVULA: 'Válvula',
  GATEWAY: 'Gateway'
}

// Estados operacionales
export const DEVICE_STATUS = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  MANTENIMIENTO: 'En Mantenimiento',
  FALLA: 'En Falla',
  DESCONECTADO: 'Desconectado'
}

// Tipos de mantenimiento
export const MAINTENANCE_TYPES = {
  PREVENTIVO: 'Preventivo',
  CORRECTIVO: 'Correctivo',
  CALIBRACION: 'Calibración',
  ACTUALIZACION: 'Actualización de Firmware'
}

// Tipos de logs
export const LOG_TYPES = {
  ALERTA: 'Alerta',
  COMUNICACION: 'Comunicación',
  CONFIGURACION: 'Configuración',
  ERROR: 'Error',
  MANTENIMIENTO: 'Mantenimiento'
}

class DevicesService {
  // Obtener lista de dispositivos con filtros y paginación
  async getDevices(params = {}) {
    try {
      // Simular delay de API
      await simulateApiDelay()
      
      // Usar mock data en desarrollo
      const result = generatePaginatedData(mockDevices, params.page, params.limit, params)
      return result
    } catch (error) {
      console.error('Error fetching devices:', error)
      throw error
    }
  }

  // Obtener dispositivo por ID
  async getDeviceById(id) {
    try {
      await simulateApiDelay()
      const device = mockDevices.find(d => d.id === parseInt(id))
      if (!device) {
        throw new Error('Dispositivo no encontrado')
      }
      return device
    } catch (error) {
      console.error('Error fetching device:', error)
      throw error
    }
  }

  // Crear nuevo dispositivo
  async createDevice(deviceData) {
    try {
      await simulateApiDelay()
      const newDevice = {
        id: Math.max(...mockDevices.map(d => d.id)) + 1,
        ...deviceData,
        createdAt: new Date().toISOString()
      }
      mockDevices.push(newDevice)
      return newDevice
    } catch (error) {
      console.error('Error creating device:', error)
      throw error
    }
  }

  // Actualizar dispositivo
  async updateDevice(id, deviceData) {
    try {
      await simulateApiDelay()
      const index = mockDevices.findIndex(d => d.id === parseInt(id))
      if (index === -1) {
        throw new Error('Dispositivo no encontrado')
      }
      mockDevices[index] = { ...mockDevices[index], ...deviceData, updatedAt: new Date().toISOString() }
      return mockDevices[index]
    } catch (error) {
      console.error('Error updating device:', error)
      throw error
    }
  }

  // Eliminar dispositivo
  async deleteDevice(id) {
    try {
      await simulateApiDelay()
      const index = mockDevices.findIndex(d => d.id === parseInt(id))
      if (index === -1) {
        throw new Error('Dispositivo no encontrado')
      }
      mockDevices.splice(index, 1)
      return { success: true }
    } catch (error) {
      console.error('Error deleting device:', error)
      throw error
    }
  }

  // Obtener mantenimientos de un dispositivo
  async getDeviceMaintenance(id) {
    try {
      await simulateApiDelay()
      return mockMaintenance.filter(m => m.deviceId === parseInt(id))
    } catch (error) {
      console.error('Error fetching device maintenance:', error)
      throw error
    }
  }

  // Registrar mantenimiento
  async createMaintenance(deviceId, maintenanceData) {
    try {
      await simulateApiDelay()
      const newMaintenance = {
        id: Math.max(...mockMaintenance.map(m => m.id)) + 1,
        deviceId: parseInt(deviceId),
        ...maintenanceData,
        createdAt: new Date().toISOString()
      }
      mockMaintenance.push(newMaintenance)
      return newMaintenance
    } catch (error) {
      console.error('Error creating maintenance:', error)
      throw error
    }
  }

  // Obtener logs técnicos de un dispositivo
  async getDeviceLogs(id, params = {}) {
    try {
      await simulateApiDelay()
      let logs = mockLogs.filter(l => l.deviceId === parseInt(id))
      
      if (params.type) {
        logs = logs.filter(l => l.type === params.type)
      }
      
      return logs
    } catch (error) {
      console.error('Error fetching device logs:', error)
      throw error
    }
  }

  // Actualizar firmware
  async updateFirmware(id, firmwareData) {
    try {
      await simulateApiDelay()
      const device = mockDevices.find(d => d.id === parseInt(id))
      if (!device) {
        throw new Error('Dispositivo no encontrado')
      }
      device.firmwareVersion = firmwareData.version
      return { success: true, message: 'Firmware actualizado correctamente' }
    } catch (error) {
      console.error('Error updating firmware:', error)
      throw error
    }
  }

  // Obtener sectores
  async getSectors() {
    try {
      await simulateApiDelay()
      return mockSectors
    } catch (error) {
      console.error('Error fetching sectors:', error)
      throw error
    }
  }

  // Obtener clientes
  async getClients() {
    try {
      await simulateApiDelay()
      return mockClients
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  // Obtener gateways
  async getGateways() {
    try {
      await simulateApiDelay()
      return mockGateways
    } catch (error) {
      console.error('Error fetching gateways:', error)
      throw error
    }
  }

  // Buscar dispositivos
  async searchDevices(searchTerm) {
    try {
      await simulateApiDelay()
      const filtered = mockDevices.filter(device => 
        device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.sector?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      return filtered
    } catch (error) {
      console.error('Error searching devices:', error)
      throw error
    }
  }

  // Obtener estadísticas de dispositivos
  async getDeviceStats() {
    try {
      await simulateApiDelay()
      return {
        total: mockDevices.length,
        active: mockDevices.filter(d => d.status === 'ACTIVO').length,
        inactive: mockDevices.filter(d => d.status === 'INACTIVO').length,
        maintenance: mockDevices.filter(d => d.status === 'MANTENIMIENTO').length,
        failure: mockDevices.filter(d => d.status === 'FALLA').length,
        disconnected: mockDevices.filter(d => d.status === 'DESCONECTADO').length
      }
    } catch (error) {
      console.error('Error fetching device stats:', error)
      throw error
    }
  }
}

export default new DevicesService() 