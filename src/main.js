import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory }
    from 'vue-router';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import routes from './router/routes';
import "bootstrap/dist/css/bootstrap.min.css"
let router = createRouter({
    history: createWebHistory(),
    routes: routes
});

const app = createApp(App)
app.use(router);
app.use(LoadingPlugin, {
    container : null,
    canCancel: false,
    color: '#32B506',
    height: 40,
    width: 40,
    loader: 'bars',
    opacity: 0.5,
    enforceFocus: true
  });
app.mount('#app');

