import Vue from 'vue'
import Router from 'vue-router'

// -----------------------页面-------------------------

const login = () => import('@/views/login/login')
const table = () => import('@/views/table/table')
const guide = () => import('@/views/guide/guide')
const home = () => import('@/views/home/home')
const notFound = () => import('@/views/code/404')
const form = () => import('@/views/form/form')
const tree = () => import('@/views/form/tree')
const echarts = () => import('@/views/echarts/echarts')
// -----------------------组件-------------------------

// 帮助 - 几乎所有页面都包含的组件
const menu = () => import('@/components/menu/menu')
const help = () => import('@/components/help/help')

Vue.use(Router)

export default new Router({
  routes: [
    // 默认登陆页 - 进入其他页面后，检测是否登陆，否则回跳到登陆页
    // { path: '/', component: login },
    { path: '*', component: notFound },
    // table demo
    { path: '/', component: table },
    { path: '/login', name: 'login', component: login },
    // 引导页 - 只有第一次登陆后才有的页面
    { path: '/guide', name: 'guide', component: guide },
    // form表单
    { path: '/form', name: 'form', component: form },
    { path: '/tree', name: 'tree', component: tree },
    // echarts
    {path: '/echarts', name: 'echarts', component: echarts},
    // 控制台 - 概览页
    {
      path: '/backend/home',
      components: {
        default: home,
        menu: menu,
        help: help
      }
    }
  ]
})
