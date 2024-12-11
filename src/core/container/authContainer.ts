// core/container/authContainer.ts

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthContainer extends Vue {
  private errorMsgSet: {
    [key: string]: string
  } = {
    SIGNIN_FORBIDDEN: '帳號或密碼錯誤，請重新確認',
    BAD_GATEWAY: '登入失敗，請聯繫系統部'
  }

  get authProgress(): boolean {
    return this.$store.state.auth.authProgress
  }

  get validateMessage(): string {
    const validate = this.$store.state.auth.validate
    return validate ? this.errorMsgSet[validate] : ''
  }

  render() {
    const { authProgress, validateMessage, signin, signout } = this

    if (this.$scopedSlots.default) {
      return this.$scopedSlots.default({
        authProgress,
        validateMessage,
        signin,
        signout
      })
    }
  }

  protected signin(username: string, password: string): void {
    this.$store.dispatch('auth/signin', { username, password })
  }

  protected signout(): void {
    this.$store.dispatch('auth/signout')
  }
}
