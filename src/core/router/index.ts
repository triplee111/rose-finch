// core/router/index.ts

import Vue from 'vue'
// class-component-hooks.js
import Component from 'vue-class-component'

import VueRouter, { RouterOptions } from 'vue-router'

import baseRoutes from './routes'

Vue.use(VueRouter)

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

const options: RouterOptions = {
  base: process.env.PROJ_ROUTER_BASE,
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: baseRoutes
}

export default new VueRouter(options)
