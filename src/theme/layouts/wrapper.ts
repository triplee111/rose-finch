// theme/layouts/wrapper.ts

import { Component, Vue } from 'vue-property-decorator'

@Component({
  render(h) {
    return h('router-view')
  }
})
export default class Wrapper extends Vue {}
