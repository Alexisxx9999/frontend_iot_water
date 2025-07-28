import api from './api';

// Datos mock para desarrollo
const mockPersonnel = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    roleId: 1,
    role: { id: 1, name: 'Administrador' },
    status: 'Activo',
    department: 'Tecnología',
    position: 'Desarrollador Senior',
    startDate: '2022-01-15',
    phone: '3001234567'
  },
  {
    id: 2,
    name: 'María Gómez',
    email: 'maria.gomez@empresa.com',
    roleId: 2,
    role: { id: 2, name: 'Usuario' },
    status: 'Activo',
    department: 'Recursos Humanos',
    position: 'Analista de RRHH',
    startDate: '2021-09-01',
    phone: '3009876543'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@empresa.com',
    roleId: 3,
    role: { id: 3, name: 'Supervisor' },
    status: 'Activo',
    department: 'Atención al Cliente',
    position: 'Agente CRM',
    startDate: '2023-03-10',
    phone: '3005551234'
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana.martinez@empresa.com',
    roleId: 2,
    role: { id: 2, name: 'Usuario' },
    status: 'Inactivo',
    department: 'Finanzas',
    position: 'Contadora',
    startDate: '2020-06-20',
    phone: '3007778888'
  },
  {
    id: 5,
    name: 'Luis Rodríguez',
    email: 'luis.rodriguez@empresa.com',
    roleId: 1,
    role: { id: 1, name: 'Administrador' },
    status: 'Activo',
    department: 'Operaciones',
    position: 'Coordinador',
    startDate: '2021-12-01',
    phone: '3004445555'
  }
];

// Simular delay de API
const simulateApiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const personnelService = {
  // Obtener lista de personal con filtros
  async getPersonnel(filters = {}) {
    await simulateApiDelay();
    let filteredData = [...mockPersonnel];

    if (filters.nombre) {
      filteredData = filteredData.filter(p =>
        p.name.toLowerCase().includes(filters.nombre.toLowerCase()) ||
        p.email.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }

    if (filters.rol) {
      filteredData = filteredData.filter(p => p.roleId === parseInt(filters.rol));
    }

    if (filters.estado) {
      filteredData = filteredData.filter(p => p.status === filters.estado);
    }

    return { data: filteredData };
  },

  // Obtener usuario por ID
  async getPersonnelById(id) {
    await simulateApiDelay();
    const personnel = mockPersonnel.find(p => p.id === parseInt(id));
    if (!personnel) {
      throw new Error('Usuario no encontrado');
    }
    return { data: personnel };
  },

  // Crear nuevo usuario
  async createPersonnel(data) {
    await simulateApiDelay();
    const newPersonnel = {
      id: mockPersonnel.length + 1,
      ...data,
      role: mockPersonnel.find(p => p.roleId === parseInt(data.roleId))?.role || { id: data.roleId, name: 'Usuario' }
    };
    mockPersonnel.push(newPersonnel);
    return { data: newPersonnel };
  },

  // Actualizar usuario
  async updatePersonnel(id, data) {
    await simulateApiDelay();
    const index = mockPersonnel.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    mockPersonnel[index] = {
      ...mockPersonnel[index],
      ...data,
      role: mockPersonnel.find(p => p.roleId === parseInt(data.roleId))?.role || mockPersonnel[index].role
    };

    return { data: mockPersonnel[index] };
  },

  // Eliminar usuario
  async deletePersonnel(id) {
    await simulateApiDelay();
    const index = mockPersonnel.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    mockPersonnel.splice(index, 1);
    return { success: true };
  },

  // Obtener roles
  getRoles() {
    return api.get('/roles');
  },

  // Obtener departamentos
  getDepartments() {
    return api.get('/departments');
  },

  // Obtener permisos
  getPermissions() {
    return api.get('/permissions');
  },

  // Obtener permisos de usuario
  getUserPermissions(userId) {
    return api.get(`/personnel/${userId}/permissions`);
  },

  // Asignar roles a usuario
  assignRoles(userId, roles) {
    return api.post(`/personnel/${userId}/roles`, { roles });
  },

  // Asignar permisos individuales
  assignPermissions(userId, permissions) {
    return api.post(`/personnel/${userId}/permissions`, { permissions });
  },

  // Actualizar estado de usuario
  updateStatus(userId, status) {
    return api.patch(`/personnel/${userId}/status`, { status });
  },

  // Obtener historial de actividad
  getActivityHistory(userId) {
    return api.get(`/personnel/${userId}/activity`);
  },

  // Obtener métricas de interacción (CRM)
  getInteractionMetrics(userId) {
    return api.get(`/personnel/${userId}/interactions`);
  },

  // Obtener contribuciones AI
  getAIContributions(userId) {
    return api.get(`/personnel/${userId}/ai-contributions`);
  },

  // Generar reporte de perfil
  generateProfileReport(userId) {
    return api.get(`/personnel/${userId}/report`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
  },

  // Validar ID de empleado
  validateEmployeeId(employeeId) {
    return api.post('/personnel/validate-id', { employeeId });
  },

  // Validar email
  validateEmail(email) {
    return api.post('/personnel/validate-email', { email });
  },

  // Obtener antigüedad
  getSeniority(userId) {
    return api.get(`/personnel/${userId}/seniority`);
  }
};

export default personnelService;
