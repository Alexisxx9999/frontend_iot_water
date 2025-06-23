<template>
  <div class="complaint-list-page">
    <div class="page-header">
      <h1>Denuncias Ciudadanas</h1>
      <p>Gestión de denuncias y reclamos ciudadanos</p>
    </div>

    <div class="page-content">
      <div class="filters">
        <input type="text" v-model="searchTerm" placeholder="Buscar denuncias..." class="search-input" />
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in-progress">En proceso</option>
          <option value="resolved">Resuelto</option>
          <option value="closed">Cerrado</option>
        </select>
        <button class="btn-primary" @click="addComplaint">
          <span>➕</span> Nueva Denuncia
        </button>
      </div>

      <div class="complaints-grid">
        <div v-for="complaint in filteredComplaints" :key="complaint.id" class="complaint-card"
          :class="complaint.status">
          <div class="complaint-header">
            <h3>{{ complaint.title }}</h3>
            <span class="status-badge" :class="complaint.status">
              {{ getStatusText(complaint.status) }}
            </span>
          </div>
          <div class="complaint-info">
            <p><strong>ID:</strong> {{ complaint.id }}</p>
            <p><strong>Denunciante:</strong> {{ complaint.reporter }}</p>
            <p><strong>Ubicación:</strong> {{ complaint.location }}</p>
            <p><strong>Fecha:</strong> {{ complaint.date }}</p>
            <p class="complaint-description">{{ complaint.description }}</p>
          </div>
          <div class="complaint-actions">
            <button class="btn-secondary" @click="viewComplaint(complaint.id)">
              Ver Detalles
            </button>
            <button class="btn-secondary" @click="editComplaint(complaint.id)">
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ComplaintListPage',
  setup() {
    const router = useRouter();
    const searchTerm = ref('');
    const statusFilter = ref('');

    // Datos de ejemplo
    const complaints = ref([
      {
        id: 'DEN001',
        title: 'Fuga de agua en calle principal',
        reporter: 'María González',
        location: 'Calle Principal #123',
        status: 'pending',
        date: '2024-01-15',
        description: 'Hay una fuga de agua visible en la calle principal que está causando desperdicio.'
      },
      {
        id: 'DEN002',
        title: 'Contaminación en río local',
        reporter: 'Carlos Rodríguez',
        location: 'Río San Pedro',
        status: 'in-progress',
        date: '2024-01-14',
        description: 'Se observa contaminación en el río, posible descarga de aguas residuales.'
      },
      {
        id: 'DEN003',
        title: 'Mal funcionamiento de medidor',
        reporter: 'Ana López',
        location: 'Residencial Norte',
        status: 'resolved',
        date: '2024-01-13',
        description: 'El medidor de agua no funciona correctamente, muestra lecturas erróneas.'
      }
    ]);

    const filteredComplaints = computed(() => {
      return complaints.value.filter(complaint => {
        const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          complaint.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          complaint.reporter.toLowerCase().includes(searchTerm.value.toLowerCase());
        const matchesStatus = !statusFilter.value || complaint.status === statusFilter.value;
        return matchesSearch && matchesStatus;
      });
    });

    const getStatusText = (status) => {
      const statusMap = {
        pending: 'Pendiente',
        'in-progress': 'En proceso',
        resolved: 'Resuelto',
        closed: 'Cerrado'
      };
      return statusMap[status] || status;
    };

    const addComplaint = () => {
      console.log('Agregar denuncia');
    };

    const viewComplaint = (id) => {
      router.push(`/app/complaints/${id}`);
    };

    const editComplaint = (id) => {
      console.log('Editar denuncia:', id);
    };

    return {
      searchTerm,
      statusFilter,
      complaints,
      filteredComplaints,
      getStatusText,
      addComplaint,
      viewComplaint,
      editComplaint
    };
  }
};
</script>

<style lang="scss" scoped>
.complaint-list-page {
  .page-header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
    }
  }

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 200px;
    }

    .filter-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 150px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.3s ease;

      &:hover {
        background: #0056b3;
      }
    }
  }

  .complaints-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .complaint-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #ddd;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    &.pending {
      border-left-color: #ffc107;
    }

    &.in-progress {
      border-left-color: #007bff;
    }

    &.resolved {
      border-left-color: #28a745;
    }

    &.closed {
      border-left-color: #6c757d;
    }

    .complaint-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }

    .complaint-info {
      margin-bottom: 1rem;

      p {
        margin: 0.5rem 0;
        color: #666;
        font-size: 0.9rem;

        &.complaint-description {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
          font-style: italic;
        }
      }
    }

    .complaint-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;

    &.pending {
      background: #fff3cd;
      color: #856404;
    }

    &.in-progress {
      background: #d1ecf1;
      color: #0c5460;
    }

    &.resolved {
      background: #d4edda;
      color: #155724;
    }

    &.closed {
      background: #e2e3e5;
      color: #383d41;
    }
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: #545b62;
    }
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    .complaints-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
