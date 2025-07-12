<template>
  <div class="complaints-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="icon">📋</span>
          Denuncias Ciudadanas
        </h1>
        <p class="page-subtitle">
          Gestión de denuncias y reportes ciudadanos
        </p>
      </div>
    </div>

    <div class="page-content">
      <section class="content-section">
        <h2 class="section-title">
          <span class="icon">📊</span>
          Lista de Denuncias
        </h2>
        <div class="content-placeholder">
          <p>Contenido de denuncias ciudadanas en desarrollo...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplaintListPage',
  setup() {
    return {}
  }
}
</script>

<style scoped>
.complaints-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
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

.page-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-section {
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
  .complaints-page {
    padding: 1rem;
  }
}
</style>
