// core/router/routes.ts

import { RouteConfig } from 'vue-router'

import Login from '@t/pages/PageLogin.vue'
import Page404 from '@t/pages/Page404.vue'
import Page500 from '@t/pages/Page500.vue'

export default [
  {
    path: '/auth',
    redirect: '/auth/signin',
    name: 'auth',
    component: {
      render(c) {
        return c('router-view')
      }
    },
    children: [
      {
        path: 'signin',
        name: 'Login',
        component: Login
      }
    ]
  },
  {
    path: '/page',
    redirect: '/page/404',
    name: 'page',
    component: {
      render(c) {
        return c('router-view')
      }
    },
    children: [
      {
        path: '404',
        name: 'page404',
        component: Page404
      },
      {
        path: '500',
        name: 'page500',
        component: Page500
      }
    ]
  }
] as RouteConfig[]
