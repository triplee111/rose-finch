import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'

import cloneDeep from 'lodash/cloneDeep'
import { Route, NavigationGuardNext } from 'vue-router'

import { CacheConfig } from '@src/types'

@Component
export default class CacheMixin extends Vue {
  protected routePath: string = ''

  get dataCached() {
    const { dataCached } = this.$store.state.cached

    if (
      this.$options.name &&
      dataCached[this.routePath] &&
      dataCached[this.routePath][
        `${this.$options.name}-${this.$options.parent?.$options.name}`
      ]
    ) {
      return dataCached[this.routePath][
        `${this.$options.name}-${this.$options.parent?.$options.name}`
      ]
    }
    return null
  }

  created() {
    this.routePath = this.$route.fullPath

    if (this.dataCached) {
      this.recovery()
    } else {
      this.init()
    }
  }

  mounted() {
    if (!this.dataCached) {
      this.booted()
    }
  }

  destroyed() {
    this.cacheData()
    this.unsubscribe()
  }

  beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
    this.leaved(to.fullPath, from.fullPath)

    next()
  }

  protected init(): void {} // custom hook trigger after created when empty cache

  protected booted(): void {} // custom hook trigger after mounted empty cache

  protected leaved(_pathTo: string, _pathFrom: string): void {} // custom hook trigger before page view switched

  private recovery(): void {
    const dataCached = cloneDeep(this.dataCached)

    Object.assign(this.$data, dataCached)
  }

  private cacheData(): void {
    const payload: CacheConfig = {
      routePath: this.routePath,
      componentId: `${this.$options.name}-${this.$options.parent?.$options.name}`,
      data: this.$data
    }
    this.$store.dispatch('cached/cacheData', payload)
  }

  private unsubscribe: () => void = () => {}
}
