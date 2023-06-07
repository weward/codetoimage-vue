import { createPinia } from 'pinia'
import { createApp } from 'vue'
import regeneratorRuntime from "regenerator-runtime" // do not remove!
import VueHtml2Canvas from 'vue-html2canvas'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faDownload, faFloppyDisk, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faDownload, faFloppyDisk, faArrowsRotate)


const app = createApp(App)

app.use(createPinia())
app.use(VueHtml2Canvas)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
