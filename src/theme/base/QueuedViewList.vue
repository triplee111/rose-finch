<template lang="pug">
  QueuedViewContainer
    template(v-slot="{ queuedList, closeView }")
      #tab-list-container
        .tab-view-wrapper(ref="scrollWrapper")
          router-link(
            v-for="tab in queuedList"
            ref="tab"
            tag="span"
            class="tab-view-item"
            :key="tab.path"
            :class="{'tab-active': isActive(tab) }"
            :to="targetRoute(tab)")
            | {{ tab.title }}
            span.tab-icon-close(
              v-show="queuedList.length !== 1"
              @click.prevent.stop="closeView(tab)")

</template>

<script lang="ts">
import { Prop, Watch, Component, Vue } from 'vue-property-decorator'
import { Route } from 'vue-router'

import { QueuedConfig } from '@src/types'
import QueuedViewContainer from '@core/container/queuedViewContainer'

@Component({
  components: {
    QueuedViewContainer
  }
})
export default class QueuedViewList extends Vue {
  private isActive(route: Route): boolean {
    return !!route.fullPath && route.fullPath === this.$route.fullPath
  }

  private targetRoute(view: QueuedConfig): object {
    const { path, fullPath, query } = view

    return { path, fullPath, query }
  }
}
</script>

<style lang="stylus" scoped>
#tab-list-container
  width 100%
  background #fafafa
  border-bottom 1px solid #d0d3da
  padding 0.3rem 0.75rem
  position fixed
  z-index 3

  .tab-view-item
    font-size 0.75rem
    display inline-block
    position relative
    cursor pointer
    height 26px
    line-height 26px
    border 1px solid #bbbfc7
    color #5d6371
    background-color #fff
    padding 0 0.5rem
    border-radius 4px 0

    &:not(:first-child)
      margin-left 0.3rem

    .tab-icon-close
      display inline-block
      margin-left 0.25rem
      width 1rem
      height 1rem
      line-height 1rem
      border-radius 50%
      text-align center
      transition all 0.1s

      &:before
        font-family FontAwesome
        content '\f00d'
        transform scale(0.75)
        color #9a9a9a
        display inline-block
        vertical-align text-bottom

      &:hover
        background-color #b4bccc

        &:before
          color #fff

    &.tab-active
      border none
      background-color #1e9cc7
      color #fff

      &:before
        content ''
        background #fff
        display inline-block
        width 8px
        height 8px
        border-radius 50%
        position relative
        margin-right 0.25rem

      .tab-icon-close
        &:before
          color #eee

        &:hover
          background-color #eee

          &:before
            color #9a9a9a

.header-fixed
  #tab-list-container
    z-index 1040
    top 40px
</style>
