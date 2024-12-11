<template lang="pug">
doctype html
RouterView

</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'

import AppContainer from '@core/container/appContainer'

@Component
export default class App extends AppContainer {}
</script>

<style lang="stylus">
[v-cloak]
  display none
</style>
