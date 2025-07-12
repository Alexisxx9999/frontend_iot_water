<template>
  <div class="dashboard-overview">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">
          <span class="icon">📊</span>
          Dashboard
        </h1>
        <p class="dashboard-subtitle">
          Panel de control principal
        </p>
      </div>
    </div>

    <!-- Contenido principal del dashboard -->
    <div class="dashboard-content">
      <section class="dashboard-section">
        <h2 class="section-title">
          <span class="icon">📈</span>
          Resumen del Sistema
        </h2>
        <div class="content-placeholder">
          <p>Contenido del dashboard en desarrollo...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardOverview',
  setup() {
    return {}
  }
}
</script>

<style scoped>
.dashboard-overview {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-content p {
  margin: 0.5rem 0 0 0;
  color: #7f8c8d;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.content-placeholder {
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.content-placeholder p {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .dashboard-overview {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
