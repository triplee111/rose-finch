<template lang="pug">
  .vue-avatar-wrapper(
    :style="customStyle")

    QAvatar(
      :size="`${size}px`"
      :font-size="fontSize"
      color="vue"
      text-color="white")

      img(
        v-if="isImage"
        :src="require(`@public/img/avatars/${imgName}`)")
      span(v-else)
        | {{ userInitial }}

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import { QAvatar } from 'quasar'

@Component({
  inheritAttrs: false,
  components: {
    QAvatar
  }
})
export default class Avatar extends Vue {
  @Prop({ type: String, default: '50' })
  readonly size!: string

  @Prop({ type: String })
  readonly imgName?: string

  @Prop({ type: String })
  readonly userName!: string

  @Prop({ type: Object })
  readonly customStyle?: object

  get isImage(): boolean {
    return Boolean(this.imgName)
  }

  get fontSize(): string {
    return `${Math.floor(parseInt(this.size, 10) / 2.5)}px`
  }

  get userInitial(): string {
    if (!this.isImage && this.userName) {
      const initials = this.initial()
      return initials
    }
    return ''
  }

  private initial(): string {
    const parts = this.userName.split(/[ -]/)
    let initials = ''

    for (const part of parts) {
      initials += part.charAt(0)
    }

    if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
      initials = initials.replace(/[a-z]+/g, '')
    }

    initials = initials.substr(0, 3).toUpperCase()

    return initials
  }
}
</script>
