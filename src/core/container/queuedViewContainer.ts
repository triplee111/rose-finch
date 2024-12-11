import { Component, Watch, Vue } from 'vue-property-decorator'

import { QueuedConfig } from '@src/types'

import { EventBus } from '@src/core/global-event-bus'

@Component
export default class QueuedViewContainer extends Vue {
  get viewCurrent() {
    return this.$store.state.view.viewCurrent
  }

  get queuedList() {
    return this.$store.state.view.queuedList
  }

  @Watch('$route', { deep: true, immediate: true })
  onRouteChanged(): void {
    this.addView()
  }

  @Watch('viewCurrent', { deep: true })
  onviewCurrentChanged(view: QueuedConfig): void {
    // 當 current view 變更且不符合目前的 route 時，進行切換
    if (view.fullPath !== this.$route.fullPath) {
      this.$router.push(view)
    }
  }

  render() {
    const { queuedList, closeView } = this

    return this.$scopedSlots.default!({
      queuedList,
      closeView
    })
  }

  private addView(): void {
    this.$store.dispatch('view/addView', this.$route)
    return
  }

  private closeView(view: QueuedConfig): void {
    EventBus.$emit('view-closed', view)

    if (!view.meta.confirm) {
      this.toClose(view)
      return
    }

    this.$q
      .dialog({
        title: '<h6 class="text-body1">要關閉此頁嗎？</h6>',
        message: '系統可能不會儲存您所做的變更。',
        cancel: true,
        persistent: true,
        position: 'top',
        html: true
      })
      .onOk(() => this.toClose(view))
  }

  private async toClose(view: QueuedConfig): Promise<void> {
    await this.$store.dispatch('view/delView', view)

    this.$store.dispatch('cached/clearCache', view.fullPath)
  }
}
