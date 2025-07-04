<template>
  <div class="summary-cards-grid">
    <div class="card-item">
      <div class="card-icon gateways">
        <span class="icon">📡</span>
      </div>
      <div class="card-content">
        <div class="card-title">Gateways</div>
        <div class="card-stats">
          <div class="stat-main">
            <span class="stat-value">{{ summaryCards.gateways.active }}</span>
            <span class="stat-label">Activos</span>
          </div>
          <div class="stat-secondary">
            <span class="stat-value">{{ summaryCards.gateways.inactive }}</span>
            <span class="stat-label">Inactivos</span>
          </div>
        </div>
        <div class="card-trend positive">
          <span class="icon">📈</span>
          <span>{{ gatewayHealthRate }}% operativos</span>
        </div>
      </div>
    </div>

    <div class="card-item">
      <div class="card-icon meters">
        <span class="icon">📊</span>
      </div>
      <div class="card-content">
        <div class="card-title">Medidores</div>
        <div class="card-stats">
          <div class="stat-main">
            <span class="stat-value">{{ summaryCards.meters.total }}</span>
            <span class="stat-label">Totales</span>
          </div>
          <div class="stat-secondary">
            <span class="stat-value">{{ summaryCards.meters.newToday }}</span>
            <span class="stat-label">Nuevos hoy</span>
          </div>
        </div>
        <div class="card-trend warning">
          <span class="icon">⚠️</span>
          <span>{{ summaryCards.meters.failed }} con fallas</span>
        </div>
      </div>
    </div>

    <div class="card-item">
      <div class="card-icon users">
        <span class="icon">👥</span>
      </div>
      <div class="card-content">
        <div class="card-title">Usuarios</div>
        <div class="card-stats">
          <div class="stat-main">
            <span class="stat-value">{{ formatNumber(summaryCards.users.registered) }}</span>
            <span class="stat-label">Registrados</span>
          </div>
          <div class="stat-secondary">
            <span class="stat-value">{{ summaryCards.users.newThisMonth }}</span>
            <span class="stat-label">Nuevos este mes</span>
          </div>
        </div>
        <div class="card-trend positive">
          <span class="icon">📈</span>
          <span>+4.6% crecimiento</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'SummaryCardsGrid',
  props: {
    summaryCards: {
      type: Object,
      required: true,
      default: () => ({
        gateways: { active: 0, inactive: 0 },
        meters: { total: 0, newToday: 0, failed: 0, newYesterday: 0 },
        users: { registered: 0, newThisMonth: 0 }
      })
    },
    financialSummary: {
      type: Object,
      required: false,
      default: () => ({
        totalRevenue: 0,
        monthlyRevenue: 0,
        efficiencyRate: 0,
        waterSavings: 0
      })
    }
  },
  setup(props) {
    const gatewayHealthRate = computed(() => {
      const total = props.summaryCards.gateways.active + props.summaryCards.gateways.inactive
      return total > 0 ? Math.round((props.summaryCards.gateways.active / total) * 100) : 0
    })

    const formatNumber = (value) => {
      return new Intl.NumberFormat('es-EC').format(value)
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }

    return {
      gatewayHealthRate,
      formatNumber,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.summary-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s ease;
}

.card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.card-icon.gateways {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-icon.meters {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.card-icon.users {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}

.stat-main, .stat-secondary {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-secondary .stat-value {
  font-size: 1.1rem;
  color: #4b5563;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.25rem;
}

.card-trend {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-trend.positive {
  color: #059669;
}

.card-trend.warning {
  color: #f59e0b;
}

.card-trend.negative {
  color: #dc2626;
}

.card-trend .icon {
  font-size: 0.8em;
}

@media (max-width: 768px) {
  .summary-cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card-item {
    padding: 1rem;
  }
  
  .card-stats {
    gap: 1rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-secondary .stat-value {
    font-size: 1rem;
  }
}
</style> 