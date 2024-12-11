<template lang="pug">
  .paginate-tool
    span.text-body2 顯示&nbsp;&nbsp;

    q-btn-dropdown(
      outline
      unelevated
      color="grey-8"
      style="padding: 4px 5px 4px 8px; border-color: rgba(0, 0, 0, 0.25);"
      :ripple="false"
      :label="rowsPerPage")
      q-list
        q-item(
          v-for="(rows, id) in rowOptions"
          :key="`q-item-${id}`"
          clickable
          v-close-popup
          @click="$emit('change', rows)")
          q-item-section {{ rows }}

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { QList, QItem, QItemSection } from 'quasar'

@Component({
  components: {
    QList,
    QItem,
    QItemSection
  }
})
export default class PaginationSelection extends Vue {
  @Prop({ type: Number, default: 0 })
  readonly leng!: number

  @Prop({ type: Number, default: 15 })
  readonly rowsPerPage!: number

  get rowOptions(): number[] {
    const optionDefault = [50, 100, 500, 1000]
    let options = [15]

    if (this.leng === 0) return options

    options = options.concat(optionDefault.filter(num => num < this.leng))

    if (this.leng > options[0]) options.push(this.leng)

    return options
  }
}
</script>
