import { Prop, Component, Mixins } from 'vue-property-decorator'

import { FormContent } from '@src/types'

import ModuleMixin from '@core/mixin/moduleMixin'
import ModuleCacheMixin from '@core/mixin/moduleCacheMixin'

import moduleStore from './_store'
import FormCard from './_component/FormCard.vue'

@Component({
  components: {
    FormCard
  }
})
export default class FormContainer extends Mixins(
  ModuleMixin,
  ModuleCacheMixin
) {
  @Prop({ type: Boolean, default: true })
  readonly initFetch!: boolean

  @Prop({ type: Array, default: () => [] })
  readonly stepper!: object[]

  @Prop({ type: Boolean, default: true })
  readonly disableSave!: boolean

  @Prop({ type: Boolean, default: true })
  readonly linear!: boolean

  protected moduleName = 'form'
  protected moduleStore = moduleStore

  get step(): number {
    return this.$store.state[this.moduleName].formStep[this.id] || 1
  }

  get fetchStatus(): boolean {
    return this.$store.state[this.moduleName].inFetch
  }

  get formDataStore(): FormContent | null {
    const { id, dataSet } = this

    return dataSet[id] ? dataSet[id] : null
  }

  beforeMount() {
    if (this.initFetch && !this.moduleCached) {
      this.$emit('fetch', this.fetch)
    }
  }

  render() {
    const {
      disableSave,
      linear,
      step,
      stepper,
      id,
      formDataStore,
      fetchStatus,
      fetch,
      save,
      upload,
      setStep
    } = this

    const stepScopedSlots = stepper.reduce(
      (acc: any, stepConfig: any, index) => {
        acc[`form-step-${index + 1}`] = () => {
          if (this.$scopedSlots[`form-step-${index + 1}`]) {
            // @ts-ignore
            return this.$scopedSlots[`form-step-${index + 1}`]({
              id,
              step: index + 1,
              title: stepConfig.title,
              stepTo: (step: number) => setStep(step, id)
            })
          }
        }
        return acc
      },
      {}
    )

    return (
      // @ts-ignore
      <FormCard
        {...{
          props: {
            formId: id,
            linear,
            value: step,
            stepper,
            fetchStatus,
            disabled: disableSave
          },
          on: {
            stepTo: (step: number) => setStep(step, id),
            reset: () => {
              formDataStore !== null
                ? this.$emit('reset', { ...formDataStore })
                : this.$emit('reset', {})
            },
            save: () => {
              this.$emit('save', save)
            },
            upload: () => {
              this.$emit('upload', upload)
            }
          },
          scopedSlots: {
            'form-card-header': () => this.$slots['form-card-header'],
            'form-card-header-actions': () => {
              if (this.$scopedSlots['form-card-header-actions']) {
                return this.$scopedSlots['form-card-header-actions']({
                  fetch
                })
              }
            },
            'form-card-header-action': () => {
              if (this.$scopedSlots['form-card-header-action']) {
                return this.$scopedSlots['form-card-header-action']({
                  fetch
                })
              }
            },
            'form-card-toolbar': () => {
              if (this.$scopedSlots['form-card-toolbar']) {
                return this.$scopedSlots['form-card-toolbar']({
                  fetch
                })
              }
            },
            'form-field': () => {
              if (this.$scopedSlots['form-field']) {
                return this.$scopedSlots['form-field']({
                  id,
                  step,
                  stepTo: (step: number) => setStep(step, id),
                  fetch
                })
              }
            },
            'form-card-buttons': () => {
              if (this.$scopedSlots['form-card-buttons']) {
                return this.$scopedSlots['form-card-buttons']({
                  id,
                  step,
                  stepTo: (step: number) => setStep(step, id),
                  fetch,
                  save,
                  upload
                })
              }
            },
            'form-card-button-pre': () => {
              if (this.$scopedSlots['form-card-button-pre']) {
                return this.$scopedSlots['form-card-button-pre']({
                  id,
                  step,
                  stepTo: (step: number) => setStep(step, id)
                })
              }
            },
            'form-card-button': () => {
              if (this.$scopedSlots['form-card-button']) {
                return this.$scopedSlots['form-card-button']({
                  id,
                  step,
                  stepTo: (step: number) => setStep(step, id)
                })
              }
            },
            'form-card-footer': () => this.$slots['form-card-footer'],
            ...stepScopedSlots
          }
        }}
      />
    )
  }

  // 取得資料
  async fetch(url: string, params?: object): Promise<FormContent> {
    const { id } = this

    await this.$store.dispatch(`${this.moduleName}/fetch`, { id, url, params })

    return JSON.parse(
      JSON.stringify(this.$store.state[this.moduleName].dataSet[id])
    ) // deep clone
  }

  // 資料儲存
  async save(url: string, form: object): Promise<boolean> {
    const { id } = this

    await this.$store.dispatch(`${this.moduleName}/save`, {
      id,
      url,
      form
    })

    return Promise.resolve(true)
  }

  // 檔案上傳
  async upload(url: string, formData: FormData): Promise<boolean> {
    const { id } = this

    await this.$store.dispatch(`${this.moduleName}/upload`, {
      id,
      url,
      formData
    })

    return Promise.resolve(true)
  }

  setStep(step: number, id: string = this.id) {
    this.$store.dispatch(`${this.moduleName}/stepTo`, {
      id,
      step
    })
  }
}
