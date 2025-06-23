import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { installClickOutside } from './utils/clickOutside'

// Estilos
import './assets/styles/main.scss'

const app = createApp(App)

// Instalar plugins
app.use(router)
installClickOutside(app)

app.mount('#app')
