import { ref, computed, readonly } from 'vue'

// Estado global de carga
const isLoading = ref(true)
const loadingProgress = ref(0)
const loadingMessage = ref('Inicializando aplicación...')

// Lista de tareas de carga
const loadingTasks = ref([
  { id: 'init', name: 'Inicializando aplicación', progress: 0 },
  { id: 'auth', name: 'Verificando autenticación', progress: 0 },
  { id: 'data', name: 'Cargando datos', progress: 0 },
  { id: 'ui', name: 'Preparando interfaz', progress: 0 }
])

export function useAppLoading() {
  // Computed para el progreso total
  const totalProgress = computed(() => {
    const total = loadingTasks.value.reduce((sum, task) => sum + task.progress, 0)
    return Math.round(total / loadingTasks.value.length)
  })

  // Función para actualizar el progreso de una tarea específica
  const updateTaskProgress = (taskId, progress, message = null) => {
    const task = loadingTasks.value.find(t => t.id === taskId)
    if (task) {
      task.progress = Math.min(100, Math.max(0, progress))
      if (message) {
        loadingMessage.value = message
      }
      loadingProgress.value = totalProgress.value
    }
  }

  // Función para marcar una tarea como completada
  const completeTask = (taskId, message = null) => {
    updateTaskProgress(taskId, 100, message)
  }

  // Función para iniciar la carga
  const startLoading = () => {
    isLoading.value = true
    loadingProgress.value = 0
    loadingMessage.value = 'Inicializando aplicación...'
    
    // Resetear todas las tareas
    loadingTasks.value.forEach(task => {
      task.progress = 0
    })
  }

  // Función para finalizar la carga
  const finishLoading = () => {
    isLoading.value = false
    loadingProgress.value = 100
    loadingMessage.value = '¡Aplicación lista!'
  }

  // Función para simular carga progresiva
  const simulateProgressiveLoading = async () => {
    startLoading()
    
    // Simular inicialización
    await new Promise(resolve => setTimeout(resolve, 500))
    updateTaskProgress('init', 50, 'Inicializando componentes...')
    await new Promise(resolve => setTimeout(resolve, 300))
    completeTask('init', 'Aplicación inicializada')

    // Simular verificación de autenticación
    await new Promise(resolve => setTimeout(resolve, 400))
    updateTaskProgress('auth', 30, 'Verificando credenciales...')
    await new Promise(resolve => setTimeout(resolve, 200))
    updateTaskProgress('auth', 70, 'Validando sesión...')
    await new Promise(resolve => setTimeout(resolve, 300))
    completeTask('auth', 'Autenticación verificada')

    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 300))
    updateTaskProgress('data', 25, 'Cargando configuración...')
    await new Promise(resolve => setTimeout(resolve, 200))
    updateTaskProgress('data', 60, 'Sincronizando datos...')
    await new Promise(resolve => setTimeout(resolve, 400))
    completeTask('data', 'Datos cargados')

    // Simular preparación de UI
    await new Promise(resolve => setTimeout(resolve, 200))
    updateTaskProgress('ui', 40, 'Preparando interfaz...')
    await new Promise(resolve => setTimeout(resolve, 300))
    updateTaskProgress('ui', 80, 'Finalizando...')
    await new Promise(resolve => setTimeout(resolve, 200))
    completeTask('ui', 'Interfaz lista')

    // Finalizar
    await new Promise(resolve => setTimeout(resolve, 500))
    finishLoading()
  }

  return {
    // Estado reactivo
    isLoading: readonly(isLoading),
    loadingProgress: readonly(loadingProgress),
    loadingMessage: readonly(loadingMessage),
    loadingTasks: readonly(loadingTasks),
    totalProgress,
    
    // Métodos
    startLoading,
    finishLoading,
    updateTaskProgress,
    completeTask,
    simulateProgressiveLoading
  }
}

// Exportar estado global para uso en otros componentes
export const appLoadingState = {
  isLoading,
  loadingProgress,
  loadingMessage,
  loadingTasks
} 