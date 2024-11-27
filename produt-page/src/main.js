import { createApp } from 'vue'; // Use createApp for Vue 3
import App from './App.vue';
import store from './store';
import './assets/global.css'; // Adjust the path to your store file
// Dynamically add the FontAwesome link to the head
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(link);
const app = createApp(App);
app.use(store); // Use the store in your app
app.mount('#app');



