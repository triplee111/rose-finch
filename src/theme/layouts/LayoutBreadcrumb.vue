<template lang="pug">
  ol.breadcrumb
    li.breadcrumb-item(
      v-for="(routeObject, index) in routeRecords"
      :key="index")

      i.fa.fa-home(
        v-show="index === 0")

      span.active(
        v-if="isLast(index)")
        | {{ getName(routeObject) }}

      router-link(
        v-else
        :to="routeObject")
        | {{ getName(routeObject) }}

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import { RouteConfig } from 'vue-router'

@Component
export default class Breadcrumb extends Vue {
  @Prop({ type: Array, required: true })
  readonly list!: RouteConfig[]

  get routeRecords() {
    return this.list.filter(route => route.name || route.meta.label)
  }

  private getName(item: RouteConfig) {
    return item.meta && item.meta.label ? item.meta.label : item.name || null
  }

  private isLast(index: number) {
    return index === this.list.length - 1
  }
}
</script>

<style lang="stylus" scoped>
.breadcrumb-item
  .fa-home
    color rgba(47, 53, 58, 0.85)
    margin-right 0.625rem
</style>

