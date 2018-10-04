// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'

//引入mint-ui库，由于mint-ui太大，已局部引用
// import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

//引入路由
import router from './router'

//引入自定义base.css和base.js文件
import '../static/base/base.css'
import '../static/base/base'

//引入字体图标
import './assets/font/iconfont.css'

//引入图片懒加载插件
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad);

//引入axios，并配置axios
import axios from 'axios'
axios.defaults.baseURL = '/api';
axios.defaults.headers['apikey'] = 'test';
// axios.defaults.baseURL = 'http://app.izxcs.com:81';
// axios.defaults.baseURL = '192.168.3.185'
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

// Vue.use(MintUI);

//引入图片预览插件，新闻详情页中用到
// import VuePreview from 'vue-preview'
// Vue.use(VuePreview);

// 引入轮播图插件，图集页面用到
import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'
Vue.use(wcSwiper);

//引入cube-ui库，使用其slide组件
import Cube from 'cube-ui'
Vue.use(Cube);

//引入富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'
// Vue.use(VueQuillEditor);

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
