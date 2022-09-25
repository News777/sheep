import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import './icons/iconfont.css';
import './icons/iconfont';
createApp(App)
  .use(store)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app');
