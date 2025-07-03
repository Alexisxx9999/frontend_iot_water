# Módulo de Gestión Territorial y Geográfica

## Descripción General

El módulo de gestión territorial y geográfica proporciona una visualización completa del consumo hídrico por zonas administrativas y parroquias. Permite monitorear en tiempo real el consumo de agua, analizar tendencias históricas y gestionar medidores IoT en el mapa.

## Características Principales

### ✅ Funcionalidades Implementadas

#### 1. **Mapa Interactivo**
- ✅ Visualización de zonas administrativas y parroquias
- ✅ Leyenda de colores para rangos de consumo
- ✅ Estadísticas en tiempo real del mapa
- ✅ Placeholder preparado para integración con mapas reales

#### 2. **Filtros Avanzados**
- ✅ Filtro por Administración Zonal
- ✅ Filtro por Tipo de Parroquia (Urbana, Rural, Mixta)
- ✅ Filtro por Período de Tiempo (Último mes, 3 meses, año, personalizado)
- ✅ Filtro por Rango de Consumo (Bajo, Medio, Alto, Muy Alto)
- ✅ Fechas personalizadas para análisis específicos

#### 3. **Gráficos y Estadísticas**
- ✅ Gráfico de barras: Consumo por Administración Zonal
- ✅ Gráfico de líneas: Variación Temporal del Consumo
- ✅ Gráfico de distribución: Consumo por Tipo de Parroquia
- ✅ Resumen general con métricas clave

#### 4. **Gestión de Medidores**
- ✅ Agregar nuevos medidores al mapa
- ✅ Editar medidores existentes
- ✅ Eliminar medidores con confirmación
- ✅ Visualización de estado de medidores
- ✅ Información detallada de ubicación

#### 5. **Información de Zonas**
- ✅ Detalles de zona seleccionada
- ✅ Consumo y variación por zona
- ✅ Parroquias asociadas
- ✅ Medidores en la zona

#### 6. **Exportación de Datos**
- ✅ Exportar datos filtrados en Excel
- ✅ Exportar datos filtrados en CSV
- ✅ Descarga automática de archivos

## Estructura de Archivos

```
src/
├── services/
│   └── map.service.js              # Servicio principal del mapa
├── stores/
│   └── map.js                      # Store Pinia para estado global
├── components/map/
│   ├── MapMeterModal.vue           # Modal crear/editar medidor
│   ├── DeleteMeterModal.vue        # Modal confirmación eliminación
│   └── MapConsumptionChart.vue     # Componente de gráfico de consumo
├── views/Map/
│   └── MapPage.vue                 # Vista principal del mapa
└── utils/
    └── mockData.js                 # Datos mock para desarrollo
```

## Rangos de Consumo

| Rango | Porcentaje | Color | Descripción |
|-------|------------|-------|-------------|
| **Bajo** | 0-25% | Verde (#4CAF50) | Consumo bajo, eficiente |
| **Medio** | 25-50% | Amarillo (#FFC107) | Consumo moderado |
| **Alto** | 50-75% | Naranja (#FF9800) | Consumo alto, requiere atención |
| **Muy Alto** | 75-100% | Rojo (#F44336) | Consumo crítico, acción inmediata |

## Tipos de Parroquia

### 🏙️ Urbana
- **Características**: Zonas densamente pobladas
- **Consumo típico**: Alto a muy alto
- **Gestión**: Monitoreo intensivo

### 🌾 Rural
- **Características**: Zonas agrícolas y dispersas
- **Consumo típico**: Bajo a medio
- **Gestión**: Monitoreo básico

### 🏘️ Mixta
- **Características**: Combinación urbana-rural
- **Consumo típico**: Variable
- **Gestión**: Monitoreo adaptativo

## Períodos de Tiempo

| Período | Descripción | Uso |
|---------|-------------|-----|
| **Último mes** | Últimos 30 días | Análisis mensual |
| **Últimos 3 meses** | Últimos 90 días | Análisis trimestral |
| **Último año** | Últimos 365 días | Análisis anual |
| **Personalizado** | Fechas específicas | Análisis detallado |

## API Endpoints

### Geografía Política
```
GET    /map/zonal-administrations    # Listar administraciones zonales
GET    /map/parishes                 # Listar parroquias (con filtros)
GET    /map/geographic-data          # Datos geográficos completos
```

### Consumo Histórico
```
GET    /map/consumption-history      # Historial de consumo (con filtros)
GET    /map/consumption-summary      # Resumen de consumo
GET    /map/consumption/zone/:id     # Consumo por zona específica
```

### Datos del Mapa
```
GET    /map/data                     # Datos completos del mapa
GET    /map/zone/:id                 # Detalles de zona específica
```

### Gráficos y Estadísticas
```
GET    /map/stats/consumption-by-zonal      # Consumo por administración zonal
GET    /map/stats/temporal-variation        # Variación temporal
GET    /map/stats/distribution-by-parish    # Distribución por parroquia
```

### Gestión de Medidores
```
GET    /map/meters                   # Listar medidores en el mapa
POST   /map/meters                   # Agregar medidor al mapa
PUT    /map/meters/:id               # Actualizar medidor
DELETE /map/meters/:id               # Eliminar medidor
```

### Exportación
```
GET    /map/export                   # Exportar datos (Excel/CSV)
```

## Mock Data

El módulo incluye datos mock completos para desarrollo:

### Administraciones Zonales
- **4 administraciones zonales** con diferentes códigos
- **Datos realistas** de parroquias por zona

### Parroquias
- **8 parroquias** con diferentes tipos y consumos
- **Distribución equilibrada** entre urbana, rural y mixta

### Medidores
- **4 medidores** con diferentes estados y ubicaciones
- **Coordenadas reales** de Quito, Ecuador

### Datos de Consumo
- **Historial mensual** de los últimos 4 meses
- **Variaciones realistas** entre períodos

## Uso del Módulo

### 1. Acceso al Módulo
```
Navegación: Menú Principal → Mapa
URL: /app/map
```

### 2. Filtros de Visualización
- **Filtros superiores** para refinar la vista
- **Aplicación automática** al cambiar filtros
- **Botón "Limpiar Filtros"** para resetear

### 3. Mapa Interactivo
- **Vista principal** con placeholder del mapa
- **Leyenda de colores** para rangos de consumo
- **Estadísticas en tiempo real** del área visible

### 4. Gráficos de Análisis
- **3 gráficos principales** con diferentes perspectivas
- **Datos actualizados** según filtros aplicados
- **Responsive design** para diferentes pantallas

### 5. Panel de Información
- **Resumen general** con métricas clave
- **Detalles de zona** al seleccionar área
- **Lista de medidores** con acciones rápidas

### 6. Gestión de Medidores
- **Botón "Agregar Medidor"** en header
- **Acciones por medidor**: Editar, Eliminar
- **Modales completos** con validaciones

### 7. Exportación
- **Botón "Exportar Datos"** en header
- **Formato Excel/CSV** según preferencia
- **Datos filtrados** según configuración actual

## Validaciones

### Campos Obligatorios para Medidores
- Número de Serie
- Modelo
- Fabricante
- Parroquia
- Coordenadas (Latitud/Longitud)
- Frecuencia de Reporte
- Umbral de Alerta
- Estado

### Validaciones Específicas
- **Número de Serie**: Único en el sistema
- **Coordenadas**: Formato válido (-90 a 90 lat, -180 a 180 lng)
- **Frecuencia de Reporte**: Mínimo 1 minuto
- **Umbral de Alerta**: Entre 0 y 100%
- **Configuración JSON**: Formato válido (opcional)

### Confirmación de Eliminación
- **Texto "ELIMINAR"** requerido para confirmar
- **Advertencias** sobre consecuencias
- **Información del medidor** antes de eliminar

## Estados de Carga

### Loading States
- **Carga inicial**: Spinner en el mapa
- **Filtros**: Indicador de búsqueda
- **Modales**: Botones con estado de carga
- **Exportación**: Indicador de descarga

### Error States
- **Errores de red**: Mensajes descriptivos
- **Validaciones**: Campos con bordes rojos
- **Confirmaciones**: Modales de error
- **Fallbacks**: Estados por defecto

## Responsive Design

### Mobile First
- **Layout adaptativo** con grid responsive
- **Filtros apilados** en móviles
- **Gráficos optimizados** para pantallas pequeñas
- **Modales adaptados** a táctil

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1200px
- **Desktop**: > 1200px

## Integración con Backend

### Preparado para Producción
- **Servicios configurados** para APIs reales
- **Mock data** fácilmente removible
- **Estructura de datos** compatible con backend
- **Manejo de errores** robusto

### Endpoints Esperados
```javascript
// Ejemplo de respuesta esperada para consumo
{
  "data": [...],
  "summary": {
    "totalConsumption": 322.9,
    "monthlyVariation": 5.2,
    "averageConsumption": 40.4
  },
  "filters": {...}
}
```

## Próximas Mejoras

### Funcionalidades Futuras
- [ ] **Mapa real** con Leaflet/Mapbox/Google Maps
- [ ] **Marcadores interactivos** para medidores
- [ ] **Polígonos de zonas** con colores por consumo
- [ ] **Clusters** para agrupar medidores cercanos
- [ ] **Heatmap** de consumo por área
- [ ] **Notificaciones push** para alertas críticas
- [ ] **Reportes avanzados** con PDF
- [ ] **Machine Learning** para predicción de consumo
- [ ] **API REST** completa con autenticación
- [ ] **WebSockets** para actualizaciones en tiempo real

### Optimizaciones
- [ ] **Lazy loading** de componentes pesados
- [ ] **Caching** de datos geográficos
- [ ] **Virtual scrolling** para listas grandes
- [ ] **Offline mode** con sincronización
- [ ] **Progressive Web App** (PWA)
- [ ] **Service Workers** para cache inteligente

## Integración con Mapa Real

### Preparación para Mapas
```javascript
// Ejemplo de integración con Leaflet
import L from 'leaflet'

// Inicializar mapa
const map = L.map('map-container').setView([-0.2299, -78.5249], 12)

// Agregar capa de tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

// Agregar marcadores de medidores
meters.forEach(meter => {
  const marker = L.marker(meter.coordinates)
    .bindPopup(`Medidor: ${meter.serialNumber}`)
    .addTo(map)
})

// Agregar polígonos de zonas
zones.forEach(zone => {
  const polygon = L.polygon(zone.coordinates, {
    color: getConsumptionColor(zone.consumption),
    fillOpacity: 0.6
  }).addTo(map)
})
```

## Troubleshooting

### Problemas Comunes

#### 1. **Mapa no se carga**
- Verificar conexión de red
- Comprobar permisos de ubicación
- Revisar consola para errores de API

#### 2. **Filtros no funcionan**
- Verificar que los datos estén cargados
- Comprobar que los filtros se apliquen correctamente
- Revisar estado del store

#### 3. **Medidores no aparecen**
- Verificar filtros aplicados
- Comprobar estado de los medidores
- Revisar permisos de usuario

#### 4. **Exportación falla**
- Verificar permisos de descarga
- Comprobar formato de archivo
- Revisar tamaño de datos

#### 5. **Gráficos no se actualizan**
- Verificar que los datos cambien
- Comprobar reactividad de Vue
- Revisar computed properties

## Soporte Técnico

### Documentación Adicional
- **API Documentation**: Swagger/OpenAPI
- **Component Library**: Storybook
- **Testing**: Jest + Vue Test Utils
- **Deployment**: Docker + CI/CD

### Contacto
- **Desarrollador**: Equipo de Desarrollo IoT
- **Email**: dev@iotwater.com
- **Slack**: #iot-map
- **Jira**: Proyecto IOT-MAP

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2024  
**Estado**: ✅ Completado y funcional 