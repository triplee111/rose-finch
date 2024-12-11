import Vue from 'vue'

// UI framework
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'

import {
  NavbarPlugin,
  DropdownPlugin,
  CardPlugin,
  TooltipPlugin
} from 'bootstrap-vue'

import {
  Quasar,
  QCard,
  QCardSection,
  QIcon,
  QForm,
  QInput,
  QSelect,
  QField,
  QRadio,
  QCheckbox,
  QToggle,
  QBtnToggle,
  QOptionGroup,
  QBtn,
  QBtnGroup,
  QBtnDropdown,
  QDialog,
  ClosePopup,
  Dialog,
  Notify,
  AppFullscreen
} from 'quasar'

import store from './store/index'

import router from './router/index'

import Middleware from '@u/router/middleware'

// TODO: 調整內容
// import DispatchAll from '@src/utils/store/dispatch-all'

// Quasar framework custom style
import './quasar/index'

// Basic components auto register
import '@src/theme/base/index'

Vue.use(DropdownPlugin)
Vue.use(NavbarPlugin)
Vue.use(CardPlugin)
Vue.use(TooltipPlugin)

Vue.use(Quasar, {
  components: {
    QCard,
    QCardSection,
    QIcon,
    QForm,
    QInput,
    QField,
    QRadio,
    QCheckbox,
    QToggle,
    QBtnToggle,
    QOptionGroup,
    QBtn,
    QBtnGroup,
    QBtnDropdown,
    QSelect,
    QDialog
  },
  plugins: { Dialog, Notify, AppFullscreen },
  directives: { ClosePopup },
  config: {
    notify: {
      classes: 'notify-main',
      position: 'top',
      timeout: 2000,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }]
    }
  }
})

new Middleware(store, router)

// TODO: 調整內容
// new DispatchAll(store)

export { Vue, store, router }
