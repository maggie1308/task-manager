

//import store from "./store";

//createApp(App).use(store).use(router).mount("#app");

// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

createApp(App)
  .use(router)
  .mount('#app');
