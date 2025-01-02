import './assets/main.css'

import { createApp } from 'vue'
import { createHead } from 'unhead'
import App from './App.vue'
import router from './router'

createHead()
const app = createApp(App)

app.use(router)
app.mount('#app')
