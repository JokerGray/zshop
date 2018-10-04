import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      component:require('../components/foter.vue'),
      children:[
        {//二级默认路由
          path: '',
          redirect: '/qbz'
        },
        //转文赚
        {
          path: '/zwz',
          component: require('../views/zwz/zwz.vue'),
          children: [
            {
              path: '',
              component: require('../views/zwz/week.vue')
            },
            {
              path: '/now',
              component: require('../views/zwz/now.vue')
            },
            {
              path: '/yesterday',
              component: require('../views/zwz/yesterday.vue')
            },
            {
              path: '/week',
              component: require('../views/zwz/week.vue')
            },
            {
              path: '/month',
              component: require('../views/zwz/month.vue')
            },
          ]
        },
        //分享赚
        {
          path: '/fxz',
          component: require('../views/fxz/fxz.vue'),
          children: [
            {
              path: '/',
              component: require('../views/fxz/week.vue')
            },
            {
              path: '/now',

              component: require('../views/fxz/now.vue')
            },
            {
              path: '/yesterday',
              component: require('../views/fxz/yesterday.vue')
            },
            {
              path: '/week',
              component: require('../views/fxz/week.vue')
            },
            {
              path: '/month',
              component: require('../views/fxz/month.vue')
            },
          ]
        },
        //抢标赚
        {
          path: '/qbz',
          component:require("../views/qbz/qbz.vue"),
        },
      ]
    },
  ]
})
