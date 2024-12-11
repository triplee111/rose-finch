// modules/excel/export/index.tsx

import { Prop, Component, Vue } from 'vue-property-decorator'

import { DatatableModel } from '@src/types'
import ExportButton from './_component/ExportButton.vue'

@Component({
  components: {
    ExportButton
  }
})
export default class ExcelExportContainer extends Vue {
  @Prop({ type: String, default: '表單匯出' })
  readonly label!: string

  @Prop({ type: String, default: 'info' })
  readonly color!: string

  @Prop({ type: String, default: 'md' })
  readonly size!: string

  @Prop({ type: String, default: 'export' })
  readonly fileName!: string

  @Prop({ type: Object, required: true })
  readonly model!: DatatableModel

  @Prop({ type: Array, default: (): [] => [] })
  readonly data!: Array<{ [propName: string]: any | null }>

  @Prop({ type: String, default: 'icon' })
  readonly type!: string

  @Prop({ type: Array, default: (): [] => [] })
  readonly filter!: string[]

  render() {
    const { type, label, color, size } = this

    if (type === 'button') {
      return (
        // @ts-ignore
        <ExportButton
          {...{
            props: {
              label,
              color,
              size
            },
            on: {
              export: () => {
                this.exportHandler()
              }
            }
          }}
        />
      )
    }

    return (
      <a
        class="card-header-action export"
        title={label}
        href="#"
        v-b-tooltip={{ modifiers: { hover: true } }}
        {...{
          on: {
            click: (ev: Event) => {
              ev.preventDefault()
              this.exportHandler()
            }
          }
        }}
      >
        <i class="fa fa-file-excel-o fa-fw" aria-hidden="true" />
      </a>
    )
  }

  private exportHandler() {
    require.ensure([], () => {
      const {
        exportJson2Excel
      } = require('@src/utils/vendor/excel/Export2Excel.js')

      const { data, fileName, model, filter } = this
      const header = model.headers.reduce(
        (acc: { [prop: string]: string }, label, index) => {
          if (model.columns[index]) {
            const prop = model.columns[index].field
            acc[prop] = label
          }
          return acc
        },
        {}
      )

      const time = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '')

      const jsonData = filter.length
        ? data.map(record => this.filter.map(col => record[col]))
        : data

      exportJson2Excel({
        fileName: `${time}_${fileName}`,
        header,
        data: jsonData,
        bookType: 'xlsx'
      })
    })
  }
}
