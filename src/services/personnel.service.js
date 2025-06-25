import api from './api';

class PersonnelService {
  // =====================================================
  // MÉTODOS PARA EMPLEADOS
  // =====================================================

  // Obtener todos los empleados
  async getAllEmployees() {
    try {
      const response = await api.get('/personnel/employees');
      return response.data;
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  }

  // Obtener empleado por ID
  async getEmployeeById(id) {
    try {
      const response = await api.get(`/personnel/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      throw error;
    }
  }

  // Crear nuevo empleado
  async createEmployee(employeeData) {
    try {
      const response = await api.post('/personnel/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  }

  // Actualizar empleado
  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/personnel/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      throw error;
    }
  }

  // Eliminar empleado
  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/personnel/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      throw error;
    }
  }

  // Buscar empleados por filtros
  async searchEmployees(filters = {}) {
    try {
      const response = await api.get('/personnel/employees/search', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error al buscar empleados:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA DEPARTAMENTOS
  // =====================================================

  // Obtener todos los departamentos
  async getDepartments() {
    try {
      const response = await api.get('/personnel/departments');
      return response.data;
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA ROLES
  // =====================================================

  // Obtener todos los roles
  async getRoles() {
    try {
      const response = await api.get('/personnel/roles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA PERMISOS
  // =====================================================

  // Obtener permisos de un empleado
  async getEmployeePermissions(employeeId) {
    try {
      const response = await api.get(`/personnel/employees/${employeeId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener permisos del empleado:', error);
      throw error;
    }
  }

  // Actualizar permisos de un empleado
  async updateEmployeePermissions(employeeId, permissions) {
    try {
      const response = await api.put(`/personnel/employees/${employeeId}/permissions`, { permissions });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar permisos del empleado:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA HABILIDADES
  // =====================================================

  // Obtener habilidades de un empleado
  async getEmployeeSkills(employeeId) {
    try {
      const response = await api.get(`/personnel/employees/${employeeId}/skills`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener habilidades del empleado:', error);
      throw error;
    }
  }

  // Actualizar habilidades de un empleado
  async updateEmployeeSkills(employeeId, skills) {
    try {
      const response = await api.put(`/personnel/employees/${employeeId}/skills`, { skills });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar habilidades del empleado:', error);
      throw error;
    }
  }

  // Obtener todas las habilidades disponibles
  async getAllSkills() {
    try {
      const response = await api.get('/personnel/skills');
      return response.data;
    } catch (error) {
      console.error('Error al obtener habilidades:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA HISTORIAL
  // =====================================================

  // Obtener historial de un empleado
  async getEmployeeHistory(employeeId, filters = {}) {
    try {
      const response = await api.get(`/personnel/employees/${employeeId}/history`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial del empleado:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA CONTRIBUCIONES IA
  // =====================================================

  // Obtener contribuciones IA de un empleado
  async getEmployeeAIContributions(employeeId) {
    try {
      const response = await api.get(`/personnel/employees/${employeeId}/ai-contributions`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener contribuciones IA del empleado:', error);
      throw error;
    }
  }

  // Actualizar modelo IA
  async updateAIModel(employeeId) {
    try {
      const response = await api.post(`/personnel/employees/${employeeId}/update-ai-model`);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar modelo IA:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA MÉTRICAS
  // =====================================================

  // Obtener métricas de un empleado
  async getEmployeeMetrics(employeeId, period = 'current') {
    try {
      const response = await api.get(`/personnel/employees/${employeeId}/metrics`, { 
        params: { period } 
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas del empleado:', error);
      throw error;
    }
  }

  // Obtener métricas mensuales
  async getMonthlyMetrics(employeeId, year, month) {
    try {
      const response = await api.get(`/personnel/employees/${employeeId}/monthly-metrics`, {
        params: { year, month }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas mensuales:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA ESTADÍSTICAS
  // =====================================================

  // Obtener estadísticas generales
  async getGeneralStats() {
    try {
      const response = await api.get('/personnel/stats/general');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      throw error;
    }
  }

  // Obtener estadísticas por departamento
  async getDepartmentStats() {
    try {
      const response = await api.get('/personnel/stats/departments');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas por departamento:', error);
      throw error;
    }
  }

  // Obtener estadísticas por rol
  async getRoleStats() {
    try {
      const response = await api.get('/personnel/stats/roles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas por rol:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA REPORTES
  // =====================================================

  // Generar reporte de empleados
  async generateEmployeeReport(filters = {}) {
    try {
      const response = await api.post('/personnel/reports/employees', filters);
      return response.data;
    } catch (error) {
      console.error('Error al generar reporte de empleados:', error);
      throw error;
    }
  }

  // Generar reporte de rendimiento
  async generatePerformanceReport(employeeId, period) {
    try {
      const response = await api.post(`/personnel/reports/performance/${employeeId}`, { period });
      return response.data;
    } catch (error) {
      console.error('Error al generar reporte de rendimiento:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA UPLOAD DE ARCHIVOS
  // =====================================================

  // Subir foto de perfil
  async uploadProfilePhoto(employeeId, file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post(`/personnel/employees/${employeeId}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al subir foto de perfil:', error);
      throw error;
    }
  }

  // =====================================================
  // MÉTODOS PARA VALIDACIÓN
  // =====================================================

  // Validar email único
  async validateEmail(email, employeeId = null) {
    try {
      const response = await api.post('/personnel/validate/email', { email, employeeId });
      return response.data;
    } catch (error) {
      console.error('Error al validar email:', error);
      throw error;
    }
  }

  // Validar ID de empleado único
  async validateEmployeeId(employeeId) {
    try {
      const response = await api.post('/personnel/validate/employee-id', { employeeId });
      return response.data;
    } catch (error) {
      console.error('Error al validar ID de empleado:', error);
      throw error;
    }
  }
}

export default new PersonnelService(); 