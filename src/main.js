import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import './icons/iconfont.css';

createApp(App).use(store).mount('#app');
