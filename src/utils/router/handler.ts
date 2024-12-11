// utils/router/handler.ts

import { RouteConfig } from 'vue-router'

class RoutesHandler {
  private roles: string[]

  constructor(roles: string[]) {
    this.roles = roles
  }

  generate(routerMap: RouteConfig[]) {
    const accessedRoutes: RouteConfig[] = this.roles.includes('super')
      ? routerMap
      : this.filterAsyncRouter(routerMap)

    accessedRoutes.push({
      path: '*',
      redirect: '/page'
    })

    return accessedRoutes
  }

  /**
   * Clarify routes object, property components is function
   */
  removeRoutesComp(routes: RouteConfig[]) {
    routes.forEach(route => {
      if (route.hasOwnProperty('components')) {
        // @ts-expect-error
        delete route.components
      } else if (route.hasOwnProperty('component')) {
        // @ts-expect-error
        delete route.component
      }

      if (route.children) {
        this.removeRoutesComp(route.children)
      }
    })

    return routes
  }

  /**
   * filter for permissioned routes
   */
  private filterAsyncRouter(routerMap: RouteConfig[]): RouteConfig[] {
    const response: RouteConfig[] = []

    routerMap.forEach(route => {
      const tmp = { ...route }

      if (this.hasPermission(tmp)) {
        if (tmp.children) {
          tmp.children = this.filterAsyncRouter(tmp.children)
        }
        response.push(tmp)
      }
    })

    return response
  }

  /**
   * 使用 meta.role 判斷權限
   * @param route 目標 route
   */
  private hasPermission(route: RouteConfig): boolean {
    if (route.meta && route.meta.roles) {
      const roles = route.meta.roles
      return this.roles.some(role => roles.includes(role))
    }

    return true
  }
}

export default RoutesHandler
