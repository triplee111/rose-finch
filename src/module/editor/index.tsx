// modules/editor/index.tsx

import { Prop, Component, Mixins } from 'vue-property-decorator'

import { EditorContent } from '@src/types'

import ModuleMixin from '@core/mixin/moduleMixin'
import ModuleCacheMixin from '@core/mixin/moduleCacheMixin'

import moduleStore from './_store'
import EditorCard from './_component/EditorCard.vue'

@Component({
  components: {
    EditorCard
  }
})
export default class EditorContainer extends Mixins(
  ModuleMixin,
  ModuleCacheMixin
) {
  @Prop({ type: Boolean, default: true })
  readonly initFetch!: boolean

  protected moduleName = 'editor'
  protected moduleStore = moduleStore

  get fetchStatus(): boolean {
    return this.$store.state[this.moduleName].inFetch
  }

  get editorContentStore(): EditorContent {
    const { id, dataSet } = this

    return dataSet[id] ? dataSet[id] : ''
  }

  beforeMount() {
    if (this.initFetch && !this.moduleCached) {
      this.$emit('fetch', this.fetch)
    }
  }

  render() {
    const { id, editorContentStore, fetchStatus, fetch, save } = this

    return (
      // @ts-ignore
      <EditorCard
        {...{
          props: {
            fetchStatus
          },
          on: {
            reset: () => {
              if (typeof editorContentStore === 'string') {
                this.$emit('reset')
              } else {
                this.$emit(
                  'reset',
                  JSON.parse(JSON.stringify(editorContentStore))
                ) // deep clone)
              }
            },
            save: () => {
              this.$emit('save', save)
            }
          },
          scopedSlots: {
            'editor-card-header': () => this.$slots['editor-card-header'],
            'editor-card-header-actions': () => {
              if (this.$scopedSlots['editor-card-header-actions']) {
                return this.$scopedSlots['editor-card-header-actions']({
                  fetch
                })
              }
            },
            'editor-card-toolbar': () => {
              if (this.$scopedSlots['editor-card-toolbar']) {
                return this.$scopedSlots['editor-card-toolbar']({
                  fetch
                })
              }
            },
            'text-editor': () => {
              if (this.$scopedSlots['text-editor']) {
                return this.$scopedSlots['text-editor']({
                  id,
                  fetch
                })
              }
            },
            'editor-card-buttons': () => {
              if (this.$scopedSlots['editor-card-buttons']) {
                return this.$scopedSlots['editor-card-buttons']({
                  id,
                  fetch,
                  save
                })
              }
            },
            'editor-card-footer': () => this.$slots['editor-card-footer']
          }
        }}
      />
    )
  }

  // 取得資料
  async fetch(url: string, params?: object): Promise<EditorContent | void> {
    const { id } = this

    await this.$store.dispatch(`${this.moduleName}/fetch`, { id, url, params })

    if (this.$store.state[this.moduleName].dataSet[id]) {
      return JSON.parse(
        JSON.stringify(this.$store.state[this.moduleName].dataSet[id])
      ) // deep clone
    }
    return
  }

  // 資料更新
  save(url: string, content: EditorContent): void {
    const { id } = this

    this.$store.dispatch(`${this.moduleName}/save`, {
      id,
      url,
      content
    })
  }
}
