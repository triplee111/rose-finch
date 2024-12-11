// core/container/appContainer.ts

import { Component, Watch, Vue } from 'vue-property-decorator'

import { RawLocation, RouteConfig } from 'vue-router'

import RoutesHandler from '@u/router/handler'

/**
 * '@/routes' 為 dynamic routes, 內容為各專案的專屬 routes
 * '@' 是 webpack 設定的 alias, 指向目前開發專案的路徑
 * 依據目前 serve or build 的對象去讀取不同路徑的 routes.ts
 * 因為無法預設指定，故在 shims-app-vue.d.ts 中加入宣告，避免 module not exist 提示
 */
import navRoutes from '@/routes'

@Component
export default class AppContainer extends Vue {
  get token(): string {
    return this.$store.state.permission.token
  }

  get roles(): string[] {
    return this.$store.state.permission.roles
  }

  get routes(): [] {
    return this.$store.state.permission.routes
  }

  @Watch('token')
  onTokenCanceld(value: string): void {
    if (value === '') {
      location.reload()
    }
  }

  @Watch('roles', { immediate: true })
  onRoleChanged(rolesArr: string[]): void {
    // check roles and routes added or not
    if (rolesArr.length && !this.routes.length) {
      this.generateRoutes().then(({ routes, handler }) => {
        if (process.env.NODE_ENV === 'production') {
          const redirect: RawLocation = Object.keys(this.$route.query).length
            ? this.$route.query
            : '/'

          this.$router.replace(redirect)
        }

        routes = handler.removeRoutesComp(routes)

        this.$store.dispatch(`permission/setRoutes`, routes)
      })
    }
  }

  private generateRoutes() {
    const handler = new RoutesHandler(this.roles)

    const accessedRoutes: RouteConfig[] = handler.generate(navRoutes)

    this.$router.addRoutes(accessedRoutes) // dynamic add routes
    return Promise.resolve({ routes: accessedRoutes, handler })
  }
}
