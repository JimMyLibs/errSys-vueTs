import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
// import Vconsole from 'vconsole'
// new Vconsole();

import './resource/js/init/page';
import './resource/style/index.scss';

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
