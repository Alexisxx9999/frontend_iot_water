import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { installClickOutside } from './utils/clickOutside'
import axios from 'axios'
import { createPinia } from 'pinia'

// Estilos
import './assets/styles/main.scss'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBars,
  faTachometerAlt,
  faSyncAlt,
  faSpinner,
  faExclamationTriangle,
  faChartBar,
  faCogs,
  faChartLine,
  faChartPie,
  faSearch,
  faMicrochip,
  faMapMarkerAlt,
  faUsers,
  faWifi,
  faTachometerAlt as faTachometer,
  faDollarSign,
  faArrowUp,
  faArrowDown,
  faCheckCircle,
  faInfoCircle,
  faToggleOn,
  faExclamationTriangle as faExclamation,
  faCog,
  faTint,
  faLeaf,
  faSpinner as faSpinnerIcon,
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faTimes,
  faArrowLeft,
  faSave,
  faCopy,
  faPlay,
  faPause,
  faChevronLeft,
  faChevronRight,
  faInbox
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(
  faBars,
  faTachometerAlt,
  faSyncAlt,
  faSpinner,
  faExclamationTriangle,
  faChartBar,
  faCogs,
  faChartLine,
  faChartPie,
  faSearch,
  faMicrochip,
  faMapMarkerAlt,
  faUsers,
  faWifi,
  faTachometer,
  faDollarSign,
  faArrowUp,
  faArrowDown,
  faCheckCircle,
  faInfoCircle,
  faToggleOn,
  faExclamation,
  faCog,
  faTint,
  faLeaf,
  faSpinnerIcon,
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faTimes,
  faArrowLeft,
  faSave,
  faCopy,
  faPlay,
  faPause,
  faChevronLeft,
  faChevronRight,
  faInbox
)

// Crear la aplicación
const app = createApp(App)

// Registrar el componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

// Instalar plugins
app.use(router)
installClickOutside(app)

const pinia = createPinia()
app.use(pinia)

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
