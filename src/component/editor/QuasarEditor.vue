<template lang="pug">
  form.q-editor-container(
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false")

    QEditor(
      v-model="editor"
      v-bind="$attrs"
      dense
      :ref="qid"
      :definitions="definitions"
      :toolbar="toolbar"
      :content-style="{ display: editorDisplayStyle }"
      @input="$emit('update', editor)")

    textarea.src-area(
      v-model="editorSrc"
      :style="{ display: sourceDisplayStyle }"
      rows="10")

</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { QEditor } from 'quasar'

import sanitizeHtml from 'sanitize-html'

const sanitizeConfig = {
  allowedTags: [
    'img',
    'span',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'u',
    'em',
    'strike',
    'hr',
    'br',
    'div',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'figure',
    'figcaption'
  ],
  allowedAttributes: {
    '*': [
      'href',
      'target',
      'alt',
      'src',
      'class',
      'id',
      'title',
      'style',
      'data-*',
      'rowspan',
      'colspan'
    ]
  },
  allowedStyles: {
    '*': {
      // Match HEX and RGB
      color: [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
      ],
      'text-align': [/^left$/, /^right$/, /^center$/],
      // Match any number with px, em, or %
      'font-size': [/^\d+(?:px|em|%)$/],
      display: [/^block$/, /^inline$/, /^table$/, /^flex$/]
    }
  },
  parser: {
    lowerCaseTags: true
  }
}

@Component({
  inheritAttrs: false,
  model: {
    event: 'update'
  },
  components: {
    QEditor
  }
})
export default class QuasarEditor extends Vue {
  @Prop({ type: String, default: 'editor' })
  readonly qid!: string

  @Prop({ type: String })
  readonly value!: string

  private definitions = {
    src: {
      tip: 'Source code mode',
      icon: 'code',
      handler: this.toggleMode
    }
  }
  private toolbar = [
    ['left', 'center', 'right', 'justify'],
    ['bold', 'italic', 'underline', 'strike'],
    ['undo', 'redo'],
    ['src']
  ]

  private editor = ''
  private editorSrc = ''
  private isSourceMode = false

  get editorDisplayStyle() {
    return this.isSourceMode ? 'none' : 'inherit'
  }

  get sourceDisplayStyle() {
    return this.isSourceMode ? 'inherit' : 'none'
  }

  mounted() {
    this.$watch(
      'value',
      (content: string) => {
        if (content && this.editor !== content) {
          this.editor = content
        }
      },
      { immediate: true }
    )
  }

  private toggleMode() {
    this.isSourceMode = !this.isSourceMode

    if (this.isSourceMode) {
      this.editorSrc = this.editor
    } else {
      this.editorSrc = sanitizeHtml(this.editorSrc, sanitizeConfig)

      this.$emit(
        'update',
        this.editorSrc.replace(/(\r\n|\n|\r)/gm, '').replace(/>[\t\s]*</g, '><')
      )
    }
  }
}
</script>

<style lang="stylus">
.q-editor-container
  .table
    margin-bottom 0.5rem
    width auto

    th
    td
      padding 0.3rem
      border 1px solid #c8ced3

  .src-area
    background-color #333
    color #eeeeee
    width 100%
    margin-top -2px
    border 1px solid rgba(0, 0, 0, 0.12)
    border-top none
</style>
