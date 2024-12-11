// core/mixin/moduleMixin.ts

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ModuleMixin extends Vue {
  protected moduleName: string = 'module'
  protected moduleStore: object = {}

  protected id: string = ''

  get dataSet() {
    return this.$store.state[this.moduleName] &&
      this.$store.state[this.moduleName].dataSet
      ? this.$store.state[this.moduleName].dataSet
      : {}
  }

  created() {
    this.id = `${this.moduleName}-${this.generateId()}`
    this.install()
  }

  protected install() {
    const store = this.$store

    if (
      (store.state && store.state[this.moduleName]) ||
      Object.keys(this.moduleStore).length === 0
    ) {
      return
    }

    store.registerModule(this.moduleName, this.moduleStore)
  }

  protected generateId(): string {
    return (
      Math.random()
        .toString(36)
        .substring(2, 5) +
      Math.random()
        .toString(36)
        .substring(2, 5)
    )
  }
}
