import Vue from 'vue'
import App from './App'
import router from './router'
import 'normalize.css'
import '@/assets/js/rem'
import '@/assets/css/common.css'
import 'animate.css'
import VueSwiper from 'vue-awesome-swiper'
import $ from 'jquery'

$
Vue.use(VueSwiper)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
