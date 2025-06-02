import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import * as LucideIcons from 'lucide-vue-next'
import 'tailwindcss/tailwind.css'

const app = createApp(App)

for (const [name, icon] of Object.entries(LucideIcons)) {
  app.component(name, icon)
}

app.use(createPinia())
app.use(router)
app.mount('#app')
