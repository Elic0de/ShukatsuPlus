import './assets/base.css';
import './assets/font-awesome.css';
// import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './router';

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ToastPlugin)
app.mount('#app')