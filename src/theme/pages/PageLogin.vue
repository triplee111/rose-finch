<template lang="pug">
  AuthContainer
    template(v-slot="{ authProgress, signin, validateMessage }")
      div
        .row
          .col-12.text-center.q-py-xs.q-gutter-x-xs(
            style="border-bottom: 1px solid #ddd;")

            QChip(
              rounded
              color="warning"
              text-color="white"
              icon="casino")
              span.text-subtitle2 {{ platform }} 娛樂城

            QChip(
              v-show="actId !== '{actId}'"
              rounded
              color="secondary"
              text-color="white"
              icon="bookmark")
              span.text-subtitle2 編號 {{ actId }}

            QChip(
              v-show="duration !== '{duration}'"
              rounded
              color="info"
              text-color="white"
              icon="event")
              span.text-subtitle2 {{ duration }}

        .flex.flex-center.row.auth-container
          .col-xs-12.col-sm-8.col-lg-4
            QCard(
              style="padding: 2vmin 5vmin")
              QCardSection.text-center
                .text-h5.text-weight-medium(style="word-break: break-word;")
                  | {{ actName }}

              QCardSection
                QInput(
                  v-model.trim="username"
                  type="text"
                  placeholder="帳號"
                  required
                  autofocus
                  mask="########")
                  template(v-slot:prepend)
                    QIcon(name="account_box")

                QInput(
                  v-model="password"
                  type="password"
                  placeholder="密碼"
                  required
                  @keyup.enter="signin(username, password)")
                  template(v-slot:prepend)
                    QIcon(name="lock")

              QCardSection
                //- QCheckbox(
                //-   v-model="rememberMe"
                //-   label="remember me")


              QCardActions
                QBtn.col-12(
                  color="primary"
                  size="md"
                  :loading="authProgress"
                  @click.prevent="signin(username, password)")
                  span.q-py-sm 登 入

              QCardSection
                .text-body2.text-weight-bold.text-danger.text-center
                  | &nbsp;{{ validateMessage }}&nbsp;

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import {
  QAvatar,
  QCard,
  QCardSection,
  QCardActions,
  QChip,
  QSeparator
} from 'quasar'

import AuthContainer from '@core/container/authContainer'

@Component({
  components: {
    AuthContainer,
    QAvatar,
    QCard,
    QCardSection,
    QCardActions,
    QChip,
    QSeparator
  }
})
export default class AuthLogin extends Vue {
  protected username: string = ''
  protected password: string = ''

  private platform: string = process.env.PROJ_PLATFORM_TITLE
  private rememberMe: boolean = false

  // FIXME:
  // @ts-ignore
  private actName: string = ACTIVITY_NAME
  // @ts-ignore
  private actId: string = ACTIVITY_ID
  // @ts-ignore
  private duration: string = ACTIVITY_DURATION
}
</script>

<style lang="stylus">
.auth-container
  height 80vh

  @media (min-width: 1440px)
    height 78vh
</style>
