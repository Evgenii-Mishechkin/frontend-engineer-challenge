import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './app/router'
import { useSessionStore } from '@/entities/session'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

useSessionStore(pinia).hydrateFromStorage()

app.mount('#app')
