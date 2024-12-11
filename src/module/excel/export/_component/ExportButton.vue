<template lang="pug">
  QBtn(
    unelevated
    push
    icon="file_copy"
    :size="size"
    :color="color"
    :label="label"
    @click.prevent="$emit('export')")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'

@Component
export default class ExportButton extends Vue {
  @Prop({ type: String, required: true })
  readonly label!: string

  @Prop({ type: String, required: true })
  readonly color!: string

  @Prop({ type: String, required: true })
  readonly size!: string
}
</script>
