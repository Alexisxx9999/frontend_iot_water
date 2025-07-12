# Módulo de Sectores

## Descripción
El módulo de Sectores permite gestionar los sectores de la ciudad con sus códigos postales y descripciones. Este módulo incluye funcionalidades CRUD completas con validaciones y un diseño moderno.

## Características

### Funcionalidades Principales
- **Lista de Sectores**: Vista con tabla paginada, búsqueda y filtros
- **Crear Sector**: Formulario validado para crear nuevos sectores
- **Editar Sector**: Formulario para modificar sectores existentes
- **Eliminar Sector**: Confirmación modal para eliminar sectores

### Campos del Sector
- **nombreSector**: Nombre del sector (requerido, 3-100 caracteres)
- **codigoPostalSector**: Código postal (requerido, 6 dígitos)
- **descripcionSector**: Descripción del sector (requerido, 10-500 caracteres)
- **estado**: Estado del sector (activo/inactivo)

## Estructura de Archivos

### Servicios
```
src/services/sectors.service.js
```
- Manejo de datos simulados
- Operaciones CRUD
- Validaciones de negocio
- Simulación de delays de red

### Store (Pinia)
```
src/stores/sectors.js
```
- Estado global del módulo
- Acciones para operaciones CRUD
- Manejo de errores y loading

### Vistas
```
src/views/Sectors/
├── SectorListPage.vue      # Lista de sectores
├── SectorCreatePage.vue    # Crear sector
└── SectorEditPage.vue      # Editar sector
```

### Rutas
```javascript
// Rutas agregadas en src/router/index.js
{ path: 'sectors', component: SectorListPage },
{ path: 'sectors/create', component: SectorCreatePage },
{ path: 'sectors/edit/:id', component: SectorEditPage }
```

## Validaciones

### Validaciones de Formulario
- **Nombre del Sector**: Requerido, mínimo 3 caracteres, máximo 100
- **Código Postal**: Requerido, exactamente 6 dígitos numéricos
- **Descripción**: Requerido, mínimo 10 caracteres, máximo 500

### Validaciones de Negocio
- Código postal único por sector
- Validación de existencia al editar
- Validación de existencia al eliminar

## Diseño y UX

### Características de Diseño
- Diseño responsive y moderno
- Gradientes y sombras para profundidad
- Iconografía consistente con FontAwesome
- Estados de loading y error
- Modales de confirmación

### Componentes de UI
- Tabla con paginación
- Formularios con validación en tiempo real
- Modales de confirmación
- Notificaciones toast
- Estados de carga y error

## Navegación

### Menú Lateral
El módulo está integrado en el menú lateral con:
- Icono: Mapa
- Ruta: `/app/sectors`
- Título: "Sectores"

## Alertas y Notificaciones

### Tipos de Alertas
- **Éxito**: Operaciones completadas correctamente
- **Error**: Errores de validación o servidor
- **Advertencia**: Confirmaciones de eliminación
- **Info**: Información general

### Implementación
- Uso del composable `useToast`
- Notificaciones automáticas
- Modales de confirmación para acciones destructivas

## Datos de Ejemplo

### Sectores Predefinidos
```javascript
[
  {
    id: 1,
    nombreSector: 'Centro Histórico',
    codigoPostalSector: '170101',
    descripcionSector: 'Sector céntrico de la ciudad con alta densidad poblacional y comercio tradicional',
    estado: 'active'
  },
  {
    id: 2,
    nombreSector: 'La Mariscal',
    codigoPostalSector: '170102',
    descripcionSector: 'Zona comercial y de entretenimiento con alta actividad nocturna',
    estado: 'active'
  }
  // ... más sectores
]
```

## Funcionalidades Técnicas

### Estado de Carga
- Spinners durante operaciones
- Estados de loading en botones
- Deshabilitación de formularios durante carga

### Manejo de Errores
- Validación de formularios en tiempo real
- Mensajes de error específicos
- Reintentos automáticos
- Estados de error con opciones de recuperación

### Responsive Design
- Diseño adaptativo para móviles
- Tablas con scroll horizontal en pantallas pequeñas
- Formularios en una columna en móviles

## Integración

### Dependencias
- Vue 3 Composition API
- Pinia para estado global
- Vue Router para navegación
- FontAwesome para iconos

### Composable Utilizado
- `useToast`: Para notificaciones
- `useSectorsStore`: Para estado del módulo

## Próximas Mejoras

### Funcionalidades Planificadas
- Exportación de datos a Excel/PDF
- Filtros avanzados por múltiples criterios
- Búsqueda con autocompletado
- Vista de mapa con ubicaciones de sectores
- Historial de cambios
- Importación masiva de sectores

### Mejoras Técnicas
- Integración con API real
- Caché de datos
- Optimización de rendimiento
- Tests unitarios y de integración 