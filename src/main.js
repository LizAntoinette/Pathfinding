import Vue from "vue";
import App from "./App.vue";
import VueKonva from "vue-konva";
import { ButtonPlugin, DropdownPlugin, FormSelectPlugin } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/css/style.css";

Vue.use(ButtonPlugin);
Vue.use(DropdownPlugin);
Vue.use(FormSelectPlugin);
Vue.use(VueKonva);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
