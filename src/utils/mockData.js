// Mock data para desarrollo

// Sectores
export const mockSectors = [
  { id: 1, name: 'Sector Norte', description: 'Zona norte de Quito', latitude: -0.1277, longitude: -78.5034 }, // Quito Norte
  { id: 2, name: 'Sector Sur', description: 'Zona sur de Quito', latitude: -0.3277, longitude: -78.5534 }, // Quito Sur
  { id: 3, name: 'Sector Este', description: 'Zona este de Quito', latitude: -0.2295, longitude: -78.4857 }, // Quito Este
  { id: 4, name: 'Sector Oeste', description: 'Zona oeste de Quito', latitude: -0.2295, longitude: -78.5834 }, // Quito Oeste
  { id: 5, name: 'Centro Histórico', description: 'Centro histórico de Quito', latitude: -0.2201, longitude: -78.5127 }, // Centro Histórico Quito
  { id: 6, name: 'Zona Industrial', description: 'Zona industrial de Guayaquil', latitude: -2.1709, longitude: -79.9224 }, // Guayaquil
  { id: 7, name: 'Residencial Norte', description: 'Zona residencial norte de Cuenca', latitude: -2.8810, longitude: -78.9827 }, // Cuenca Norte
  { id: 8, name: 'Residencial Sur', description: 'Zona residencial sur de Cuenca', latitude: -2.9110, longitude: -78.9827 } // Cuenca Sur
]

// Clientes
export const mockClients = [
  { id: 1, name: 'Empresa ABC S.A.', email: 'contacto@abc.com', phone: '+1234567890' },
  { id: 2, name: 'Industrias XYZ', email: 'info@xyz.com', phone: '+1234567891' },
  { id: 3, name: 'Comercial 123', email: 'ventas@123.com', phone: '+1234567892' },
  { id: 4, name: 'Servicios Rápidos', email: 'servicios@rapidos.com', phone: '+1234567893' },
  { id: 5, name: 'Distribuidora Central', email: 'distribucion@central.com', phone: '+1234567894' }
]

// Gateways
export const mockGateways = [
  { id: 1, name: 'Gateway Norte', serialNumber: 'GW-N001', location: 'Sector Norte' },
  { id: 2, name: 'Gateway Sur', serialNumber: 'GW-S001', location: 'Sector Sur' },
  { id: 3, name: 'Gateway Este', serialNumber: 'GW-E001', location: 'Sector Este' },
  { id: 4, name: 'Gateway Oeste', serialNumber: 'GW-W001', location: 'Sector Oeste' },
  { id: 5, name: 'Gateway Centro', serialNumber: 'GW-C001', location: 'Centro Histórico' }
]

// Dispositivos
export const mockDevices = [
  {
    id: 1,
    serialNumber: 'MED-001-2024',
    type: 'MEDIDOR',
    model: 'WaterFlow Pro X1',
    manufacturer: 'AquaTech',
    installationDate: '2024-01-15',
    status: 'ACTIVO',
    sectorId: 1,
    sector: mockSectors[0],
    clientId: 1,
    client: mockClients[0],
    gatewayId: 1,
    gateway: mockGateways[0],
    reportFrequency: 15,
    alertThreshold: 85,
    firmwareVersion: '2.1.0',
    customConfig: { frequency: 868, power: 14 },
    latitude: -0.1277,
    longitude: -78.5034,
    address: 'Av. Amazonas 123, Sector Norte',
    batteryLevel: 92,
    loraSignal: -45,
    lastCommunication: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    serialNumber: 'VAL-001-2024',
    type: 'VALVULA',
    model: 'SmartValve V2',
    manufacturer: 'FlowControl',
    installationDate: '2024-01-20',
    status: 'ACTIVO',
    sectorId: 2,
    sector: mockSectors[1],
    clientId: 2,
    client: mockClients[1],
    gatewayId: 2,
    gateway: mockGateways[1],
    reportFrequency: 30,
    alertThreshold: 90,
    firmwareVersion: '1.8.2',
    customConfig: { pressure: 2.5, flow: 100 },
    latitude: -0.3277,
    longitude: -78.5534,
    address: 'Av. Maldonado 456, Sector Sur',
    batteryLevel: 78,
    loraSignal: -52,
    lastCommunication: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    serialNumber: 'GW-001-2024',
    type: 'GATEWAY',
    model: 'LoRaWAN Gateway Pro',
    manufacturer: 'NetworkTech',
    installationDate: '2024-01-10',
    status: 'ACTIVO',
    sectorId: 5,
    sector: mockSectors[4],
    clientId: null,
    client: null,
    gatewayId: null,
    gateway: null,
    reportFrequency: 5,
    alertThreshold: 95,
    firmwareVersion: '3.0.1',
    customConfig: { channels: [868.1, 868.3, 868.5] },
    latitude: -0.2201,
    longitude: -78.5127,
    address: 'Calle García Moreno 789, Centro Histórico',
    batteryLevel: 100,
    loraSignal: -30,
    lastCommunication: new Date(Date.now() - 1 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    serialNumber: 'MED-002-2024',
    type: 'MEDIDOR',
    model: 'WaterFlow Pro X1',
    manufacturer: 'AquaTech',
    installationDate: '2024-02-01',
    status: 'MANTENIMIENTO',
    sectorId: 3,
    sector: mockSectors[2],
    clientId: 3,
    client: mockClients[2],
    gatewayId: 3,
    gateway: mockGateways[2],
    reportFrequency: 15,
    alertThreshold: 80,
    firmwareVersion: '2.0.5',
    customConfig: { frequency: 868, power: 14 },
    latitude: -0.2295,
    longitude: -78.4857,
    address: 'Av. Simón Bolívar 321, Sector Este',
    batteryLevel: 45,
    loraSignal: -65,
    lastCommunication: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    serialNumber: 'VAL-002-2024',
    type: 'VALVULA',
    model: 'SmartValve V2',
    manufacturer: 'FlowControl',
    installationDate: '2024-02-05',
    status: 'FALLA',
    sectorId: 4,
    sector: mockSectors[3],
    clientId: 4,
    client: mockClients[3],
    gatewayId: 4,
    gateway: mockGateways[3],
    reportFrequency: 30,
    alertThreshold: 85,
    firmwareVersion: '1.7.9',
    customConfig: { pressure: 2.0, flow: 80 },
    latitude: -0.2295,
    longitude: -78.5834,
    address: 'Av. Occidental 654, Sector Oeste',
    batteryLevel: 15,
    loraSignal: -75,
    lastCommunication: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    serialNumber: 'MED-003-2024',
    type: 'MEDIDOR',
    model: 'WaterFlow Pro X1',
    manufacturer: 'AquaTech',
    installationDate: '2024-02-10',
    status: 'DESCONECTADO',
    sectorId: 6,
    sector: mockSectors[5],
    clientId: 5,
    client: mockClients[4],
    gatewayId: 5,
    gateway: mockGateways[4],
    reportFrequency: 15,
    alertThreshold: 90,
    firmwareVersion: '2.1.0',
    customConfig: { frequency: 868, power: 14 },
    latitude: -2.1709,
    longitude: -79.9224,
    address: 'Av. Juan Tanca Marengo 987, Zona Industrial',
    batteryLevel: 0,
    loraSignal: null,
    lastCommunication: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    serialNumber: 'MED-004-2024',
    type: 'MEDIDOR',
    model: 'WaterFlow Pro X1',
    manufacturer: 'AquaTech',
    installationDate: '2024-02-15',
    status: 'ACTIVO',
    sectorId: 7,
    sector: mockSectors[6],
    clientId: 1,
    client: mockClients[0],
    gatewayId: 1,
    gateway: mockGateways[0],
    reportFrequency: 15,
    alertThreshold: 85,
    firmwareVersion: '2.1.0',
    customConfig: { frequency: 868, power: 14 },
    latitude: -2.8810,
    longitude: -78.9827,
    address: 'Av. de las Américas 111, Residencial Norte',
    batteryLevel: 88,
    loraSignal: -48,
    lastCommunication: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: 8,
    serialNumber: 'VAL-003-2024',
    type: 'VALVULA',
    model: 'SmartValve V2',
    manufacturer: 'FlowControl',
    installationDate: '2024-02-20',
    status: 'ACTIVO',
    sectorId: 8,
    sector: mockSectors[7],
    clientId: 2,
    client: mockClients[1],
    gatewayId: 2,
    gateway: mockGateways[1],
    reportFrequency: 30,
    alertThreshold: 90,
    firmwareVersion: '1.8.2',
    customConfig: { pressure: 2.5, flow: 100 },
    latitude: -2.9110,
    longitude: -78.9827,
    address: 'Av. Loja 222, Residencial Sur',
    batteryLevel: 95,
    loraSignal: -42,
    lastCommunication: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  }
]

// Mantenimientos
export const mockMaintenance = [
  {
    id: 1,
    deviceId: 1,
    type: 'PREVENTIVO',
    date: '2024-01-20',
    startTime: '09:00',
    duration: 2,
    technician: 'Juan Pérez',
    description: 'Mantenimiento preventivo mensual del medidor',
    activities: 'Limpieza de sensores, verificación de conexiones, calibración',
    parts: 'Kit de limpieza, lubricante',
    cost: 150.00,
    observations: 'Dispositivo funcionando correctamente',
    postMaintenanceStatus: 'ACTIVO'
  },
  {
    id: 2,
    deviceId: 2,
    type: 'CORRECTIVO',
    date: '2024-01-25',
    startTime: '14:30',
    duration: 3,
    technician: 'María García',
    description: 'Reparación de válvula con fuga',
    activities: 'Reemplazo de sellos, ajuste de presión, prueba de funcionamiento',
    parts: 'Sellos de repuesto, válvula de control',
    cost: 320.00,
    observations: 'Fuga corregida, válvula operativa',
    postMaintenanceStatus: 'ACTIVO'
  },
  {
    id: 3,
    deviceId: 4,
    type: 'CALIBRACION',
    date: '2024-02-05',
    startTime: '10:00',
    duration: 1.5,
    technician: 'Carlos López',
    description: 'Calibración de sensores de flujo',
    activities: 'Verificación de precisión, ajuste de parámetros',
    parts: 'Equipo de calibración',
    cost: 200.00,
    observations: 'Sensores calibrados correctamente',
    postMaintenanceStatus: 'MANTENIMIENTO'
  }
]

// Logs técnicos
export const mockLogs = [
  {
    id: 1,
    deviceId: 1,
    type: 'COMUNICACION',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    message: 'Comunicación exitosa con gateway',
    details: 'Datos enviados: flujo=45.2L/min, presión=2.1bar'
  },
  {
    id: 2,
    deviceId: 1,
    type: 'ALERTA',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    message: 'Nivel de batería bajo',
    details: 'Batería al 15%, requiere mantenimiento'
  },
  {
    id: 3,
    deviceId: 2,
    type: 'CONFIGURACION',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    message: 'Configuración actualizada',
    details: 'Frecuencia de reporte cambiada a 30 minutos'
  },
  {
    id: 4,
    deviceId: 3,
    type: 'COMUNICACION',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    message: 'Gateway operativo',
    details: 'Conectados 12 dispositivos, señal fuerte'
  },
  {
    id: 5,
    deviceId: 4,
    type: 'ERROR',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    message: 'Error de comunicación',
    details: 'Timeout en conexión con gateway'
  },
  {
    id: 6,
    deviceId: 5,
    type: 'ALERTA',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    message: 'Falla en válvula',
    details: 'Presión fuera de rango normal'
  },
  {
    id: 7,
    deviceId: 6,
    type: 'ERROR',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    message: 'Dispositivo desconectado',
    details: 'Sin comunicación por más de 24 horas'
  },
  {
    id: 8,
    deviceId: 7,
    type: 'MANTENIMIENTO',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    message: 'Mantenimiento programado completado',
    details: 'Verificación de sensores y limpieza realizada'
  }
]

// Función para generar datos paginados
export const generatePaginatedData = (data, page = 1, limit = 10, filters = {}) => {
  let filteredData = [...data]

  // Aplicar filtros
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredData = filteredData.filter(item => 
      item.serialNumber?.toLowerCase().includes(searchTerm) ||
      item.type?.toLowerCase().includes(searchTerm) ||
      item.sector?.name?.toLowerCase().includes(searchTerm) ||
      item.client?.name?.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.type) {
    filteredData = filteredData.filter(item => item.type === filters.type)
  }

  if (filters.status) {
    filteredData = filteredData.filter(item => item.status === filters.status)
  }

  if (filters.sector) {
    filteredData = filteredData.filter(item => item.sectorId === parseInt(filters.sector))
  }

  // Aplicar ordenamiento
  if (filters.sortBy) {
    filteredData.sort((a, b) => {
      let aVal = a[filters.sortBy]
      let bVal = b[filters.sortBy]
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (filters.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })
  }

  // Calcular paginación
  const total = filteredData.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = filteredData.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    page,
    limit,
    total,
    totalPages
  }
}

// Función para simular delay de API
export const simulateApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
} 