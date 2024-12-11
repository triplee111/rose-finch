<template lang="pug">
  BaseCard
    template(v-slot:card-header)
      slot(name="grid-card-header")

    template(v-slot:card-header-actions)
      slot(name="grid-card-header-actions")

        slot(name="grid-card-header-action")

        a.card-header-action.refresh(
          v-b-tooltip.hover
          title="回復初始值"
          href="#"
          @click.prevent="$emit('reset')")
          i.fa.fa-repeat.fa-fw(
            aria-hidden="true")

        a.card-header-action.refresh(
          v-b-tooltip.hover
          title="更新資料"
          href="#"
          @click.prevent="$emit('refresh')")
          i.fa.fa-refresh.fa-fw(
            :class="{ rotating: fetchStatus }"
            aria-hidden="true")

    .card-body-sec
      slot(name="grid-card-toolbar")

    .card-body-sec
      slot(name="datatable")

    slot(name="grid-card-footer")

    //- Gears loading spinner
    QInnerLoading(:showing="fetchStatus")
      QSpinnerGears(
        size="2rem"
        color="primary")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'

import { QInnerLoading, QSpinnerGears } from 'quasar'

import { DatatableModel } from '@src/types'

@Component({
  components: {
    QInnerLoading,
    QSpinnerGears
  }
})
export default class GridCard extends Vue {
  @Prop({ type: String, default: '' })
  readonly gridId!: string

  @Prop({ type: Boolean, default: false })
  readonly fetchStatus!: boolean
}
</script>
