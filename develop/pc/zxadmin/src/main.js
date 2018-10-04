// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// jquery
/*  eslint-disable-next-line  */
import $ from 'jquery'
// 状态管理
import store from './store/store'
// 路由管理
import router from './router'
// 整体框架
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 页面动画
import 'animate.css'
// 富文本编辑器
import VueKindEditor from 'vue-kindeditor'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
Vue.use(VueKindEditor)

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
