// modules/excel/import/index.tsx

import { Prop, Component, Mixins } from 'vue-property-decorator'
import chunk from 'lodash/chunk'

import { DatatableModel } from '@src/types'

import ModuleMixin from '@core/mixin/moduleMixin'
import ModuleCacheMixin from '@core/mixin/moduleCacheMixin'

import moduleStore from '../_store/index'
import ImportStepper from './_component/ImportStepper.vue'

@Component({
  components: {
    ImportStepper
  }
})
export default class ExcelImportContainer extends Mixins(
  ModuleMixin,
  ModuleCacheMixin
) {
  @Prop({ type: String, default: 'Demo' })
  readonly demoFileName!: string

  @Prop({ type: String })
  readonly verifyUrl?: string

  @Prop({ type: String })
  readonly sendUrl?: string

  @Prop({ type: Object })
  readonly demoModel?: DatatableModel

  @Prop({ type: Array, default: (): [] => [] })
  readonly demoData!: Array<{ [propName: string]: any | null }>

  protected moduleName = 'excel'
  protected moduleStore = moduleStore

  private fileLoaded: boolean = false
  private verifedCount: number = -1

  get sheetModel() {
    const sheetModel = JSON.parse(JSON.stringify(this.demoModel))

    if (this.verifyUrl) {
      sheetModel.headers = sheetModel.headers.concat(['驗證結果', '驗證狀態'])
      sheetModel.columns = sheetModel.columns.concat([
        {
          name: 'verifyMessage',
          label: '驗證結果',
          field: 'verifyMessage',
          align: 'left',
          sortable: true
        },
        {
          name: 'verifyStatus',
          label: '驗證狀態',
          field: 'verifyStatus',
          align: 'left',
          hide: true
        }
      ])
    }

    return sheetModel
  }

  get sheetData(): Array<{ [prop: string]: any }> {
    return this.$store.state.excel.dataSet[this.id] || []
  }

  render() {
    const { id, verifyUrl, sheetData, fileLoaded, sheetModel, demoModel } = this

    return (
      // @ts-ignore
      <ImportStepper
        {...{
          props: {
            sheetData,
            isFileLoaded: fileLoaded,
            hasDemo: !!demoModel,
            hasVerify: !!verifyUrl,
            verified: this.verifedCount
          },
          on: {
            import: (files: File[]) => {
              this.importHandler(files)
            },
            download: () => {
              this.demoExportHandler()
            },
            reset: () => {
              this.fileLoaded = false
              this.verifedCount = -1
              this.$store.dispatch('excel/unset', [this.id])
            },
            verify: () => {
              this.sheetVerify()
            },
            send: () => {
              this.sendHandler()
            }
          },
          scopedSlots: {
            ['send-action']: () => {
              if (this.$scopedSlots['send-action']) {
                return this.$scopedSlots['send-action']({
                  id,
                  sheetData,
                  sheetModel
                })
              }
            },
            datatable: () => {
              if (this.$scopedSlots.datatable) {
                return this.$scopedSlots.datatable({
                  id,
                  sheetData,
                  sheetModel
                })
              }
            }
          }
        }}
      />
    )
  }

  private demoExportHandler() {
    require.ensure([], () => {
      if (!this.demoModel) return

      const {
        exportJson2Excel
      } = require('@src/utils/vendor/excel/Export2Excel.js')

      const { demoData, demoModel, demoFileName } = this
      const header = demoModel.headers.reduce(
        (acc: { [prop: string]: string }, label, index) => {
          const prop = demoModel.columns[index].field
          acc[prop] = label
          return acc
        },
        {}
      )

      exportJson2Excel(
        {
          fileName: demoFileName,
          header,
          data: demoData,
          bookType: 'xlsx'
        },
        false
      )
    })
  }

  private onLoad(sheetData: object[]) {
    this.fileLoaded = true

    if (this.verifyUrl) {
      sheetData = sheetData.map(row => ({
        ...row,
        verifyMessage: '',
        verifyStatus: ''
      }))
    }

    this.$store.dispatch('excel/set', {
      id: this.id,
      sheetData
    })
  }

  private importHandler(files: File[]) {
    if (!this.demoModel) return

    const { columns } = this.demoModel
    const header = columns.reduce((acc, column) => {
      acc.push(column.name)
      return acc
    }, [])

    require.ensure([], () => {
      const { importExcel } = require('@src/utils/vendor/excel/ExcelImport.js')

      importExcel(
        files,
        {
          onload: this.onLoad
        },
        header
      )
    })
  }

  private sendHandler() {
    const { id, sendUrl } = this
    this.$store.dispatch('excel/send', { id, url: sendUrl })
  }

  private async sheetVerify() {
    const { sheetData } = this
    const chunkNums = 300
    const sheetDataChunk = chunk(sheetData, chunkNums)

    let chunkId = 0

    this.verifedCount = 0

    for (const dataChunk of sheetDataChunk) {
      await this.batchVerify(dataChunk, chunkId * chunkNums)

      chunkId++
    }
  }

  private async batchVerify(dataChunk: object[], chunkIdFrom: number) {
    const { id, verifyUrl } = this
    const batchVerifyNums = 20
    const rowsChunk = chunk(dataChunk, batchVerifyNums)

    rowsChunk.forEach(async (rows: object[], rowsId: number) => {
      await this.$store.dispatch(`excel/verify`, {
        id,
        url: `${verifyUrl}/${rowsId * batchVerifyNums + chunkIdFrom}`,
        rows
      })

      this.verifedCount += rows.length
    })

    await this.batchEnd(9000) // TODO: 目前為固定值，希望能修改為真正的
  }

  private batchEnd(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
  }
}
