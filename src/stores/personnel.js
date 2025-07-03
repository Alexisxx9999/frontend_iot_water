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
    position: 'Desarrollador',
    status: 'active',
    startDate: '2022-01-15',
    phone: '3001234567',
    dni: '12345678',
    birthDate: '1990-05-10',
    address: 'Calle 123',
    contractType: 'FULL_TIME',
    salary: 3500,
    schedule: 'MORNING',
    roles: [{ id: 1, name: 'Usuario' }],
    experience: '2 años en desarrollo web',
    skills: 'Vue, JavaScript',
    certifications: 'Certificado Vue.js',
    observations: ''
  },
  {
    id: 2,
    employeeId: 'EMP002',
    firstName: 'María',
    lastName: 'Gómez',
    email: 'maria.gomez@empresa.com',
    department: 'Recursos Humanos',
    position: 'Analista',
    status: 'active',
    startDate: '2021-09-01',
    phone: '3009876543',
    dni: '87654321',
    birthDate: '1988-11-20',
    address: 'Avenida 456',
    contractType: 'PART_TIME',
    salary: 2000,
    schedule: 'AFTERNOON',
    roles: [{ id: 2, name: 'RRHH' }],
    experience: '5 años en recursos humanos',
    skills: 'Selección, Nómina',
    certifications: '',
    observations: ''
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
    // Métodos mock para detalle, historial, etc. pueden ser agregados si los necesitas
    clearError() {
      this.error = null;
    }
  }
}); 