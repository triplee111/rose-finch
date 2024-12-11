<template lang="pug">
  QInput(
    v-model="filterValue"
    hide-hint
    hint="搜尋字串長度至少為 3"
    dense)

    template(v-slot:before)
      span(style="font-size: 0.8rem;") &nbsp;Filter :

    template(v-slot:append)
      QIcon(
        @click="filterClear"
        v-show="filterValue"
        v-b-tooltip.hover
        title="過濾重設"
        name="clear"
        style="cursor: pointer")
      QIcon(
        v-show="!filterValue"
        name="search")

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { QIcon } from 'quasar'

@Component({
  components: {
    QIcon
  }
})
export default class FilterValueInput extends Vue {
  @Prop({ type: String })
  readonly value!: string

  private filterValue: string = ''

  @Watch('filterValue')
  onFilterValueChanged(value: string) {
    this.$emit('input', value)
  }

  mounted() {
    this.filterValue = this.value
  }

  private filterClear() {
    this.filterValue = ''
  }
}
</script>
