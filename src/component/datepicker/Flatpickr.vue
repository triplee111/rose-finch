<template lang="pug">
  QField.inline(
    dense
    clearable)
    input.flatpickr.flatpickr-input(
      v-flatpickr="initConfig"
      v-model="duration"
      v-bind="$attrs"
      :class="{ mode: mode === 'range' }"
      type="text"
      readonly)

    template(v-slot:prepend)
      i.fa.fa-calendar-check-o.text-subtitle1.text-primary.q-px-xs(aria-hidden)
      slot(name="prepend")

    template(v-slot:append)
      slot(name="append")

      QIcon.cursor-pointer(
        title="clear"
        size="sm"
        name="close"
        @click.self="clear")

</template>

<script lang="ts">
import 'flatpickr/dist/flatpickr.min.css'

import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

// @ts-ignore
import moment from 'moment/min/moment.min.js'

import flatpickr from 'flatpickr'
import { MandarinTraditional } from 'flatpickr/dist/l10n/zh-tw.js'

const configDefault: flatpickr.Options.Options = {
  enableSeconds: true,
  enableTime: true,
  time_24hr: true,
  dateFormat: 'Y-m-d H:i:S',
  locale: {
    ...MandarinTraditional,
    rangeSeparator: ' - '
  }
}

@Component({
  model: {
    event: 'update'
  },
  directives: {
    flatpickr: {
      inserted(el, binding, vnode) {
        if (!vnode || !vnode.context || vnode.context.$data.fp) return

        vnode.context.$data.fp = flatpickr(el, binding.value)
      },
      update(el, {}, vnode) {
        if (vnode.data && vnode.data.domProps && vnode.data.domProps.value) {
          el.style.width = (vnode.data.domProps.value.length + 1) * 8 + 'px'
        } else {
          el.style.removeProperty('width')
        }
      }
    }
  }
})
export default class Flatpickr extends Vue {
  @Prop({ type: Array, default: () => [] })
  readonly value!: string[]

  @Prop({ type: String, default: 'single' })
  readonly mode!: 'single' | 'multiple' | 'range' | 'time'

  @Prop({ type: Object, default: (): {} => ({}) })
  readonly config!: flatpickr.Options.Options

  private fp: flatpickr.Instance | null = null
  private duration: string = ''

  get initConfig(): flatpickr.Options.Options {
    const { mode, config } = this

    return {
      ...configDefault,
      ...config,
      mode
    }
  }

  @Watch('duration')
  onDurationChanged(duration: string) {
    if (duration === '') {
      this.$emit('update', [])

      return
    }

    if (this.fp && this.fp.selectedDates.length === 2) {
      const datesMap = this.fp.selectedDates.map(datetime =>
        this.initConfig.enableTime
          ? moment(datetime).format('YYYY-MM-DD HH:mm:ss')
          : moment(datetime).format('YYYY-MM-DD')
      )

      this.$emit('update', datesMap)
    }
  }

  mounted() {
    const unwatch = this.$watch(
      'value',
      (range: string[]) => {
        if (this.fp) {
          if (range.length) {
            const from = this.value[0]
            const end = this.value[1]

            if (this.duration !== `${from} - ${end}`) {
              this.duration = `${from} - ${end}`
              this.fp.setDate([from, end])
            }
          } else {
            this.clear()
          }
        }
      },
      { immediate: true }
    )
  }

  private clear() {
    if (this.fp) {
      this.fp.clear()
    }

    this.duration = ''
  }
}
</script>

<style lang="stylus">
.flatpickr-input
  padding 0 5px
  border none
  background-color transparent

  &.mode
    transition width 0.25s
    width 100px
    max-width 320px

    @media (max-width: 765px)
      width 60vmin
      max-width 60vmin

.flatpickr-calendar
  .flatpickr-current-month
    font-size 110%
</style>
