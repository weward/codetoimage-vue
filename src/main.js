import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

// import hljsVuePlugin from "@highlightjs/vue-plugin";

const app = createApp(App)

app.use(createPinia())
// app.use(hljsVuePlugin)
app.mount('#app')
