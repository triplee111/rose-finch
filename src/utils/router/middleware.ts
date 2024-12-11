// utils/router/middleware.ts

import { Store } from 'vuex'

import VueRouter from 'vue-router'

import { RootState } from '@src/types'

// import nprogress from '@src/utils/progress/nprogress/index'

export default class Middleware {
  private store: Store<RootState>
  private router: VueRouter

  constructor(store: Store<RootState>, router: VueRouter) {
    this.store = store
    this.router = router

    this.init()
  }

  /**
   * init middleware
   */
  init() {
    this.beforeEach()
    // this.afterEach()
  }

  private beforeEach() {
    const regex = new RegExp('/auth')

    this.router.beforeEach((to, _from, next) => {
      // nprogress.start()

      const token = this.store.state.permission.token
      const roles = this.store.state.permission.roles

      if (token && roles.length) {
        if (regex.test(to.path)) {
          // nprogress.done()

          return next('/')
        }

        return next()
      }

      if (regex.test(to.path)) {
        return next()
      }

      // nprogress.done()

      return next('/auth')
    })
  }

  // private afterEach() {
  //   this.router.afterEach(() => {
  //     nprogress.inc(1.0)
  //     setTimeout(() => nprogress.done(), 0)
  //   })
  // }
}
