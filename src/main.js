import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { installClickOutside } from './utils/clickOutside'

// Estilos
import './assets/styles/main.scss'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBars)

// Crear la aplicación
const app = createApp(App)

// Registrar el componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

// Instalar plugins
app.use(router)
installClickOutside(app)

// Función para manejar la carga inicial
const initializeApp = async () => {
  try {
    // Montar la aplicación
    app.mount('#app')

    // Simular un pequeño delay para mostrar la pantalla de carga
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Ocultar la pantalla de carga nativa después de que Vue esté montado
    const splashScreen = document.querySelector('#splash-screen')
    if (splashScreen) {
      splashScreen.classList.add('fade-out')
      setTimeout(() => {
        splashScreen.remove()
      }, 800)
    }
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error)
  }
}

// Inicializar la aplicación
initializeApp()
