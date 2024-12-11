<template lang="pug">
  nav.sidebar-nav
    VuePerfectScrollbar.scroll-area(
      :settings="scrollbarSetting")

      .scroll-content
        .user
          .username
            h6 {{ userName }}
          .userid
            span {{ userId }}@bcadmk
          .avatar-container
            Avatar(
              size="45"
              :userName="userName")

        ul.nav
          template(v-for="(group, gid) in navItems")
            //- hide panel routes
            template(v-if="!group.panel")
              //- label
              SidebarNavLabel(
                v-if="group.label"
                :key="'group' + gid"
                :label="group.label"
                :name="group.meta.title"
                :classes="group.meta.class")

              //- divider
              SidebarNavDivider(
                v-else-if="group.divider"
                :key="'group' + gid"
                :classes="group.meta.class")

              SidebarNavTitle(
                v-else
                :key="'group' + gid"
                :name="group.meta.title"
                :classes="group.meta.class"
                :wrapper="group.meta.wrapper")

              template(v-for="(item, cid) in group.children")
                //- first level dropdown
                SidebarNavDropdown(
                  v-if="item.children"
                  :key="`${group.name}-${cid}`"
                  :name="item.meta.title"
                  :url="item.path"
                  :icon="item.meta.icon"
                  :classes="item.meta.class")

                  template(v-for="(childL1, cid) in item.children")
                    //- second level dropdown
                    SidebarNavDropdown(
                      v-if="childL1.children"
                      :key="'childL1' + cid"
                      :name="childL1.meta.title"
                      :url="childL1.path"
                      :icon="childL1.meta.icon"
                      :classes="childL1.meta.class")

                      li.nav-item(
                        v-for="(childL2, cid2) in childL1.children"
                        :key="'childL2' + cid")

                        SidebarNavLink(
                          :name="childL2.meta.title"
                          :url="getNavLink(group.path, item.path, childL1.path, childL2.path)"
                          :icon="childL2.meta.icon"
                          :badge="childL2.meta.badge"
                          :variant="childL2.meta.variant"
                          :attributes="childL2.meta.attributes")

                    SidebarNavItem(
                      v-else
                      :key="'childL1' + cid"
                      :classes="item.meta.class")

                      SidebarNavLink(
                        :name="childL1.meta.title"
                        :url="getNavLink(group.path, item.path, childL1.path)"
                        :icon="childL1.meta.icon"
                        :badge="childL1.meta.badge"
                        :variant="childL1.meta.variant"
                        :attributes="childL1.meta.attributes")

                SidebarNavItem(
                  v-else
                  :key="`${group.name}-${cid}`"
                  :classes="item.meta.class")

                  SidebarNavLink(
                    :name="item.meta.title"
                    :url="getNavLink(group.path, item.path)"
                    :icon="item.meta.icon"
                    :badge="item.meta.badge"
                    :variant="item.meta.variant"
                    :attributes="item.meta.attributes")
      slot

</template>

<script lang="ts">
import { RouteConfig } from 'vue-router'

import { Prop, Component, Vue } from 'vue-property-decorator'

import {
  SidebarNavDivider,
  SidebarNavLink,
  SidebarNavTitle,
  SidebarNavItem,
  SidebarNavLabel
} from '@coreui/vue'

import SidebarNavDropdown from './LayoutSidebarNavDropdown.vue'

import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import Avatar from './LayoutAvatar.vue'

@Component({
  components: {
    SidebarNavDivider,
    SidebarNavLink,
    SidebarNavTitle,
    SidebarNavItem,
    SidebarNavLabel,
    VuePerfectScrollbar,
    // local
    Avatar,
    SidebarNavDropdown
  }
})
export default class SidebarNav extends Vue {
  @Prop()
  readonly user!: { name: string; id: string }

  @Prop()
  readonly routes!: any[]

  get scrollbarSetting(): {} {
    return {
      maxScrollbarLength: 200,
      minScrollbarLength: 40,
      suppressScrollX: true,
      wheelPropagation: false,
      interceptRailY: (styles: any) => ({ ...styles, height: 0 })
    }
  }

  get navItems(): RouteConfig[] {
    if (!this.routes[0].hasOwnProperty('children')) {
      return []
    }

    return this.routes[0].children
  }

  get userId() {
    return this.user.id
  }

  get userName() {
    return this.user.name
  }
  private avatarSize: number = 55

  private getNavLink(...paths: string[]): string {
    let navLink: string = ''

    paths.forEach(path => {
      navLink += `/${path}`
    })

    return navLink
  }
}
</script>

<style lang="stylus" scoped>
.sidebar-nav
  .scroll-area
    position absolute
    height 100%
    margin auto

    .user
      background-color #1e2129
      position relative
      display flex
      align-items center
      justify-content flex-start
      width 100%
      height 120px
      min-height 120px
      max-height 120px
      padding 25px 0 64px
      flex-direction column
      box-sizing border-box
      display flex
      transition width 0.25s

      .username
        h6
          font-size 1rem
          font-weight 400
          line-height 1rem

      .userid
        span
          color rgba(255, 255, 255, 0.5)
          font-size 0.8rem

      .avatar-container
        position absolute
        top 85px
        border-radius 50%
        padding 8px
        transform translateX(-50%)
        left 50%
        background-color #2f353a

    ul.nav
      padding-top 35px

.sidebar-minimized
  .sidebar-nav
    .user
      width 0px
      margin-left -220px
      position absolute
</style>
