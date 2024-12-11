<template lang="pug">
  div
    svg(width="500" height="500")
      g.flower(
        v-for="flower in layoutData.children"
        :key="flower.data.name"
        :style="{ transform: `translate(${flower.x}px, ${flower.y}px)` }")
        circle.flower__circle(
          :r="flower.r"
          :fill="flower.data.color")
        text.flower_label {{ flower.data.name }}

</template>

<script lang="ts">
import { hierarchy, pack } from 'd3-hierarchy'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Test extends Vue {
  private flowers = [
    {
      name: 'Roses',
      amount: 25,
      color: '#cc2936'
    },
    {
      name: 'Tulips',
      amount: 40,
      color: '#f2c640'
    },
    {
      name: 'Daisies',
      amount: 15,
      color: '#2a93d4'
    },
    {
      name: 'Narcissuses',
      amount: 9,
      color: '#F7AD0A'
    }
  ]

  get transformedFlowerData() {
    return {
      name: 'Top Level',
      children: this.flowers.map(flower => ({
        ...flower,
        size: flower.amount,
        parent: 'Top Level'
      }))
    }
  }

  get layoutData() {
    // Generate a D3 hierarchy
    const rootHierarchy = hierarchy(this.transformedFlowerData)
      .sum(d => d.size)
      .sort((a, b) => {
        if (a.value && b.value) {
          return b.value - a.value
        }
        return 1
      })

    // Pack the circles inside the viewbox
    return pack()
      .size([500, 500])
      .padding(10)(rootHierarchy)
  }
}
</script>

<style lang="stylus">
.flower
  transition transform 0.1s ease-in-out

.flower__circle
  transition r 0.1s ease-in-out
</style>
