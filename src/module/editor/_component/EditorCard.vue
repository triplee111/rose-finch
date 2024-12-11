<template lang="pug">
  BaseCard
    template(v-slot:card-header)
      slot(name="editor-card-header")

    template(v-slot:card-header-actions)
      slot(name="editor-card-header-actions")

        slot(name="editor-card-header-action")

        a.card-header-action.refresh(
          v-b-tooltip.hover
          title="回復預設"
          href="#"
          @click.prevent="$emit('reset')")
          i.fa.fa-repeat.fa-fw(
            aria-hidden="true")

    .card-body-sec.q-my-xs
      q-form.q-gutter-x-md
        slot(name="editor-card-toolbar")

    .card-body-sec
      slot(name="text-editor")

    .card-body-sec.q-my-lg.flex.flex-center.q-gutter-x-lg
      slot(name="editor-card-buttons")
        QBtn(
          unelevated
          push
          icon="save"
          size="md"
          color="primary"
          label="儲存文案"
          @click.prevent="$emit('save')")

        QBtn(
          unelevated
          push
          icon="note"
          size="md"
          color="accent"
          label="回復預設"
          @click.prevent="$emit('reset')")

    slot(name="editor-card-footer")

    //- Gears loading spinner
    QInnerLoading(:showing="fetchStatus")
      QSpinnerGears(
        size="2rem"
        color="primary")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'

import { QInnerLoading, QSpinnerGears, QSeparator } from 'quasar'

@Component({
  components: {
    QInnerLoading,
    QSpinnerGears,
    QSeparator
  }
})
export default class EditorCard extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly fetchStatus!: boolean
}
</script>
