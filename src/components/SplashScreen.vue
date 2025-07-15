<template>
  <Transition name="splash-fade" appear>
    <div v-if="isVisible" class="splash-screen">
      <div class="splash-content">
        <div class="splash-logo">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3"/>
            <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="currentColor"/>
            <circle cx="35" cy="45" r="2" fill="white"/>
            <circle cx="65" cy="55" r="2" fill="white"/>
          </svg>
        </div>
        <h1 class="splash-title">{{ title }}</h1>
        <p class="splash-subtitle">{{ subtitle }}</p>
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ loadingText }}</p>
        
        <!-- Barra de progreso opcional -->
        <div v-if="showProgress" class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ Math.round(progress) }}%</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'SplashScreen',
  props: {
    title: {
      type: String,
      default: 'IoT Water'
    },
    subtitle: {
      type: String,
      default: 'Sistema de Gestión Inteligente'
    },
    loadingText: {
      type: String,
      default: 'Cargando aplicación...'
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      isVisible: true
    }
  },
  mounted() {
    // Auto-hide después del tiempo especificado
    if (this.duration > 0) {
      setTimeout(() => {
        this.hide()
      }, this.duration)
    }
  },
  methods: {
    hide() {
      this.isVisible = false
      this.$emit('hidden')
    },
    show() {
      this.isVisible = true
      this.$emit('shown')
    }
  }
}
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.splash-content {
  text-align: center;
  color: white;
  animation: fadeInUp 1s ease-out;
}

.splash-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
}

.splash-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.splash-subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loading-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.progress-container {
  margin-top: 2rem;
  width: 200px;
  margin-left: auto;
  margin-right: auto;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Transiciones */
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.8s ease-out, visibility 0.8s ease-out;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
  visibility: hidden;
}

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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .splash-title {
    font-size: 2rem;
  }
  
  .splash-subtitle {
    font-size: 1rem;
  }
  
  .splash-logo {
    width: 100px;
    height: 100px;
  }
  
  .progress-container {
    width: 150px;
  }
}
</style> 