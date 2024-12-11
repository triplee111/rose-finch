<template lang="pug">
  QSelect(
    v-model="visibleColumns"
    color="blue-grey-3"
    display-value="欄位顯示/隱藏"
    outlined
    multiple
    dense
    emit-value
    option-label="label"
    option-value="name"
    :options="visibleOptions"
    popup-content-class="field-visible-option")

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import remove from 'lodash/remove'
import cloneDeep from 'lodash/cloneDeep'

import { QTableColumn } from '@src/types'

@Component
export default class FilterFieldVisible extends Vue {
  @Prop({ type: Array, default: (): [] => [] })
  readonly columns!: QTableColumn[]

  @Prop({ type: Array, default: (): [] => [] })
  readonly value!: string[]

  get visibleColumns(): string[] {
    return [...this.value]
  }
  set visibleColumns(columns: string[]) {
    this.$emit('input', columns)
  }

  get visibleOptions(): object[] {
    const columns = cloneDeep(this.columns)

    remove(columns, column => column.required)

    return columns
  }
}
</script>

<style lang="stylus">
.field-visible-option
  .q-item
    color rgba(0, 0, 0, 0.5)

  .q-item--active
    color inherit
</style>
