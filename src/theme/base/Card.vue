<template lang="pug">
  b-card
    .card-header-title(slot="header")
      slot(name="card-header")
        //- Default header
        i(:class="$route.meta.icon")
        span.q-ml-sm {{ $route.meta.title }}

      //- Default header actions
      .card-header-actions

        slot(name="card-header-actions")

        a.card-header-action(
          v-b-tooltip.hover
          title="收合內容"
          href="#"
          @click.prevent="showCollapse = !showCollapse")
          i.fa.fa-angle-up(
            :class="{ 'rotate-180': showCollapse }"
            aria-hidden="true")

    b-collapse(
      :id="`card-${uuid}`"
      v-model="showCollapse")
      slot

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Card extends Vue {
  private uuid: string = ''
  private showCollapse: boolean = true

  created() {
    this.uuid = this.generateId()
  }

  private generateId(): string {
    return (
      Math.random()
        .toString(36)
        .substring(2, 5) +
      Math.random()
        .toString(36)
        .substring(2, 5)
    )
  }
}
</script>

<style lang="stylus">
.card
  border 1px solid rgba(0, 0, 0, 0.125)
  box-shadow 0 1px 2px rgba(0, 0, 0, 0.05)
  margin-bottom 1rem

  .card-header
    background-color transparent
    border-bottom none
    padding-top 1rem
    padding-bottom 0.25rem

    .card-header-title
      font-size 1.0625rem
      letter-spacing -0.015em
      font-weight 400

    .card-header-actions
      margin-right 1.25rem

      .card-header-action
        margin-right 0.25rem
        font-size 1rem
        color #333333

        &:hover
          opacity 0.75

        i.fa-angle-up
          vertical-align middle
          transition all ease-in-out 0.1s

          &.rotate-180
            transform rotate(180deg)
</style>
