<template lang="pug">
  .paginate-tool.flex.flex-center.q-gutter-x-sm
    span.text-body2 頁碼
    q-pagination.page-input-field(
      v-model="pageCurrent"
      boundary-numbers
      input
      input-class="text-grey-10 text-weight-medium q-py-lg"
      :direction-links="false"
      :boundary-links="false"
      :max="maxPageNums"
      @input="$emit('change', pageCurrent)")

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { QPagination } from 'quasar'

@Component({
  components: {
    QPagination
  }
})
export default class PaginationJumper extends Vue {
  @Prop({ type: Number, default: 1 })
  readonly page!: number

  @Prop({ type: Number, default: 20 })
  readonly maxPageNums!: number

  private pageCurrent: number = 1

  @Watch('page', { immediate: true })
  onPageChanged(page: number) {
    if (page !== this.pageCurrent) {
      this.pageCurrent = page
    }
  }
}
</script>

<style lang="stylus">
.page-input-field
  border 1px solid rgba(0, 0, 0, 0.25)
  padding 0 0.75rem
  height 30px

  input
    &::placeholder
      color rgba(0, 0, 0, 0.6)
</style>
