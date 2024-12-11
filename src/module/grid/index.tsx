// modules/grid/index.tsx

import { Prop, Component, Mixins } from 'vue-property-decorator'

import { GridList } from '@src/types'

import ModuleMixin from '@core/mixin/moduleMixin'
import ModuleCacheMixin from '@core/mixin/moduleCacheMixin'

import moduleStore from './_store'
import GridCard from './_component/GridCard.vue'

@Component({
  components: {
    GridCard
  }
})
export default class GridContainer extends Mixins(
  ModuleMixin,
  ModuleCacheMixin
) {
  @Prop({ type: Boolean, default: false })
  readonly initFetch!: boolean

  protected moduleName = 'grid'
  protected moduleStore = moduleStore

  get fetchStatus(): boolean {
    return this.$store.state[this.moduleName].inFetch
  }

  get gridDataStore() {
    const { id, dataSet } = this

    return dataSet[id] ? dataSet[id] : []
  }

  beforeMount() {
    if (this.initFetch && !this.moduleCached) {
      this.$emit('fetch', this.fetch)
    }
  }

  render() {
    const { id, gridDataStore, fetchStatus, fetch, del } = this
    return (
      // @ts-ignore
      <GridCard
        {...{
          props: {
            gridId: id,
            fetchStatus
          },
          on: {
            reset: () => {
              this.$emit('reset', JSON.parse(JSON.stringify(gridDataStore)))
            },
            refresh: () => {
              this.$emit('fetch', fetch)
            }
          },
          scopedSlots: {
            'grid-card-header': () => this.$slots['grid-card-header'],
            'grid-card-header-actions': () => {
              if (this.$scopedSlots['grid-card-header-actions']) {
                return this.$scopedSlots['grid-card-header-actions']({
                  fetch
                })
              }
            },
            'grid-card-header-action': () => {
              if (this.$scopedSlots['grid-card-header-action']) {
                return this.$scopedSlots['grid-card-header-action']({
                  fetch
                })
              }
            },
            'grid-card-toolbar': () => {
              if (this.$scopedSlots['grid-card-toolbar']) {
                return this.$scopedSlots['grid-card-toolbar']({
                  fetch
                })
              }
            },
            datatable: () => {
              if (this.$scopedSlots.datatable) {
                return this.$scopedSlots.datatable({
                  id,
                  fetch,
                  del
                })
              }
            },
            'grid-card-footer': () => this.$slots['grid-card-footer']
          }
        }}
      />
    )
  }

  // 取得遠端列表資料
  async fetch(url: string, params?: object): Promise<GridList | void> {
    const { id } = this

    await this.$store.dispatch(`${this.moduleName}/fetch`, { id, url, params })

    if (this.$store.state[this.moduleName].dataSet[id]) {
      return JSON.parse(
        JSON.stringify(this.$store.state[this.moduleName].dataSet[id])
      ) // deep clone
    }
    return
  }

  async del(url: string, params?: object): Promise<void> {
    await this.$store.dispatch(`${this.moduleName}/delete`, { url, params })

    this.$emit('fetch', this.fetch)
  }
}
