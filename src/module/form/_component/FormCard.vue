<template lang="pug">
  BaseCard
    template(v-slot:card-header)
      slot(name="form-card-header")

    template(v-slot:card-header-actions)
      slot(name="form-card-header-actions")

        slot(name="form-card-header-action")

        a.card-header-action.refresh(
          v-b-tooltip.hover
          title="回復預設"
          href="#"
          @click.prevent="$emit('reset')")
          i.fa.fa-repeat.fa-fw(
            aria-hidden="true")

    .card-body-sec.q-my-xs
      QForm.q-gutter-x-md
        slot(name="form-card-toolbar")

    .card-body-sec
      QStepper(
        v-model="step"
        :ref="`stepper-${formId}`"
        header-nav
        flat
        done-color="primary"
        active-color="blue-grey-9"
        inactive-color="grey-6"
        @input="val => { this.$emit('step', val) }")

        template(v-for="(s, id) in stepper")
          QStep(
            :name="id + 1"
            :title="s.title"
            :icon="s.icon"
            :error="s.error && step > id"
            :done="s.done"
            :header-nav="linear ? s.done : true")

            slot(:name="`form-step-${id + 1}`")

    .card-body-sec
      slot(name="form-field")

    QSeparator.q-mt-sm

    .card-body-sec.q-my-lg.flex.flex-center.q-gutter-x-lg
      slot(name="form-card-button-pre")

      slot(name="form-card-buttons")
        QBtn(
          unelevated
          push
          icon="save"
          size="md"
          color="primary"
          label="儲存設定"
          :disable="disabled"
          @click.prevent="$emit('save')")

        QBtn(
          unelevated
          push
          icon="note"
          size="md"
          color="accent"
          label="回復預設"
          @click.prevent="$emit('reset')")

      slot(name="form-card-button")

    slot(name="form-card-footer")

    //- Gears loading spinner
    QInnerLoading(:showing="fetchStatus")
      QSpinnerGears(
        size="2rem"
        color="primary")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'

import {
  QStepper,
  QStep,
  QSeparator,
  QInnerLoading,
  QSpinnerGears
} from 'quasar'

@Component({
  components: {
    QStepper,
    QStep,
    QSeparator,
    QInnerLoading,
    QSpinnerGears
  }
})
export default class FormCard extends Vue {
  @Prop({ type: String, default: '' })
  readonly formId!: string

  @Prop({ type: Boolean, default: true })
  readonly linear!: boolean

  @Prop({ type: Number, default: 1 })
  readonly value!: number

  @Prop({ type: Array, default: {} })
  readonly stepper!: object[]

  @Prop({ type: Boolean, default: false })
  readonly fetchStatus!: boolean

  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean

  get step() {
    return this.value
  }
  set step(value) {
    this.$emit('stepTo', value)
  }
}
</script>
