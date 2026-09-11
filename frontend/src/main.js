import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

// Configure Axios Base URL based on environment or default to Vercel production backend URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://jfvtbackend.vercel.app' : '');
if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

const app = createApp(App);
app.use(router);
app.mount('#app');
