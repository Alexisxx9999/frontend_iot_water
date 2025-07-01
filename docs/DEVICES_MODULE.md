# Módulo de Gestión de Dispositivos LoRaWAN

## Descripción General

El módulo de gestión de dispositivos LoRaWAN permite administrar y monitorear todos los dispositivos IoT del sistema de agua, incluyendo medidores, válvulas y gateways. Proporciona funcionalidades completas de CRUD, mantenimiento, logs técnicos y ubicación geográfica.

## Características Principales

### ✅ Funcionalidades Implementadas

#### 1. **Gestión de Dispositivos**
- ✅ Listado paginado de dispositivos
- ✅ Búsqueda por número de serie, tipo, sector, cliente
- ✅ Filtrado por tipo, estado, sector
- ✅ Ordenamiento por columnas
- ✅ Crear nuevo dispositivo
- ✅ Editar dispositivo existente
- ✅ Eliminar dispositivo con confirmación

#### 2. **Vista de Detalles**
- ✅ Información completa del dispositivo
- ✅ Pestaña de mantenimiento con historial
- ✅ Pestaña de logs técnicos con filtros
- ✅ Pestaña de ubicación con estadísticas de zona
- ✅ Acciones rápidas (editar, mantenimiento, firmware)

#### 3. **Gestión de Mantenimientos**
- ✅ Registrar nuevos mantenimientos
- ✅ Historial de mantenimientos por dispositivo
- ✅ Tipos: Preventivo, Correctivo, Calibración, Actualización
- ✅ Seguimiento de costos y técnicos

#### 4. **Logs Técnicos**
- ✅ Visualización de logs en tiempo real
- ✅ Filtrado por tipo de log
- ✅ Tipos: Alerta, Comunicación, Configuración, Error, Mantenimiento

#### 5. **Configuración Avanzada**
- ✅ Parámetros LoRaWAN configurables
- ✅ Configuración personalizada (JSON)
- ✅ Gestión de firmware
- ✅ Umbrales de alerta

## Estructura de Archivos

```
src/
├── services/
│   └── devices.service.js          # Servicio principal de dispositivos
├── stores/
│   └── devices.js                  # Store Pinia para estado global
├── components/devices/
│   ├── DeviceModal.vue             # Modal crear/editar dispositivo
│   ├── DeleteDeviceModal.vue       # Modal confirmación eliminación
│   └── MaintenanceModal.vue        # Modal registro mantenimiento
├── views/Devices/
│   ├── DeviceListPage.vue          # Vista principal con tabla
│   └── DeviceDetailPage.vue        # Vista de detalles con pestañas
└── utils/
    └── mockData.js                 # Datos mock para desarrollo
```

## Tipos de Dispositivos

### 📊 Medidores
- **Función**: Medición de flujo de agua
- **Características**: Sensores de flujo, transmisión LoRaWAN
- **Configuración**: Frecuencia de reporte, umbrales de alerta

### 🔧 Válvulas
- **Función**: Control de flujo de agua
- **Características**: Actuadores, control remoto
- **Configuración**: Presión, flujo máximo, control automático

### 📡 Gateways
- **Función**: Concentrador de comunicaciones LoRaWAN
- **Características**: Múltiples canales, alta potencia
- **Configuración**: Canales, potencia, conectividad

## Estados Operacionales

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Activo** | Funcionando normalmente | Verde |
| **Inactivo** | Desactivado manualmente | Gris |
| **En Mantenimiento** | En proceso de mantenimiento | Amarillo |
| **En Falla** | Error detectado | Rojo |
| **Desconectado** | Sin comunicación | Naranja |

## Campos del Dispositivo

### Información Básica
- **Número de Serie**: Identificador único
- **Tipo**: Medidor, Válvula, Gateway
- **Modelo**: Modelo específico del fabricante
- **Fabricante**: Empresa fabricante
- **Fecha de Instalación**: Fecha de puesta en servicio

### Configuración
- **Frecuencia de Reporte**: Intervalo de envío de datos (minutos)
- **Umbral de Alerta**: Porcentaje para activar alertas
- **Versión de Firmware**: Versión actual del software
- **Configuración Personalizada**: Parámetros JSON específicos

### Ubicación
- **Sector**: Zona geográfica asignada
- **Dirección**: Dirección física
- **Coordenadas**: Latitud y longitud
- **Cliente Asociado**: Cliente propietario (opcional)

### Estado Técnico
- **Nivel de Batería**: Porcentaje de carga
- **Señal LoRa**: Intensidad de señal (dBm)
- **Última Comunicación**: Timestamp de último contacto
- **Gateway Principal**: Gateway asignado

## API Endpoints

### Dispositivos
```
GET    /devices              # Listar dispositivos (con filtros y paginación)
GET    /devices/:id          # Obtener dispositivo por ID
POST   /devices              # Crear nuevo dispositivo
PUT    /devices/:id          # Actualizar dispositivo
DELETE /devices/:id          # Eliminar dispositivo
GET    /devices/search       # Buscar dispositivos
GET    /devices/stats        # Estadísticas de dispositivos
```

### Mantenimientos
```
GET    /devices/:id/maintenance     # Obtener mantenimientos del dispositivo
POST   /devices/:id/maintenance     # Registrar nuevo mantenimiento
```

### Logs Técnicos
```
GET    /devices/:id/logs            # Obtener logs del dispositivo
```

### Firmware
```
POST   /devices/:id/firmware        # Actualizar firmware
```

### Datos Maestros
```
GET    /sectors                     # Listar sectores
GET    /clients                     # Listar clientes
GET    /gateways                    # Listar gateways
```

## Mock Data

El módulo incluye datos mock completos para desarrollo:

### Dispositivos de Ejemplo
- **8 dispositivos** con diferentes tipos y estados
- **Datos realistas** de ubicación, configuración y estado
- **Relaciones** con sectores, clientes y gateways

### Mantenimientos de Ejemplo
- **3 mantenimientos** con diferentes tipos
- **Datos completos** de técnicos, costos y actividades

### Logs de Ejemplo
- **8 logs técnicos** con diferentes tipos y severidades
- **Timestamps realistas** y mensajes descriptivos

## Uso del Módulo

### 1. Acceso al Módulo
```
Navegación: Menú Principal → Dispositivos
URL: /app/devices
```

### 2. Lista de Dispositivos
- **Vista principal** con tabla paginada
- **Filtros** en la parte superior
- **Búsqueda** en tiempo real
- **Acciones rápidas** por dispositivo

### 3. Crear Dispositivo
- **Botón "Nuevo Dispositivo"** en la vista principal
- **Formulario completo** con validaciones
- **Campos obligatorios** marcados con asterisco

### 4. Ver Detalles
- **Clic en "Ver Detalles"** o en el número de serie
- **4 pestañas**: Información, Mantenimiento, Logs, Ubicación
- **Acciones contextuales** en cada pestaña

### 5. Editar Dispositivo
- **Botón "Editar"** en la vista de detalles
- **Mismo formulario** que crear, con datos precargados
- **Validaciones** y confirmación de cambios

### 6. Eliminar Dispositivo
- **Botón "Eliminar"** con confirmación
- **Campo de confirmación** con texto "ELIMINAR"
- **Advertencias** sobre consecuencias

### 7. Registrar Mantenimiento
- **Botón "Mantenimiento"** en detalles
- **Formulario completo** con todos los campos
- **Integración** con historial de mantenimientos

## Validaciones

### Campos Obligatorios
- Número de Serie
- Tipo de Dispositivo
- Modelo
- Fabricante
- Fecha de Instalación
- Estado
- Sector

### Validaciones Específicas
- **Número de Serie**: Único en el sistema
- **Frecuencia de Reporte**: Mínimo 1 minuto
- **Umbral de Alerta**: Entre 0 y 100%
- **Coordenadas**: Formato válido de latitud/longitud
- **Configuración JSON**: Formato JSON válido

## Estados de Carga

### Loading States
- **Carga inicial**: Spinner en la tabla
- **Operaciones CRUD**: Botones con estado de carga
- **Filtros**: Indicador de búsqueda
- **Paginación**: Transiciones suaves

### Error States
- **Errores de red**: Mensajes descriptivos
- **Validaciones**: Campos con bordes rojos
- **Confirmaciones**: Modales de error
- **Fallbacks**: Estados por defecto

## Responsive Design

### Mobile First
- **Tabla responsive** con scroll horizontal
- **Filtros apilados** en móviles
- **Modales adaptados** a pantallas pequeñas
- **Navegación táctil** optimizada

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Integración con Backend

### Preparado para Producción
- **Servicios configurados** para APIs reales
- **Mock data** fácilmente removible
- **Estructura de datos** compatible con backend
- **Manejo de errores** robusto

### Endpoints Esperados
```javascript
// Ejemplo de respuesta esperada
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10
}
```

## Próximas Mejoras

### Funcionalidades Futuras
- [ ] **Mapa interactivo** con ubicaciones en tiempo real
- [ ] **Notificaciones push** para alertas críticas
- [ ] **Reportes avanzados** con gráficos
- [ ] **Integración con sensores** adicionales
- [ ] **Machine Learning** para predicción de fallas
- [ ] **API REST** completa con autenticación
- [ ] **WebSockets** para actualizaciones en tiempo real

### Optimizaciones
- [ ] **Lazy loading** de componentes pesados
- [ ] **Caching** de datos frecuentes
- [ ] **Virtual scrolling** para listas grandes
- [ ] **Offline mode** con sincronización
- [ ] **Progressive Web App** (PWA)

## Troubleshooting

### Problemas Comunes

#### 1. **Dispositivo no aparece en la lista**
- Verificar filtros aplicados
- Comprobar estado del dispositivo
- Revisar permisos de usuario

#### 2. **Error al crear dispositivo**
- Validar campos obligatorios
- Verificar formato de JSON en configuración
- Comprobar conexión de red

#### 3. **Mantenimientos no se guardan**
- Verificar campos requeridos
- Comprobar formato de fecha/hora
- Revisar permisos de escritura

#### 4. **Logs no se actualizan**
- Verificar filtros de tipo
- Comprobar conexión con backend
- Revisar permisos de lectura

## Soporte Técnico

### Documentación Adicional
- **API Documentation**: Swagger/OpenAPI
- **Component Library**: Storybook
- **Testing**: Jest + Vue Test Utils
- **Deployment**: Docker + CI/CD

### Contacto
- **Desarrollador**: Equipo de Desarrollo IoT
- **Email**: dev@iotwater.com
- **Slack**: #iot-devices
- **Jira**: Proyecto IOT-DEVICES

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2024  
**Estado**: ✅ Completado y funcional 