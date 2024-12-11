<template lang="pug">
  router-link(
    tag="li"
    :class="classList"
    :to="url")

    .nav-link.nav-dropdown-toggle(@click.prevent="handleClick")
      i(:class="classIcon")
      | &nbsp;{{ name }}

    ul.nav-dropdown-items
      slot

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import xor from 'lodash/xor'

@Component
export default class SidebarNavDropdown extends Vue {
  @Prop({ type: String, default: '' })
  readonly name!: string

  @Prop({ type: String, default: '' })
  readonly url!: string

  @Prop({ type: String, default: '' })
  readonly icon!: string

  @Prop({ type: Array, default: () => [] })
  readonly classes!: string[]

  private classList: string[] = ['nav-item', 'nav-dropdown']

  get classIcon() {
    return ['nav-icon', this.icon]
  }

  mounted() {
    this.classList = [...this.classList, ...this.classes]
  }

  private handleClick() {
    this.classList = xor(this.classList, ['open'])
  }
}
</script>
