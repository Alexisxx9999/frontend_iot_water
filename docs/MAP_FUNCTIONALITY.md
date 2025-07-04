# Funcionalidad de Visualización Territorial - Mapa

## Descripción General

La página de mapa proporciona una visualización interactiva del consumo hídrico por zonas administrativas y parroquias, permitiendo el análisis territorial del sistema de agua.

## Características Implementadas

### RF5.1: Mapa Interactivo ✅
- Visualización de zonas administrativas con marcadores interactivos
- Colores diferenciados por rango de consumo
- Información detallada al hacer clic en cada zona

### RF5.2: Filtros de Ubicación ✅
- Filtro por Administración Zonal
- Filtro por Tipo de Parroquia (Urbana, Rural, Mixta)
- Filtros combinables para análisis específicos

### RF5.3: Filtros de Tiempo y Consumo ✅
- Selección de período de tiempo (1, 3, 6, 12 meses)
- Filtro por rango de consumo (Bajo, Medio, Alto, Muy Alto)
- Actualización en tiempo real de los datos

### RF5.4: Leyenda de Consumo ✅
- Leyenda visual con códigos de color
- Rangos claramente definidos:
  - Verde: Bajo (0-100 m³)
  - Amarillo: Medio (100-500 m³)
  - Amarillo claro: Alto (500-1000 m³)
  - Rojo: Muy Alto (>1000 m³)

### RF5.5: Información de Zona Seleccionada ✅
- Popup detallado con información de la zona
- Consumo actual y variación mensual
- Número de parroquias asociadas
- Tipo de zona y estado

### RF5.6: Resumen General ✅
- Métricas principales en el header:
  - Consumo total del sistema
  - Variación mensual promedio
  - Número de zonas activas
  - Total de parroquias

### RF5.7: Gráficos de Consumo ✅
- **Gráfico de barras**: Consumo por Administración Zonal
- **Gráfico de líneas**: Variación temporal mensual
- **Gráfico de pastel**: Distribución por tipo de parroquia
- **Panel de resumen**: Lista detallada de zonas con métricas

### RF5.8: Exportar Datos ✅
- Botón de exportación en formato JSON
- Incluye datos filtrados, resumen y configuración
- Nombre de archivo con fecha automática

## Arquitectura Técnica

### Componentes
- `MapPage.vue`: Componente principal de la página
- `map.service.js`: Servicio para manejo de datos del mapa
- `map.js` (store): Estado global con Pinia

### Tecnologías Utilizadas
- **Vue 3** con Composition API
- **Pinia** para manejo de estado
- **Chart.js** para gráficos interactivos
- **SCSS** para estilos con glassmorphism
- **FontAwesome** para iconografía

### Estructura de Datos

#### Zona Administrativa
```javascript
{
  id: number,
  name: string,
  type: 'urbana' | 'rural' | 'mixta',
  consumption: number, // m³
  variation: number, // porcentaje
  status: 'online' | 'offline' | 'alert',
  parishes: string[],
  coordinates: [number, number],
  color: string
}
```

#### Filtros
```javascript
{
  zone: string,
  parishType: string,
  period: string,
  consumptionRange: string
}
```

## Funcionalidades Avanzadas

### Estado Reactivo
- Filtros que se actualizan en tiempo real
- Gráficos que se regeneran automáticamente
- Mapa que se actualiza según los filtros aplicados

### Manejo de Errores
- Indicador de carga durante las operaciones
- Mensajes de error con opción de reintento
- Fallback a datos simulados en desarrollo

### Responsive Design
- Adaptación a diferentes tamaños de pantalla
- Layout flexible para móviles y tablets
- Gráficos responsivos

## API Endpoints (Backend)

### Endpoints Principales
- `GET /administraciones-zonales` - Lista de zonas
- `GET /parroquias` - Lista de parroquias
- `GET /resumen-consumo-historico` - Historial de consumo
- `GET /variacion-temporal` - Datos temporales
- `GET /distribucion-parroquias` - Distribución por parroquia
- `POST /exportar-mapa` - Exportación de datos

### Parámetros de Filtrado
- `zona_id`: ID de la zona específica
- `periodo`: Período de tiempo (1, 3, 6, 12)
- `tipo_parroquia`: Tipo de parroquia
- `rango_consumo`: Rango de consumo

## Personalización

### Colores y Temas
Los colores se pueden personalizar en `src/assets/styles/_map.scss`:
- Variables de colores principales
- Gradientes y sombras
- Colores de estados y rangos

### Configuración de Gráficos
Los gráficos se configuran en el componente `MapPage.vue`:
- Tipos de gráficos (bar, line, doughnut)
- Colores y estilos
- Opciones de responsividad

## Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Integración con Leaflet para mapa real
- [ ] Filtros avanzados por fecha
- [ ] Comparación entre períodos
- [ ] Alertas automáticas de consumo
- [ ] Exportación en múltiples formatos (CSV, Excel)
- [ ] Modo offline con datos cacheados

### Optimizaciones
- [ ] Lazy loading de datos
- [ ] Virtualización de listas grandes
- [ ] Caché de gráficos
- [ ] Compresión de datos

## Uso

### Navegación
1. Acceder a la página de mapa desde el menú principal
2. Los datos se cargan automáticamente al montar el componente
3. Usar los filtros en el sidebar para refinar la visualización
4. Hacer clic en las zonas del mapa para ver detalles
5. Exportar datos usando el botón correspondiente

### Filtros
- **Zona**: Seleccionar una zona específica o ver todas
- **Tipo de Parroquia**: Filtrar por urbana, rural o mixta
- **Período**: Seleccionar el rango de tiempo
- **Consumo**: Filtrar por rango de consumo

### Interacción
- **Hover**: Efectos visuales en marcadores y gráficos
- **Click**: Abrir popup con información detallada
- **Filtros**: Actualización automática de visualizaciones
- **Exportar**: Descarga de datos en formato JSON 