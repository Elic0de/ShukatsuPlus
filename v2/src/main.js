import './assets/base.css';
import './assets/font-awesome.css';
// import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './router';

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import liff from "@line/liff";

liff.init({
  liffId: import.meta.env.VITE_LIFF_ID, 
});

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ToastPlugin)
app.mount('#app')