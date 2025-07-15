# Pantalla de Carga (Splash Screen) - IoT Water

## Descripción

Se ha implementado un sistema completo de pantalla de carga para la aplicación IoT Water, que incluye tanto una pantalla de carga nativa en HTML como un componente Vue reutilizable.

## Características

### 🎨 Pantalla de Carga Nativa
- **Ubicación**: `index.html`
- **Funcionalidad**: Se muestra automáticamente al cargar la aplicación
- **Diseño**: Gradiente moderno con logo SVG personalizado
- **Animaciones**: Fade in/out suaves con transiciones CSS
- **Responsive**: Adaptable a diferentes tamaños de pantalla

### 🔧 Componente Vue Reutilizable
- **Ubicación**: `src/components/SplashScreen.vue`
- **Props**: Altamente configurable
- **Eventos**: Emite eventos cuando se muestra/oculta
- **Barra de progreso**: Opcional con animación suave

### 📊 Composable de Estado
- **Ubicación**: `src/composables/useAppLoading.js`
- **Funcionalidad**: Manejo reactivo del estado de carga
- **Tareas**: Sistema de tareas de carga con progreso individual
- **Simulación**: Función para simular carga progresiva

## Uso

### 1. Pantalla de Carga Nativa

La pantalla de carga nativa se muestra automáticamente al cargar la aplicación. Se oculta automáticamente cuando Vue termina de montarse.

```html
<!-- En index.html -->
<div id="splash-screen">
  <div class="splash-content">
    <!-- Contenido de la pantalla de carga -->
  </div>
</div>
```

### 2. Componente SplashScreen

```vue
<template>
  <div>
    <!-- Botón para mostrar la pantalla de carga -->
    <button @click="showSplash">Mostrar Pantalla de Carga</button>
    
    <!-- Componente SplashScreen -->
    <SplashScreen 
      v-if="isVisible"
      @hidden="isVisible = false"
      title="Mi Aplicación"
      subtitle="Cargando..."
      :show-progress="true"
      :progress="progressValue"
      :duration="3000"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import SplashScreen from '@/components/SplashScreen.vue'

export default {
  components: { SplashScreen },
  setup() {
    const isVisible = ref(false)
    const progressValue = ref(0)

    const showSplash = () => {
      isVisible.value = true
      // Simular progreso
      const interval = setInterval(() => {
        progressValue.value += 10
        if (progressValue.value >= 100) {
          clearInterval(interval)
        }
      }, 200)
    }

    return { isVisible, progressValue, showSplash }
  }
}
</script>
```

### 3. Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | String | 'IoT Water' | Título principal |
| `subtitle` | String | 'Sistema de Gestión Inteligente' | Subtítulo |
| `loadingText` | String | 'Cargando aplicación...' | Texto de carga |
| `showProgress` | Boolean | false | Mostrar barra de progreso |
| `progress` | Number | 0 | Valor del progreso (0-100) |
| `duration` | Number | 2000 | Duración en ms (0 = manual) |

### 4. Eventos del Componente

| Evento | Descripción |
|--------|-------------|
| `@shown` | Se emite cuando se muestra |
| `@hidden` | Se emite cuando se oculta |

### 5. Composable useAppLoading

```vue
<script>
import { useAppLoading } from '@/composables/useAppLoading.js'

export default {
  setup() {
    const { 
      isLoading, 
      loadingProgress, 
      loadingMessage,
      startLoading, 
      finishLoading,
      simulateProgressiveLoading 
    } = useAppLoading()

    // Iniciar carga
    const handleLoad = async () => {
      startLoading()
      
      // Realizar tareas de carga
      await loadData()
      await initializeComponents()
      
      finishLoading()
    }

    // Simular carga progresiva
    const simulateLoading = async () => {
      await simulateProgressiveLoading()
    }

    return {
      isLoading,
      loadingProgress,
      loadingMessage,
      handleLoad,
      simulateLoading
    }
  }
}
</script>
```

## Ejemplos

### Ejemplo Básico

```vue
<SplashScreen 
  :duration="2000"
  @hidden="onSplashHidden"
/>
```

### Ejemplo con Progreso

```vue
<SplashScreen 
  :show-progress="true"
  :progress="currentProgress"
  :loading-text="currentMessage"
  :duration="0"
  @hidden="onComplete"
/>
```

### Ejemplo Personalizado

```vue
<SplashScreen 
  title="Mi Aplicación"
  subtitle="Configuración Especial"
  loading-text="Procesando datos..."
  :duration="5000"
/>
```

## Personalización

### Cambiar Colores

```scss
.splash-screen {
  background: linear-gradient(135deg, #tu-color-1 0%, #tu-color-2 100%);
}
```

### Cambiar Logo

```vue
<template>
  <div class="splash-logo">
    <!-- Reemplazar el SVG con tu logo -->
    <img src="/path/to/your/logo.png" alt="Logo" />
  </div>
</template>
```

### Cambiar Animaciones

```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Página de Ejemplos

Se ha creado una página de demostración en `src/views/Example/SplashExamplePage.vue` que muestra diferentes configuraciones del componente SplashScreen.

Para acceder a ella, agrega la ruta en tu router:

```javascript
{
  path: '/splash-examples',
  name: 'SplashExamples',
  component: () => import('@/views/Example/SplashExamplePage.vue')
}
```

## Mejores Prácticas

1. **Duración**: Usa duraciones entre 1-3 segundos para no frustrar al usuario
2. **Progreso**: Muestra progreso real cuando sea posible
3. **Mensajes**: Usa mensajes descriptivos y actualízalos según el progreso
4. **Responsive**: Asegúrate de que funcione bien en móviles
5. **Accesibilidad**: Considera usuarios con discapacidades visuales

## Troubleshooting

### La pantalla no se oculta
- Verifica que el evento `@hidden` esté manejado correctamente
- Asegúrate de que `duration` no sea 0 si no manejas manualmente la ocultación

### El progreso no se actualiza
- Verifica que `progress` sea reactivo (use `ref()` o `reactive()`)
- Asegúrate de que `showProgress` esté en `true`

### Problemas de rendimiento
- Evita actualizar el progreso muy frecuentemente (< 100ms)
- Considera usar `requestAnimationFrame` para animaciones suaves

## Contribución

Para agregar nuevas características:

1. Modifica el componente `SplashScreen.vue`
2. Actualiza la documentación
3. Agrega ejemplos en `SplashExamplePage.vue`
4. Prueba en diferentes dispositivos y navegadores 