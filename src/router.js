import Vue from "vue"
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('./views/Home/Home'),
    meta: {
      requireLogin: true
    },
    children: [
      {
        path: '',
        name: 'HomeRight',
        component: () => import('./views/Home/HomeRight.vue')
      },

      {
        path: 'order',
        redirect: 'order/ordered',
        component: () => import('./views/Order/Order.vue'),
        children: [
          {
            path: 'ordered',
            component: () => import('./views/Order/Ordered.vue')
          },
          {
            path: 'shopped',
            component: () => import('./views/Order/Shopped.vue')
          }
        ]
      },
      {
        path: 'table',
        component: () => import('./views/Table.vue'),
        meta: {
          requireLogin: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('./views/Login.vue'),
    beforeEnter: (to, from, next) => {
      // ...如果是已登录状态进入这个组件，就跳转到首页
      if (localStorage.getItem('order:token') != null) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/admin',
    redirect: 'admin/category',
    component: () => import('./views/Admin/Admin.vue'),
    meta: {
      requireLogin: true
    },
    children: [
      {
        path: 'category',
        component: () => import('./views/Admin/DishCategory.vue')
      },
      {
        path: 'dish',
        component: () => import('./views/Admin/DishEdit.vue')
      },
      {
        path: 'table',
        component: () => import('./views/Admin/Table.vue')
      }

    ]
  },
  {
    path: '/demo',
    component: () => import('./views/demo.vue'),

  },
]

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active',
  linkActiveClass: 'ac',
  mode: 'history'
})

router.beforeEach((to, from, next) => {

  const isRequire = to.matched.some(item => item.meta.requireLogin)
  if (isRequire) {//需要登录
    if (localStorage.getItem('order:isLogin') == null) {
      next('/login')
    } else {//已经登录 
      next()
    }
  } else {
    next()
  }
})
export default router