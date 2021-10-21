import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import TestModal from './pages/components/TestModal.vue'

const app = createApp(App)
app.component('TestModal', TestModal)

app.mount('#app')
