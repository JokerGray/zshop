import Vue from 'vue'
import Router from 'vue-router'

const zcity = resolve => require(['@/components/zcity/index.vue'], resolve)
const zshop = resolve => require(['@/components/zshop/index.vue'], resolve)
const zmaster = resolve => require(['@/components/zmaster/index.vue'], resolve)
const zhome = resolve => require(['@/components/zhome/index.vue'], resolve)
const zplatform = resolve => require(['@/components/zplatform/index.vue'], resolve)
const zvideo = resolve => require(['@/components/zvideo/index.vue'], resolve)

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/zhome' },
    { path: '*', redirect: '/zhome' },
    { path: '/zhome', name: 'zhome', component: zhome, meta: { title: '首页' } },
    { path: '/zcity', name: 'zcity', component: zcity, meta: { title: '智享城市' } },
    { path: '/zshop', name: 'zshop', component: zshop, meta: { title: '智享店务' } },
    { path: '/zmaster', name: 'zmaster', component: zmaster, meta: { title: '智大师' } },
    { path: '/zplatform', name: 'zplatform', component: zplatform, meta: { title: '智享后台' } },
    { path: '/zvideo', name: 'zvideo', component: zvideo, meta: { title: '视频教学' } }
  ]
})

// 路由跳转修改文档标题
router.beforeEach((to, from, next) => {
  document.title = '智享城市 - ' + to.meta.title
  next()
})

export default router
