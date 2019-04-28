import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import login from '@/models/login.vue'
import casLogin from '@/models/casLogin.vue'
import home from '@/models/home/homeBridging.vue'

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // redirect: 'casLogin'
    redirect: 'login'
  },
  {
    path: `/login`,
    component: login
  },
  {
    path: `/casLogin`,
    component: casLogin
  },
  {
    path: `/home`,
    component: home,
    props: { menuAlign: 'left' },//left==>菜单在左侧 top==>菜单在上方
    children: [
      {
        path: `/welcome`,
        component: () => import("@/models/home/welcome")
      },
      {
        name: 'auth',
        path: '/auth',
        component: () => import('@/models/sys/main'),
        children:[
          {
            name: 'menu',
            path: '/sys/menu',
            component: () => import('@/models/sys/menu/menuMain')
          },
          {
            name: 'user',
            path: '/sys/user',
            component: () => import('@/models/sys/user/userMain')
          },
          {
            name: 'supervisionUser',
            path: '/sys/supervisionUser',
            component: () => import('@/models/sys/user/supervisionUserMain')
          },
          {
            name: 'role',
            path: '/sys/role',
            component: () => import('@/models/sys/role/roleMain')
          },
          {
            name: 'origin',
            path: '/sys/origin',
            component: () => import('@/models/sys/origin/originMain')
          }

        ]
      },
    ]
  },
  {
    name: 'record',
    path: '/record',
    component: () => import('@/models/record/main'),
    children: [
      {
        name: 'submitAUmanager',
        path: '/record/submitAUmanager',
        component: () => import('@/models/record/submitAuthority/submitAUmanager'),
        children: []
      }
    ]
  }
]

var router =  new VueRouter({
  mode: 'history',
  routes:routes
})
export default router
