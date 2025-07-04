import api from './api';

export const personnelService = {
  // Obtener lista de personal con filtros
  getPersonnel(filters) {
    return api.get('/personnel', { params: filters });
  },

  // Obtener usuario por ID
  getPersonnelById(id) {
    return api.get(`/personnel/${id}`);
  },

  // Crear nuevo usuario
  createPersonnel(data) {
    return api.post('/personnel', data);
  },

  // Actualizar usuario
  updatePersonnel(id, data) {
    return api.put(`/personnel/${id}`, data);
  },

  // Eliminar usuario
  deletePersonnel(id) {
    return api.delete(`/personnel/${id}`);
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
