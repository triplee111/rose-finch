<template lang="pug">
  .col
    .card-body-sec
      QStepper.col-md-10(
        v-model="step"
        :bordered="false"
        flat
        header-nav
        color="primary"
        animated)
        QStep(
          :name="1"
          title="選擇上傳的 Excel 檔"
          prefix="1"
          :done="step > 1"
          :header-nav="step > 1")

          .body-text2(v-if="sheetData.length") 重新上傳檔案，或點選下一步使用已上傳的 {{ sheetData.length.toString() }} 筆資料
          .body-text2(v-else) 選擇目標上傳的 Excel 檔，格式為 .xls 與 .xlsx

          QStepperNavigation.q-gutter-sm
            QInput.col-md-5(
              @input="fileSelected"
              filled
              type="file"
              style="padding: 0;")

            QBtn(
              v-show="hasDemo"
              unelevated
              icon="file_copy"
              size="md"
              color="info"
              label="範本下載"
              @click.prevent="$emit('download')")

            QBtn(
              v-show="sheetData.length"
              unelevated
              push
              icon="check"
              size="md"
              color="primary"
              label="下一步"
              @click="step = 2")

        QStep(
          v-if="hasVerify"
          :name="2"
          :done="step > 2"
          :header-nav="step > 2"
          title="資料驗證"
          prefix="2")
          .body-text2 驗證上傳的資料格式是否存在(例如會員帳號)與正確，此步驟為選擇性執行
            p 切換分頁將會中斷驗證，花費時間視資料量與要進行的驗證步驟而定

          QStepperNavigation.q-gutter-sm
            QBtn(
              unelevated
              push
              size="md"
              color="blue-grey-6"
              :label="verifyLabel"
              @click.prevent="$emit('verify')")

            template(v-if="sheetData.length")
              QBtn(
                unelevated
                push
                icon="check"
                size="md"
                color="primary"
                label="下一步"
                @click="step = 3")

        QStep(
          :name="hasVerify ? 3 : 2"
          :prefix="hasVerify ? 3 : 2"
          :header-nav="hasVerify ? step > 3 : step > 2"
          title="資料寫入")
          .body-text2 將目前資料寫入資料庫，若未進行第二步，會於此步驟檢驗資料格式
            p 錯誤格式與重複的資料將會被移除，但不會驗證跟第三方API有關的資料(例如會員資訊)

          QStepperNavigation
            slot(name="send-action")
              QBtn(
                unelevated
                push
                icon="file_copy"
                size="md"
                color="primary"
                label="寫入資料"
                @click.prevent="$emit('send')")

    .card-body-sec(v-if="step >= 2")
      slot(name="datatable")

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { QChip, QStepper, QStep, QStepperNavigation } from 'quasar'

@Component({
  components: {
    QChip,
    QStepper,
    QStep,
    QStepperNavigation
  }
})
export default class ImportStepper extends Vue {
  @Prop({ type: Array })
  readonly sheetData!: Array<{ [prop: string]: any }>

  @Prop({ type: Boolean })
  readonly isFileLoaded!: boolean

  @Prop({ type: Boolean })
  readonly hasDemo!: boolean

  @Prop({ type: Boolean })
  readonly hasVerify!: boolean

  @Prop({ type: Number })
  readonly verified!: number

  private step: number = 1

  get verifyLabel() {
    const { sheetData, verified } = this
    let count = -1

    if (verified === -1) {
      for (const row of sheetData) {
        if (row.verifyStatus === '') break

        count++
      }
    } else {
      count = verified
    }
    return count === -1
      ? '開始驗證'
      : `已驗證 ( ${count} / ${sheetData.length} )`
  }

  @Watch('isFileLoaded')
  onIsFileLoadedChanged(bool: boolean) {
    if (bool && this.step === 1) {
      this.step = 2
    }
  }

  @Watch('verified')
  onVerifiedChanged(nums: number) {
    if (nums === this.sheetData.length) {
      this.step = 3
    }
  }

  private fileSelected(files: File[]) {
    this.$emit('reset')
    this.$emit('import', files)
  }
}
</script>
