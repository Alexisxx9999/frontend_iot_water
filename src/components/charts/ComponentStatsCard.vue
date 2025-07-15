<template>
  <div class="component-stats-card">
    <div class="card-header">
      <h3 class="card-title">
        <span class="icon">🔧</span>
        Estadísticas de Componentes
      </h3>
    </div>
    
    <div class="stats-container">
      <div class="stat-section">
        <h4 class="section-title">Válvulas</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon active">
              <span class="icon">🔘</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ componentStats.activeValves }}</div>
              <div class="stat-label">Activas</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon failed">
              <span class="icon">⚠️</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ componentStats.failedValves }}</div>
              <div class="stat-label">Con Fallas</div>
            </div>
          </div>
        </div>
        
        <div class="health-indicator">
          <div class="health-bar">
            <div 
              class="health-fill" 
              :style="{ width: valveHealthRate + '%' }"
              :class="{ 'good': valveHealthRate >= 90, 'warning': valveHealthRate >= 70 && valveHealthRate < 90, 'critical': valveHealthRate < 70 }"
            ></div>
          </div>
          <span class="health-text">{{ valveHealthRate.toFixed(1) }}% Salud</span>
        </div>
      </div>
      
      <div class="stat-section">
        <h4 class="section-title">Dispositivos</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon total">
              <span class="icon">💻</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ componentStats.totalDevices }}</div>
              <div class="stat-label">Totales</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon active">
              <span class="icon">✅</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ componentStats.activeDevices }}</div>
              <div class="stat-label">Activos</div>
            </div>
          </div>
        </div>
        
        <div class="health-indicator">
          <div class="health-bar">
            <div 
              class="health-fill" 
              :style="{ width: deviceHealthRate + '%' }"
              :class="{ 'good': deviceHealthRate >= 90, 'warning': deviceHealthRate >= 70 && deviceHealthRate < 90, 'critical': deviceHealthRate < 70 }"
            ></div>
          </div>
          <span class="health-text">{{ deviceHealthRate.toFixed(1) }}% Salud</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentStatsCard',
  props: {
    componentStats: {
      type: Object,
      required: true,
      default: () => ({
        activeValves: 0,
        failedValves: 0,
        totalDevices: 0,
        activeDevices: 0
      })
    },
    valveHealthRate: {
      type: Number,
      default: 0
    },
    deviceHealthRate: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.component-stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.5rem;
  font-size: 1.1em;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stat-section {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
}

.stat-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 1rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.stat-icon.active {
  background: #dcfce7;
  color: #059669;
}

.stat-icon.failed {
  background: #fef2f2;
  color: #dc2626;
}

.stat-icon.total {
  background: #dbeafe;
  color: #2563eb;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 0.25rem;
}

.health-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.health-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.health-fill.good {
  background: #059669;
}

.health-fill.warning {
  background: #f59e0b;
}

.health-fill.critical {
  background: #dc2626;
}

.health-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  min-width: 60px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
}
</style> 