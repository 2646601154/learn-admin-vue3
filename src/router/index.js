import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/',
      component: () => import('../views/layout/index.vue'),
      redirect: '/index',
      children: [
        {
          path: 'index',
          name: 'home',
          component: () => import('../views/index/index.vue'),
        },
        {
          path: 'clazz',
          name: 'clazz',
          component: () => import('../views/clazz/index.vue'),
        },
        {
          path: 'stu',
          name: 'stu',
          component: () => import('../views/stu/index.vue'),
        },
        {
          path: 'dept',
          name: 'dept',
          component: () => import('../views/dept/index.vue'),
        },
        {
          path: 'emp',
          name: 'emp',
          component: () => import('../views/emp/index.vue'),
        },
        {
          path: 'report/emp',
          name: 'reportEmp',
          component: () => import('../views/report/emp.vue'),
        },
        {
          path: 'report/stu',
          name: 'reportStu',
          component: () => import('../views/report/stu.vue'),
        },
        {
          path: 'log',
          name: 'log',
          component: () => import('../views/log/index.vue'),
        },
      ],
    },
  ],
})

//路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  //检查是否是登录页面
  if (to.path === '/login') {
    //如果是登录页面，直接放行
    next()
  } else {
    //检查是否已登录
    if (userStore.isLoggedIn) {
      //已登录，放行
      next()
    } else {
      //未登录，跳转到登录页面
      next('/login')
    }
  }
})

export default router
