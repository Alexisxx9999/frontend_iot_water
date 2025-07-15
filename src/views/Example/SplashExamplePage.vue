<template>
  <div class="splash-example-page">
    <div class="page-header">
      <h1>Ejemplos de Pantalla de Carga</h1>
      <p>Demostración de diferentes configuraciones del componente SplashScreen</p>
    </div>

    <div class="examples-grid">
      <!-- Ejemplo básico -->
      <div class="example-card">
        <h3>Ejemplo Básico</h3>
        <p>Pantalla de carga simple con configuración por defecto</p>
        <button @click="showBasicSplash" class="example-btn">
          Mostrar Splash Básico
        </button>
      </div>

      <!-- Ejemplo con progreso -->
      <div class="example-card">
        <h3>Con Barra de Progreso</h3>
        <p>Pantalla de carga con barra de progreso simulada</p>
        <button @click="showProgressSplash" class="example-btn">
          Mostrar con Progreso
        </button>
      </div>

      <!-- Ejemplo personalizado -->
      <div class="example-card">
        <h3>Personalizado</h3>
        <p>Pantalla de carga con texto y duración personalizados</p>
        <button @click="showCustomSplash" class="example-btn">
          Mostrar Personalizado
        </button>
      </div>

      <!-- Ejemplo con carga real -->
      <div class="example-card">
        <h3>Carga Real</h3>
        <p>Simula carga progresiva con tareas reales</p>
        <button @click="showRealLoading" class="example-btn">
          Simular Carga Real
        </button>
      </div>
    </div>

    <!-- Componentes SplashScreen -->
    <SplashScreen 
      v-if="showBasic"
      @hidden="showBasic = false"
      :duration="2000"
    />

    <SplashScreen 
      v-if="showProgress"
      @hidden="showProgress = false"
      :show-progress="true"
      :progress="progressValue"
      :loading-text="progressMessage"
      :duration="4000"
    />

    <SplashScreen 
      v-if="showCustom"
      @hidden="showCustom = false"
      title="Carga Personalizada"
      subtitle="Configuración específica"
      loading-text="Procesando datos..."
      :duration="3000"
    />

    <SplashScreen 
      v-if="showReal"
      @hidden="showReal = false"
      :show-progress="true"
      :progress="realProgress"
      :loading-text="realMessage"
      :duration="0"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import SplashScreen from '@/components/SplashScreen.vue'
import { useAppLoading } from '@/composables/useAppLoading.js'

export default {
  name: 'SplashExamplePage',
  components: {
    SplashScreen
  },
  setup() {
    // Estados para mostrar diferentes ejemplos
    const showBasic = ref(false)
    const showProgress = ref(false)
    const showCustom = ref(false)
    const showReal = ref(false)

    // Estados para el ejemplo con progreso
    const progressValue = ref(0)
    const progressMessage = ref('Iniciando...')

    // Estados para la carga real
    const realProgress = ref(0)
    const realMessage = ref('Inicializando...')

    // Composable de carga
    const { simulateProgressiveLoading } = useAppLoading()

    // Función para mostrar splash básico
    const showBasicSplash = () => {
      showBasic.value = true
    }

    // Función para mostrar splash con progreso
    const showProgressSplash = () => {
      showProgress.value = true
      progressValue.value = 0
      progressMessage.value = 'Iniciando...'

      // Simular progreso
      const interval = setInterval(() => {
        progressValue.value += Math.random() * 15
        if (progressValue.value >= 100) {
          progressValue.value = 100
          progressMessage.value = '¡Completado!'
          clearInterval(interval)
        } else {
          const messages = [
            'Cargando módulos...',
            'Inicializando componentes...',
            'Verificando conexiones...',
            'Preparando interfaz...',
            'Finalizando...'
          ]
          const index = Math.floor((progressValue.value / 100) * messages.length)
          progressMessage.value = messages[Math.min(index, messages.length - 1)]
        }
      }, 200)
    }

    // Función para mostrar splash personalizado
    const showCustomSplash = () => {
      showCustom.value = true
    }

    // Función para mostrar carga real
    const showRealLoading = async () => {
      showReal.value = true
      realProgress.value = 0
      realMessage.value = 'Inicializando...'

      // Simular carga progresiva real
      const steps = [
        { progress: 20, message: 'Verificando autenticación...', delay: 800 },
        { progress: 40, message: 'Cargando configuración...', delay: 600 },
        { progress: 60, message: 'Sincronizando datos...', delay: 1000 },
        { progress: 80, message: 'Preparando interfaz...', delay: 500 },
        { progress: 100, message: '¡Aplicación lista!', delay: 300 }
      ]

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay))
        realProgress.value = step.progress
        realMessage.value = step.message
      }

      // Ocultar después de completar
      setTimeout(() => {
        showReal.value = false
      }, 1000)
    }

    return {
      showBasic,
      showProgress,
      showCustom,
      showReal,
      progressValue,
      progressMessage,
      realProgress,
      realMessage,
      showBasicSplash,
      showProgressSplash,
      showCustomSplash,
      showRealLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.splash-example-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #666;
  }
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.example-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
}

.example-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .splash-example-page {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .examples-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .example-card {
    padding: 1.5rem;
  }
}
</style> 