<template lang="pug">
  .table-wrapper
    QTable(
      row-key="index"
      flat
      binary-state-sort
      no-data-label="尚無資料"
      no-results-label="查無資料"
      :ref="gid"
      :data="dataCopy"
      :columns="model.columns"
      :pagination.sync="pagination"
      :dense="$q.screen.lt.md"
      :filter="filterLocal"
      :filter-method="filterMethodLocal"
      :visible-columns="visibleColumns"
      :selection="selection"
      :selected.sync="selected"
      @selection="selectEvent")

      template(
        v-for="column in model.columns"
        v-slot:[`body-cell-${column.name}`]="{ row, rowIndex, col, value }")

        QTd(
          :auto-width="column.autoWidth"
          :style="getStyle(col)")
          slot(
            :name="`col-${column.name}`"
            :row="row"
            :rowIndex="rowIndex"
            :col="col"
            :value="value")
            | {{ value }}

      template(v-slot:top-left)
        slot(name="top-left")
          .flex.flex-center.q-gutter-x-lg
            slot(name="top-left-prepend")

            //- 數值過濾器
            FilterValueInput(v-model="filterValue")

            slot(name="top-left-append")

      template(v-slot:top-right="{ pagination, inFullscreen, toggleFullscreen }")
        slot(name="top-right")
          .flex.flex-center.q-gutter-x-lg.q-mr-lg(v-show="dataLength")
            slot(name="top-right-prepend")

            //- 欄位顯示器
            FilterVisibleMenu(
              v-model="visibleColumns"
              :columns="model.columns")

            //- 分頁數選擇
            PaginationSelection.q-pb-sm(
              :leng="data.length"
              :rowsPerPage="pagination.rowsPerPage"
              @change="changeRows")

            .q-pb-sm
              QBtn(
                v-b-tooltip.hover
                title="全螢幕設定/取消"
                flat
                round
                dense
                :icon="inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="toggleFullscreen")

            slot(name="top-right-append")

      template(v-slot:bottom="{ pagination, pagesNumber }")
        .col
          .flex.inline.flex-center.q-my-md.q-py-sm
            span.text-body2 總資料數共 {{ dataLength }} 筆&nbsp;&nbsp;顯示 {{ idFrom }} 至 {{ idEnd(pagesNumber) }} 筆
            span.text-body2.q-ml-sm {{ selectedString }}

          .flex.flex-center.float-right.q-gutter-x-lg.q-mr-lg.q-my-md

            //- 跳頁輸入
            PaginationJumper(
              :page="pagination.page"
              :maxPageNums="pagesNumber"
              @change="changePage")

            //- 分頁連結
            PaginationLink(
              :pages="pagesNumber"
              :page="pagination.page"
              :rowsPerPage="pagination.rowsPerPage"
              @change="changePage")

</template>

<script lang="ts">
import chunk from 'lodash/chunk'
import { QTable, QTh, QTr, QTd, QPagination } from 'quasar'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { DatatableModel, QTableColumn } from '@src/types'

import PaginationLink from './pagination/PaginationLink.vue'
import PaginationSelection from './pagination/PaginationSelection.vue'
import PaginationJumper from './pagination/PaginationJumper.vue'

import FilterVisibleMenu from './filter/FilterVisibleMenu.vue'
import FilterValueInput from './filter/FilterValueInput.vue'

import filterGrid from '@src/utils/helper/gird-data-filter' // filter function using ramda

@Component({
  inheritAttrs: false,
  model: {
    event: 'update'
  },
  components: {
    QTable,
    QTh,
    QTr,
    QTd,
    QPagination,
    PaginationLink,
    PaginationSelection,
    PaginationJumper,
    FilterVisibleMenu,
    FilterValueInput
  }
})
export default class QuasarTable extends Vue {
  @Prop({ type: Array, default: () => [] })
  readonly value!: any[]

  @Prop({ type: Object })
  readonly dataCached!: object

  @Prop({ type: String, default: 'handsonList' })
  readonly gid!: string

  @Prop({ type: Object, required: true, default: { headers: [], columns: [] } })
  readonly model!: DatatableModel

  @Prop({ type: Array, default: (): [] => [] })
  readonly data!: Array<{ [propName: string]: any | null }>

  @Prop({ type: Object })
  readonly paginateConfig: QTable['pagination']

  @Prop({ type: String, default: 'none' })
  readonly selection!: string

  @Prop({ default: '' })
  readonly filter!: string | { [prop: string]: any }

  @Prop({ type: Function })
  readonly filterMethod?: () => {}

  private pagination: QTable['pagination'] = {
    page: 1,
    rowsPerPage: 15
  }

  private filterValue: string = ''
  private dataFiltered: object[] = []
  private visibleColumns: string[] = []

  private selected: any[] = []

  get dataCopy(): Array<{ [propName: string]: any | null }> {
    const data = JSON.parse(JSON.stringify(this.data))

    data.forEach(({}, index: number) => {
      data[index].index = index + 1
    })

    return data
  }

  get dataLength(): number {
    const { dataCopy, dataFiltered } = this
    return dataFiltered.length ? dataFiltered.length : dataCopy.length
  }

  get dataPaged(): object[][] {
    const { dataCopy, dataFiltered, pagination } = this
    const dataSet = dataFiltered.length ? dataFiltered : dataCopy
    return chunk(dataSet, pagination!.rowsPerPage)
  }

  get idFrom(): number {
    const { pagination } = this
    const pageCurrent = pagination!.page!
    const rowsPerPage = pagination!.rowsPerPage!

    return (pageCurrent - 1) * rowsPerPage + 1
  }

  get selectedString(): string {
    return this.selected.length === 0 ? '' : `已選取 ${this.selected.length} 筆`
  }

  get filterLocal(): string | { [prop: string]: any } {
    return this.filter ? this.filter : this.filterValue
  }

  get filterMethodLocal() {
    return this.filterMethod ? this.filterMethod : this.customFilter
  }

  @Watch('model')
  onModelChanged(model: DatatableModel) {
    if (model.columns.length) {
      this.pagination = {
        ...this.pagination,
        page: 1,
        rowsPerPage: 15,
        sortBy: model.columns[0].name
      }

      this.visibleColumns = model.columns.map(column => column.name)
    }
  }

  @Watch('filterValue')
  onFilterValueChanged(terms: string) {
    if (Array.from(terms).length < 3) {
      this.dataFiltered = []
    }
  }

  @Watch('value', { immediate: true })
  onSelectedChanged(value: any[]) {
    if (value.length) {
      this.selected = value
    } else {
      this.selected = []
    }
  }

  created() {
    this.$once('hook:beforeDestroy', this.cacheData)

    const { paginateConfig, dataCached } = this

    if (this.model.columns.length) {
      this.pagination = {
        ...this.pagination,
        sortBy: this.model.columns[0].name
      }

      this.visibleColumns = this.model.columns.reduce((acc, column) => {
        if (!column.hide) acc.push(column.name)

        return acc
      }, [])
    }

    dataCached && Object.keys(dataCached).length
      ? Object.assign(this.$data, JSON.parse(JSON.stringify(dataCached)))
      : (this.pagination = { ...this.pagination, ...paginateConfig })
  }

  private idEnd(pages: number): number {
    const { idFrom, dataPaged, pagination } = this
    const pageCurrent = pagination!.page!
    const rowsPerPage = pagination!.rowsPerPage!

    return pageCurrent === pages
      ? idFrom + dataPaged[pageCurrent - 1].length - 1 // 最後一頁時
      : pageCurrent * rowsPerPage
  }

  private changePage(page: number) {
    const { gid } = this
    const qtable = this.$refs[gid] as QTable

    qtable.setPagination({
      page
    })
  }

  private changeRows(rows: number) {
    const { pagination } = this

    this.pagination = {
      ...pagination,
      rowsPerPage: rows
    }
  }

  private getStyle({ style, align }: QTableColumn): string {
    if (style) return `${style}, text-align: ${align}`
    return `text-align: ${align}`
  }

  private customFilter([], terms: string): object[] {
    const data = JSON.parse(JSON.stringify(this.data))

    terms = terms.trim()

    if (Array.from(terms).length >= 3) {
      this.dataFiltered = filterGrid(terms)(data)

      return this.dataFiltered
    }

    return data
  }

  private cacheData() {
    this.$emit('cache', { ...this.$data })
  }

  private selectEvent({ rows, added }: { [prop: string]: any }) {
    if (added) {
      this.selected = [...this.selected, ...rows]
    } else {
      if (rows.length > 1) {
        this.selected = []
      } else {
        const index = this.selected.findIndex(
          record => record.account === rows[0].account
        )
        this.selected.splice(index, 1)
      }
    }

    this.$emit('update', this.selected)
  }
}
</script>

<style lang="stylus">
.table-wrapper
  margin 0 -1.25rem
  max-width 100%

  .q-table__top
    padding 8px 16px 0

  .q-field--with-bottom
    padding-bottom 10px

  .q-table
    tr
      th
      td
        &:first-child
          padding-left 1.25rem

    thead
      border-color rgba(0, 0, 0, 0.25)
      border-top 1px solid rgba(0, 0, 0, 0.1)

    tbody
      tr
        &:nth-child(even)
          background-color #fbfbfb

          &:hover
            background-color #f5f5f5

        &:nth-child(odd)
          &:hover
            background-color #f5f5f5

      td
        font-size 0.85rem
        height 42px
</style>
