import { defineStore } from 'pinia';

// Datos mock de ejemplo
const mockPersonnel = [
  {
    id: 1,
    employeeId: 'EMP001',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@empresa.com',
    department: 'Tecnología',
    position: 'Desarrollador Senior',
    status: 'active',
    startDate: '2022-01-15',
    phone: '3001234567',
    dni: '12345678',
    birthDate: '1990-05-10',
    address: 'Calle 123, Ciudad',
    contractType: 'FULL_TIME',
    salary: 3500,
    schedule: 'MORNING',
    roles: [{ id: 1, name: 'Usuario' }, { id: 3, name: 'Administrador' }],
    experience: '2 años en desarrollo web',
    skills: 'Vue, JavaScript, Node.js, Python',
    certifications: 'Certificado Vue.js, AWS Developer',
    observations: 'Excelente desempeño en proyectos críticos'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    firstName: 'María',
    lastName: 'Gómez',
    email: 'maria.gomez@empresa.com',
    department: 'Recursos Humanos',
    position: 'Analista de RRHH',
    status: 'active',
    startDate: '2021-09-01',
    phone: '3009876543',
    dni: '87654321',
    birthDate: '1988-11-20',
    address: 'Avenida 456, Sector Norte',
    contractType: 'PART_TIME',
    salary: 2000,
    schedule: 'AFTERNOON',
    roles: [{ id: 2, name: 'RRHH' }],
    experience: '5 años en recursos humanos',
    skills: 'Selección, Nómina, Capacitación',
    certifications: 'Certificación en Gestión de Talento',
    observations: 'Responsable del proceso de reclutamiento'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    firstName: 'Carlos',
    lastName: 'López',
    email: 'carlos.lopez@empresa.com',
    department: 'Atención al Cliente',
    position: 'Agente CRM',
    status: 'active',
    startDate: '2023-03-10',
    phone: '3005551234',
    dni: '11223344',
    birthDate: '1992-08-15',
    address: 'Carrera 789, Centro',
    contractType: 'FULL_TIME',
    salary: 2800,
    schedule: 'ROTATING',
    roles: [{ id: 4, name: 'CRM' }],
    experience: '3 años en atención al cliente',
    skills: 'Comunicación, Resolución de problemas, CRM',
    certifications: 'Certificación en Servicio al Cliente',
    observations: 'Alto índice de satisfacción del cliente'
  },
  {
    id: 4,
    employeeId: 'EMP004',
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@empresa.com',
    department: 'Finanzas',
    position: 'Contadora',
    status: 'active',
    startDate: '2020-06-20',
    phone: '3007778888',
    dni: '55667788',
    birthDate: '1985-12-03',
    address: 'Calle 321, Sector Sur',
    contractType: 'FULL_TIME',
    salary: 3200,
    schedule: 'MORNING',
    roles: [{ id: 1, name: 'Usuario' }],
    experience: '8 años en contabilidad',
    skills: 'Contabilidad, Excel, SAP',
    certifications: 'Contador Público, Especialización en Finanzas',
    observations: 'Responsable de la contabilidad general'
  },
  {
    id: 5,
    employeeId: 'EMP005',
    firstName: 'Luis',
    lastName: 'Rodríguez',
    email: 'luis.rodriguez@empresa.com',
    department: 'Operaciones',
    position: 'Supervisor',
    status: 'inactive',
    startDate: '2019-11-05',
    phone: '3009990000',
    dni: '99887766',
    birthDate: '1983-04-18',
    address: 'Avenida 654, Zona Industrial',
    contractType: 'FULL_TIME',
    salary: 3800,
    schedule: 'NIGHT',
    roles: [{ id: 5, name: 'Supervisor' }],
    experience: '10 años en operaciones',
    skills: 'Supervisión, Logística, Gestión de equipos',
    certifications: 'Certificación en Gestión de Operaciones',
    observations: 'Licencia médica temporal'
  }
];

let nextId = 3;

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    personnel: [...mockPersonnel],
    totalItems: mockPersonnel.length,
    loading: false,
    error: null,
    currentUser: null,
    roles: [
      { id: 1, name: 'Usuario' },
      { id: 2, name: 'RRHH' },
      { id: 3, name: 'Administrador' },
      { id: 4, name: 'CRM' },
      { id: 5, name: 'Supervisor' },
      { id: 6, name: 'Técnico' },
      { id: 7, name: 'Invitado' }
    ],
    departments: [
      'Recursos Humanos',
      'Tecnología',
      'Ventas',
      'Marketing',
      'Finanzas',
      'Operaciones',
      'Atención al Cliente',
      'Desarrollo',
      'Calidad',
      'Administración'
    ],
    permissions: [],
    filters: {
      page: 1,
      limit: 10,
      search: '',
      department: '',
      role: '',
      sortBy: '',
      sortOrder: ''
    },
    activityHistory: [],
    interactionMetrics: null,
    aiContributions: null,
    additionalPermissions: [],
    userPermissions: [],
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getPersonnelList: (state) => {
      let list = [...state.personnel];
      // Filtros
      if (state.filters.search) {
        const s = state.filters.search.toLowerCase();
        list = list.filter(p =>
          p.firstName.toLowerCase().includes(s) ||
          p.lastName.toLowerCase().includes(s) ||
          p.employeeId.toLowerCase().includes(s) ||
          p.email.toLowerCase().includes(s)
        );
      }
      if (state.filters.department) {
        list = list.filter(p => p.department === state.filters.department);
      }
      if (state.filters.role) {
        list = list.filter(p => p.roles && p.roles.some(r => r.id == state.filters.role));
      }
      // Ordenamiento
      if (state.filters.sortBy) {
        list = list.sort((a, b) => {
          const key = state.filters.sortBy;
          if (a[key] < b[key]) return state.filters.sortOrder === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return state.filters.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      // Paginación
      const start = (state.filters.page - 1) * state.filters.limit;
      const end = start + state.filters.limit;
      return list.slice(start, end);
    },
    getCurrentUser: (state) => state.currentUser,
    getFilters: (state) => state.filters,
    getTotalPages: (state) => {
      let list = [...state.personnel];
      if (state.filters.search) {
        const s = state.filters.search.toLowerCase();
        list = list.filter(p =>
          p.firstName.toLowerCase().includes(s) ||
          p.lastName.toLowerCase().includes(s) ||
          p.employeeId.toLowerCase().includes(s) ||
          p.email.toLowerCase().includes(s)
        );
      }
      if (state.filters.department) {
        list = list.filter(p => p.department === state.filters.department);
      }
      if (state.filters.role) {
        list = list.filter(p => p.roles && p.roles.some(r => r.id == state.filters.role));
      }
      return Math.ceil(list.length / state.filters.limit) || 1;
    },
    getUserById: (state) => (id) => {
      return state.personnel.find(p => p.id === id);
    },
    getActivePersonnel: (state) => {
      return state.personnel.filter(p => p.status === 'active');
    },
    getPersonnelByDepartment: (state) => (department) => {
      return state.personnel.filter(p => p.department === department);
    }
  },

  actions: {
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    fetchPersonnel() {
      // No hace nada porque los datos ya están en memoria
      this.totalItems = this.personnel.length;
    },
    async createUser(userData) {
      const newUser = {
        ...userData,
        id: nextId++,
        status: 'active',
        roles: this.roles.filter(r => userData.roles?.includes(r.id)),
        startDate: userData.startDate || new Date().toISOString().slice(0, 10)
      };
      this.personnel.push(newUser);
      this.totalItems = this.personnel.length;
    },
    async updateUser(id, userData) {
      const idx = this.personnel.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.personnel[idx] = {
          ...this.personnel[idx],
          ...userData,
          roles: this.roles.filter(r => userData.roles?.includes(r.id)),
        };
      }
    },
    async deleteUser(id) {
      this.personnel = this.personnel.filter(p => p.id !== id);
      this.totalItems = this.personnel.length;
    },
    async updateUserStatus(id, status) {
      const user = this.personnel.find(p => p.id === id);
      if (user) {
        user.status = status;
        // Aquí se podría hacer una llamada a la API real
        // await personnelService.updateStatus(id, status);
      }
    },
    async updateUserRoles(id, roleIds) {
      const user = this.personnel.find(p => p.id === id);
      if (user) {
        user.roles = this.roles.filter(r => roleIds.includes(r.id));
      }
    },
    async exportUserProfile(userId) {
      const user = this.getUserById(userId);
      if (!user) return null;
      
      return {
        user,
        exportDate: new Date(),
        totalEmployees: this.personnel.length,
        activeEmployees: this.getActivePersonnel.length
      };
    },
    clearError() {
      this.error = null;
    }
  }
}); 