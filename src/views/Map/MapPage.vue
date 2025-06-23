<template>
  <div class="map-page">
    <div class="page-header">
      <h1>Mapa</h1>
      <p>Visualización geográfica de dispositivos y eventos</p>
    </div>

    <div class="map-container">
      <div class="map-controls">
        <button class="btn-primary">📍 Mi Ubicación</button>
        <button class="btn-secondary">🔍 Buscar</button>
        <button class="btn-secondary">📊 Filtros</button>
      </div>

      <div class="map-placeholder">
        <div class="map-content">
          <div class="map-icon">🗺️</div>
          <h3>Mapa Interactivo</h3>
          <p>Aquí se mostrará el mapa con dispositivos IoT</p>
          <p class="map-note">Se implementará con Leaflet o Google Maps</p>
        </div>
      </div>

      <div class="map-legend">
        <div class="legend-item">
          <span class="legend-icon online">●</span>
          <span>Dispositivos en línea</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon offline">●</span>
          <span>Dispositivos desconectados</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon alert">●</span>
          <span>Alertas activas</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapPage'
}
</script>

<style lang="scss" scoped>
.map-page {
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

  .map-container {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .map-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background: #0056b3;
      }
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background: #545b62;
      }
    }
  }

  .map-placeholder {
    height: 500px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px dashed #ddd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .map-content {
    text-align: center;
    color: #666;

    .map-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }

    p {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .map-note {
      font-size: 0.9rem;
      color: #999;
      font-style: italic;
    }
  }

  .map-legend {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;

      .legend-icon {
        font-size: 1.2rem;

        &.online {
          color: #28a745;
        }

        &.offline {
          color: #dc3545;
        }

        &.alert {
          color: #ffc107;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .map-controls {
      flex-direction: column;
    }

    .map-legend {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>
