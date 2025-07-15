<template>
  <div class="dashboard-overview">
    <div class="dashboard-main-panel">
      <div class="header-content">
        <h1 class="dashboard-title">
          <span class="icon">📊</span>
          Dashboard
        </h1>
        <p class="dashboard-subtitle">
          Panel de control principal
        </p>
      </div>
      <!-- Bloques visuales de métricas principales -->
      <div class="dashboard-cards-grid">
        <div class="dashboard-card">
          <div class="card-icon" style="background:#667eea;">💧</div>
          <div class="card-info">
            <div class="card-title">Consumo</div>
            <div class="card-value">3,500 m³</div>
          </div>
        </div>
        <div class="dashboard-card">
          <div class="card-icon" style="background:#48bb78;">👤</div>
          <div class="card-info">
            <div class="card-title">Usuarios</div>
            <div class="card-value">1,250</div>
          </div>
        </div>
        <div class="dashboard-card">
          <div class="card-icon" style="background:#f6ad55;">🔌</div>
          <div class="card-info">
            <div class="card-title">Dispositivos</div>
            <div class="card-value">320</div>
          </div>
        </div>
        <div class="dashboard-card">
          <div class="card-icon" style="background:#e53e3e;">⚠️</div>
          <div class="card-info">
            <div class="card-title">Alertas</div>
            <div class="card-value">8</div>
          </div>
        </div>
      </div>
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">📈</span>
          Resumen del Sistema
        </h2>
        <!-- Bloque de fondo gris para las gráficas -->
        <div class="charts-gray-block">
          <div class="dashboard-charts-flex">
            <div class="chart-item">
              <Doughnut :data="doughnutData" :options="doughnutOptions" />
              <div class="chart-label">
                <strong>Consumo:</strong> 3500 m³<br/>
                <span>Capacidad restante: 1500 m³</span>
              </div>
            </div>
            <div class="chart-item">
              <Bar :data="barData" :options="barOptions" />
              <div class="chart-label">
                <strong>Consumo esperado:</strong> {{ randomBarValue }} m³<br/>
                <span>Mes actual</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

export default {
  name: 'DashboardOverview',
  components: { Doughnut, Bar },
  setup() {
    const doughnutData = {
      labels: ['Consumo', 'Capacidad restante'],
      datasets: [
        {
          data: [3500, 1500],
          backgroundColor: ['#38bdf8', '#e2e8f0'],
          borderColor: ['#0ea5e9', '#cbd5e1'],
          borderWidth: 2,
          hoverBackgroundColor: ['#0ea5e9', '#94a3b8'],
        },
      ],
    }
    const doughnutOptions = {
      cutout: '70%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#38bdf8',
            font: { family: 'Poppins', size: 13 }
          }
        },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#0ea5e9',
          bodyColor: '#23272f',
          borderColor: '#38bdf8',
          borderWidth: 1,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: '#fff',
    }
    // Valor aleatorio para el consumo esperado
    const randomBarValue = Math.floor(Math.random() * 2000) + 3000 // entre 3000 y 5000
    // Datos para la gráfica de barras
    const barData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Consumo esperado (m³)',
          data: [3200, 3400, 3600, 3800, 4000, 3900, randomBarValue],
          backgroundColor: '#38bdf8',
          borderColor: '#0ea5e9',
          borderWidth: 2,
          borderRadius: 8,
          maxBarThickness: 40,
          hoverBackgroundColor: '#0ea5e9',
          barPercentage: 0.7,
        },
      ],
    }
    const barOptions = {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#0ea5e9',
          bodyColor: '#23272f',
          borderColor: '#38bdf8',
          borderWidth: 1,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#38bdf8', font: { family: 'Poppins', size: 13 } },
          backgroundColor: '#fff',
        },
        y: {
          grid: { color: '#e2e8f0' },
          ticks: { color: '#64748b', font: { family: 'Fira Mono', size: 13 } },
          backgroundColor: '#fff',
          beginAtZero: true,
          suggestedMax: 5000,
        },
      },
      backgroundColor: '#fff',
    }
    return { doughnutData, doughnutOptions, barData, barOptions, randomBarValue }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Roboto:wght@400&family=Fira+Mono:wght@500&display=swap');
</style>

<style scoped>
.dashboard-overview {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Roboto', Arial, sans-serif;
  background: #f3f4f6;
  min-height: 100vh;
}

.dashboard-main-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(102, 126, 234, 0.10);
  border: 2.5px solid #667eea22;
  padding: 2.2rem 2.5rem 2.5rem 2.5rem;
  margin-bottom: 2.5rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.header-content h1 {
  margin: 0;
  color: #3b3663;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-family: 'Poppins', Arial, sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #667eea22;
}

.header-content p {
  margin: 0.15rem 0 0 0;
  color: #667eea;
  font-size: 1.08rem;
  font-family: 'Roboto', Arial, sans-serif;
  font-weight: 500;
}

/* Elimina dashboard-content, ya no es necesario */

.dashboard-section {
  background: #fff;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 4px 24px 0 rgba(102, 126, 234, 0.08);
  border: 2px solid #667eea18;
}

.section-title {
  margin: 0 0 1.2rem 0;
  color: #3b3663;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-family: 'Poppins', Arial, sans-serif;
  letter-spacing: 0.5px;
}

.content-placeholder {
  padding: 2rem;
  text-align: center;
  color: #667eea;
  background: #f1f5ff;
  border-radius: 10px;
  border: 2px dashed #667eea44;
  font-family: 'Roboto', Arial, sans-serif;
}

.content-placeholder p {
  margin: 0;
  font-size: 1.15rem;
}

/* Grid de cards del dashboard mejorado responsive */
.dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

@media (max-width: 900px) {
  .dashboard-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .dashboard-cards-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
}

.dashboard-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px 0 rgba(102, 126, 234, 0.10);
  display: flex;
  align-items: center;
  padding: 1.2rem 1rem;
  transition: transform 0.15s, box-shadow 0.15s, background 0.18s;
  cursor: pointer;
  border: 2px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  min-width: 0;
}
.dashboard-card:hover {
  background: linear-gradient(135deg, #667eea 0%, #5eead4 100%);
  box-shadow: 0 8px 32px 0 rgba(102, 126, 234, 0.18);
  border-color: #38bdf8;
}
.dashboard-card:hover .card-title,
.dashboard-card:hover .card-value {
  color: #fff;
  text-shadow: 0 2px 8px #38bdf8cc;
}
.dashboard-card:hover .card-icon {
  background: rgba(255,255,255,0.12);
  border-color: #fff;
}
.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #38bdf8;
  margin-right: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  background: #f3f4f6;
  border: 2px solid #e2e8f0;
}
.card-info {
  flex: 1;
  min-width: 0;
}
.card-title {
  font-size: 1rem;
  color: #38bdf8;
  margin-bottom: 0.2rem;
  font-family: 'Poppins', Arial, sans-serif;
  letter-spacing: 0.5px;
  white-space: normal;
  word-break: break-word;
}
.card-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #23272f;
  font-family: 'Fira Mono', monospace;
  white-space: normal;
  word-break: break-word;
}

.dashboard-charts-flex {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  margin-top: 1.5rem;
}
@media (max-width: 900px) {
  .dashboard-charts-flex {
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard-overview {
    padding: 1rem;
  }
  
  .dashboard-main-panel {
    padding: 1rem;
  }
}
.charts-gray-block {
  background: #f3f4f6;
  border-radius: 14px;
  padding: 2.5rem 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px #64748b11;
}
.dashboard-charts-flex {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: space-between;
  gap: 2.5rem;
}
.chart-item {
  flex: 1 1 0;
  min-width: 260px;
  max-width: 480px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #64748b11;
  padding: 1.2rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 320px;
  max-height: 320px;
  overflow: hidden;
  padding-bottom: 2.2rem;
}
.chart-item :deep(canvas), .chart-item canvas {
  height: 260px !important;
  max-height: 260px !important;
  width: 100% !important;
  display: block;
}
.chart-label {
  text-align: center;
  margin-top: 1rem;
  color: #64748b;
  font-size: 1rem;
}
.chart-label strong {
  color: #23272f;
  font-size: 1.1rem;
}
.chart-label span {
  color: #7f8c8d;
  font-size: 0.95rem;
}
@media (max-width: 900px) {
  .dashboard-charts-flex {
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }
  .chart-item {
    max-width: 100%;
    width: 100%;
  }
}
</style>
