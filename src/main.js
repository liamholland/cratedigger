import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory }
    from 'vue-router';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import routes from './router/routes';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"

//router
let router = createRouter({
    history: createWebHistory(),
    routes: routes
});

const app = createApp(App)

app.use(router);

//define the loading bar
app.use(LoadingPlugin, {
    container : null,
    canCancel: false,
    color: '#32B506',
    height: 40,
    width: 40,
    loader: 'bars',
    opacity: 0.3,
    enforceFocus: true
  });

app.mount('#app');

