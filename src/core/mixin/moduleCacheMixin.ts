// core/mixin/moduleCacheMixin.ts

import { Component, Vue } from 'vue-property-decorator'

import { ModuleCacheConfig } from '@src/types'

@Component
export default class ModuleCacheMixin extends Vue {
  protected routePath: string = ''

  get moduleCached() {
    const { moduleCached } = this.$store.state.cached

    return moduleCached[this.routePath] &&
      moduleCached[this.routePath][this.$data.moduleName]
      ? moduleCached[this.routePath][this.$data.moduleName]
      : null
  }

  created() {
    this.routePath = this.$route.fullPath

    if (this.moduleCached) {
      this.recovery()
    }
  }

  beforeDestroy() {
    this.cacheModule()
  }

  protected async recovery(): Promise<void> {
    const moduleId: string = this.moduleCached.shift()

    Object.assign(this.$data, { id: moduleId })

    await this.$store.dispatch('cached/removeModuleId', {
      routePath: this.routePath,
      moduleName: this.$data.moduleName,
      moduleId
    })
  }

  protected cacheModule(): void {
    const payload: ModuleCacheConfig = {
      routePath: this.routePath,
      moduleName: this.$data.moduleName,
      moduleId: this.$data.id
    }
    this.$store.dispatch('cached/cacheModuleId', payload)
  }
}
