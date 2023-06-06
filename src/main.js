import { createPinia } from 'pinia'
import { createApp } from 'vue'
import regeneratorRuntime from "regenerator-runtime"
import VueHtml2Canvas from 'vue-html2canvas'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(VueHtml2Canvas)
app.mount('#app')
