// modules/editor/_repository/index.ts

import { HttpClient, Info, ExcelServiceSendResponse } from '@src/types'

import { Axios } from '@src/utils/http'

class ExcelService {
  private $http: HttpClient

  constructor(httpClient: HttpClient) {
    this.$http = httpClient
  }

  /**
   * 驗證上傳列表的資料存在或正確(驗證方法與內容由後端定義)
   *
   * @param apiUrl 資源路徑
   * @param rows   多筆欄位
   */
  verify(apiUrl: string, rows: object[]): Promise<{ rowsVerified: object[] }> {
    return this.$http.post(apiUrl, { rows })
  }

  /**
   * 傳送列表至後端寫入
   *
   * @param apiUrl 資源路徑
   * @param form   表單內容
   * @param user   編輯人員資訊: id & name
   */
  send(
    apiUrl: string,
    sheetData: Array<{ [prop: string]: any }>,
    user: Info
  ): Promise<ExcelServiceSendResponse> {
    return this.$http.post(apiUrl, {
      sheetData,
      admin: {
        id: user.id,
        name: user.name
      }
    })
  }
}

export default new ExcelService(Axios)
