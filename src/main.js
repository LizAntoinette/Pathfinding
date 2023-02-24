import Vue from "vue";
import App from "./App.vue";
import VueKonva from 'vue-konva'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

require('@/assets/css/style.css');
Vue.config.productionTip = false;

Vue.use(VueKonva);
new Vue({
  render: h => h(App)
}).$mount("#app");
