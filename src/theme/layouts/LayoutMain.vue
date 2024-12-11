<template lang="pug">
  .app
    AppHeader(fixed)
      SidebarToggler.d-lg-none(
        display="md"
        mobile)

      .navbar-brand(to="#")
        //- img.navbar-brand-full(
        //-   :src="`${publicAssets}img/brand/logo.svg`"
        //-   width="89"
        //-   height="25"
        //-   alt="CoreUI Logo")

        //- img.navbar-brand-minimized(
        //-   :src="`${publicAssets}img/brand/sygnet.svg`"
        //-   width="30"
        //-   height="30"
        //-   alt="CoreUI Logo")

      SidebarToggler.d-md-down-none(display="lg")

      //- b-navbar-nav.d-md-down-none
        b-nav-item.px-3(to="/dashboard") Dashboard
        b-nav-item.px-3(to="/users" exact="") Users
        b-nav-item.px-3 Settings

      //- Breadcrumb(:list="list")

      b-navbar-nav.ml-auto
        b-nav-item.d-md-down-none.px-4
          i.icon-bell
          //- b-badge(pill variant="danger") 5
        HeaderDropdownAccnt(
          v-if="$q.platform.is.desktop"
          :userName="user.name"
          @signout="signout")

      //- AsideToggler.d-none.d-lg-block
      //- AsideToggler.d-lg-none(mobile)

    .app-body
      AppSidebar(fixed)
        SidebarHeader
        SidebarForm

        SidebarNav(
          :user="user"
          :routes="asyncRoutes")

        SidebarFooter
        SidebarMinimizer

      main.main
        //- Queued view bar
        BaseQueuedViewList

        //- Main content
        .container-fluid
          transition(name="fade-transform" mode="out-in")
            RouterView(
              :key="$route.fullPath")

      //- AppAside(fixed)
      //-   Aside

    AppFooter
      div
        a(
          style="font-weight: 600; color: #9a3e3d;"
          href="http://gitlab.ibc6demo.com:8080/sysevt/vadm-project"
          target="_blank") Rosefinch Admin
        span.ml-1 © 2019 Wilson.
      .ml-auto
        span.mr-1 Based on
        a(href="https://coreui.io") CoreUI Vue

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// import Breadcrumb from './LayoutBreadcrumb.vue'
import HeaderDropdownAccnt from './LayoutHeaderDropdownAccnt.vue'
import SidebarNav from './LayoutSidebarNav.vue'

import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  Aside as AppAside,
  AsideToggler,
  Footer as AppFooter
} from '@coreui/vue'

@Component({
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    AppFooter,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarMinimizer,
    // local
    // Breadcrumb,
    HeaderDropdownAccnt,
    SidebarNav
  }
})
export default class LayoutMain extends Vue {
  get list() {
    return this.$route.matched.filter(route => route.name || route.meta.label)
  }

  get user() {
    return this.$store.state.auth.user
  }

  get asyncRoutes() {
    return this.$store.state.permission.routes
  }

  private signout() {
    this.$store.dispatch('auth/signout')
  }
}
</script>
