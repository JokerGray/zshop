import Vue from 'vue'
import Router from 'vue-router'

// const Index = () => import('@/views/Index')
// const Entry = () => import('@/views/Entry')
const Entry = () => import('@/pages/entry/entry')
const Home = () => import('@/pages/home/home')
const Guide = () => import('@/pages/guide/guide')
const Signin = () => import('@/pages/signin/signin')
const NotFound = () => import('@/pages/404/404')

const Shop = () => import('@/pages/shop/shop')
const Staff = () => import('@/pages/staff/staff')
const Goods = () => import('@/pages/goods/goods')
const PC = () => import('@/pages/goods/pc')

const Customer = () => import('@/pages/customer/customer')

Vue.use(Router)

const router = new Router({
  routes: [
    // 登陆页
    { path: '/signin', name: 'signin', component: Signin },
    // 默认引导页
    { path: '/', name: 'guide', component: Guide },
    { path: '*', name: 'notFound', component: NotFound },
    // 引导页
    { path: '/guide', component: Guide },
    // 后台首页
    { path: '/home', name: 'home', component: Home },
    // 录入页，覆盖于后台首页
    { path: '/entry',
      name: 'entry',
      components: {
        default: Home,
        entry: Entry
      },
      children: [
        { path: 'shop', name: 0, component: Shop },
        { path: 'staff', name: 1, component: Staff },
        { path: 'goods', name: 2, component: Goods },
        { path: 'customer', name: 3, component: Customer },
        { path: 'packCard', name: 'packCard', component: PC }
      ]
    }
  ]
})

// 监听路由变化
router.beforeEach((to, from, next) => {
  console.log(`from ${from.fullPath} to ${to.fullPath}`)
  next()
})

export default router
