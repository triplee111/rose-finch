import Vue from 'vue'
import { QChip } from 'quasar'

export default Vue.extend({
  name: 'VerifyChip',
  // @ts-ignore
  functional: true,
  props: {
    status: String,
    message: String
  },
  components: {
    QChip
  },
  render(h: Vue.CreateElement, cxt: Vue.RenderContext) {
    const status = cxt.props.status
    const message = cxt.props.message

    if (status === '') return <span></span>

    switch (status) {
      case 'error':
        return (
          // @ts-ignore
          <QChip
            // @ts-ignore
            color="accent"
            text-color="white"
            icon="remove_circle_outline"
            size="sm"
          >
            {message}
          </QChip>
        )
      case 'success':
        return (
          // @ts-ignore
          <QChip color="secondary" text-color="white" icon="done" size="sm">
            {message}
          </QChip>
        )
      default:
        return (
          // @ts-ignore
          <QChip color="warning" text-color="white" icon="warning" size="sm">
            {message}
          </QChip>
        )
    }
  }
})
