<template lang="pug">
  AppHeaderDropdown(right no-caret)
    template(slot="header")
      Avatar(
        rounded
        size="26"
        :userName="userName"
        :customStyle="customStyle")
      span.name-avatar {{ userName }}

    template(slot="dropdown")
      //- TODO:
      //- b-dropdown-header.text-center(tag="div")
      //-   strong Account
      //- b-dropdown-item
      //-   i.fa.fa-bell-o
      //-   | Updates
      //-   //- b-badge(variant="info") {{ itemsCount }}
      //- b-dropdown-item
      //-   i.fa.fa-envelope-o
      //-   | Messages
      //-   //- b-badge(variant="success") {{ itemsCount }}
      //- b-dropdown-item
      //-   i.fa.fa-tasks
      //-   | Tasks
      //-   //- b-badge(variant="danger") {{ itemsCount }}
      //- b-dropdown-item
      //-   i.fa.fa-comments
      //-   | Comments
      //-   //- b-badge(variant="warning") {{ itemsCount }}

      //- b-dropdown-header.text-center(tag="div")
      //-   strong Settings
      //- b-dropdown-item
      //-   i.fa.fa-user
      //-   | Profile
      //- b-dropdown-item
      //-   i.fa.fa-wrench
      //-   | Settings
      //- b-dropdown-item
      //-   i.fa.fa-usd
      //-   | Payments
      //-   //- b-badge(variant="secondary") {{ itemsCount }}
      //- b-dropdown-item
      //-   i.fa.fa-file
      //-   | Projects
      //-   //- b-badge(variant="primary") {{ itemsCount }}
      //- b-dropdown-divider
      //- b-dropdown-item
      //-   i.fa.fa-shield
      //-   | Lock Account

      b-dropdown-item(
        @click="$emit('signout')")
        i.fa.fa-lock
        | 登出

</template>

<script lang="ts">
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'

import { Prop, Component, Vue } from 'vue-property-decorator'

import Avatar from './LayoutAvatar.vue'

@Component({
  components: {
    AppHeaderDropdown,
    // local
    Avatar
  }
})
export default class HeaderDropdownAccnt extends Vue {
  @Prop({ type: String })
  readonly userName!: string

  private itemsCount: number = 5
  private customStyle: object = {
    display: 'inline-flex',
    margin: '0 6px'
  }
}
</script>
