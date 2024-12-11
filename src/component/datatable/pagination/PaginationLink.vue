<template lang="pug">
  .paginate-link(v-show="paginateLinks.length")
    //- Prev direction
    a.paginate-btn.previous(
      href="#"
      :class="{ 'disabled': pageCurrent === 1 }"
      @click.prevent="prev(1)") ←

    //- Paginate links
    a.paginate-btn.text-body2(
      v-for="(n, i) in paginateLinks"
      href="#"
      :class="{ current: n !== '...' && pageCurrent === parseInt(n, 10) }"
      @click.prevent="changeTo(n, i)")
      span {{ n }}

    //- Next direction
    a.paginate-btn.next(
      href="#"
      :class="{ 'disabled': pageCurrent === pages }"
      @click.prevent="next(1)") →

</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component
export default class PaginationLink extends Vue {
  @Prop({ type: Number, default: 1 })
  readonly pages!: number

  @Prop({ type: Number, default: 1 })
  readonly page!: number

  @Prop({ type: Array, default: (): [] => [] })
  readonly data!: Array<{ [propName: string]: any | null }>

  @Prop({ type: Number, default: 15 })
  readonly rowsPerPage!: number

  private pageCurrent: number = 1
  private maxLinkNums: number = 7 // 最多顯示的連結數
  private paginateLinks: string[] = []

  @Watch('page', { immediate: true })
  onPageChanged(page: number) {
    this.pageCurrent = page
  }

  @Watch('pages', { immediate: true })
  onPagesChanged() {
    const { pageCurrent } = this
    this.setPageLinks(pageCurrent)
  }

  @Watch('pageCurrent')
  onPageCurrentChanged(pageCurrent: number) {
    this.$emit('change', pageCurrent)
    this.setPageLinks(pageCurrent)
  }

  mounted() {
    window.addEventListener('keydown', this.setPageKey, false)
  }

  beforeDestroy() {
    window.removeEventListener('keydown', this.setPageKey, false)
  }

  private setPageLinks(page: number) {
    const { pages, maxLinkNums } = this

    let headSec = [] // 頁面連結前段
    let tailSec = [] // 頁面連結中段
    let bodySec = [] // 頁面連結後段

    const pageStr = page.toString()
    let index = -1

    if (pages <= maxLinkNums) {
      return (this.paginateLinks = Array.from(Array(pages).keys()).map(n =>
        (n + 1).toString()
      ))
    }

    headSec = Array.from(Array(6).keys()).map(n => (n + 1).toString())
    index = headSec.indexOf(pageStr)

    if (index !== -1 && index !== 5) {
      return (this.paginateLinks = headSec.concat(['...', pages.toString()]))
    }

    tailSec = Array.from(Array(6).keys()).map(n => (n + pages - 5).toString())
    index = tailSec.indexOf(pageStr)

    if (index !== -1 && index !== 0) {
      return (this.paginateLinks = ['1', '...'].concat(tailSec))
    }

    bodySec = Array.from(Array(5).keys()).map(n => (n + page - 2).toString())
    return (this.paginateLinks = ['1', '...']
      .concat(bodySec)
      .concat(['...', pages.toString()]))
  }

  // 指向連結頁面
  private changeTo(num: string, index: number): void {
    if (num === '...') {
      index === 1 ? this.prev(3) : this.next(3)
      return
    }

    this.pageCurrent = parseInt(num, 10)
  }

  // 上一頁
  private prev(num: number): void {
    if (this.pageCurrent === 1) return
    this.pageCurrent -= num
  }

  // 下一頁
  private next(num: number): void {
    if (this.pageCurrent === this.pages) return

    this.pageCurrent += num
  }

  // 設定方向鍵
  private setPageKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      this.next(1)
    } else if (e.key === 'ArrowLeft') {
      this.prev(1)
    }
  }
}

// TODO: MOVE TO HANSONTABLE COMPONENT
// @Prop({ type: Object, required: true })
// readonly model!: DatatableModel

// TODO: MOVE TO HANSONTABLE COMPONENT
// summaryRow: { [propName: string]: any } = {}

// TODO: MOVE TO HANSONTABLE COMPONENT
// @Watch('data', { immediate: true, deep: true })
// onDataChanged(arrayObj: object[]) {
//   if (arrayObj && arrayObj.length) {
//     this.summaryRow = this.getSummaryRow()
//   }
// }

// TODO: MOVE TO HANSONTABLE COMPONENT
// 取得統計列
// private getSummaryRow(): { [propName: string]: any } {
//   const columnSummaryRow: { [propName: string]: any } = {}

//   let prop: string = ''

//   this.model.columns.forEach((column, key) => {
//     prop = column.data

//     if (key === 0) {
//       columnSummaryRow[prop] = '總計'
//     }

//     if (column.hasOwnProperty('sum')) {
//       let sum = 0

//       for (const obj of this.data) {
//         if (obj.hasOwnProperty(prop)) {
//           sum += parseInt(obj[prop], 10)
//         }
//       }

//       columnSummaryRow[prop] = sum
//     }
//   })

//   return columnSummaryRow
// }
</script>

<style lang="stylus" scoped>
.paginate-link
  a
    &.paginate-btn
      display inline-block
      padding 0.3rem 0
      min-width 2rem
      margin-left 0.125rem
      text-align center
      text-decoration none
      cursor pointer
      color #333
      outline 0
      border 1px solid transparent
      border-radius 0.1875rem
      transition all ease-in-out 0.1s

      &:hover
        background-color #f5f5f5

      &.disabled
        background-color #fff
        color #999

      &.current
        color #fff
        background-color #37474f
</style>
