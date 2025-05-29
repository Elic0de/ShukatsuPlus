import './assets/base.css';
import './assets/font-awesome.css';
// import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

createApp(App).use(router).use(ToastPlugin).mount('#app');
