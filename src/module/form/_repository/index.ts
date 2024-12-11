import { HttpClient, FormContent, Info } from '@src/types'

import { Axios } from '@u/http'

import axios from 'axios'
import { fromPairs } from 'lodash'

class FormService {
  private $http: HttpClient

  constructor(httpClient: HttpClient) {
    this.$http = httpClient
  }

  /**
   * 取得後端資料
   *
   * @param apiUrl 資源路徑
   * @param params 參數
   */
  fetch(apiUrl: string, params?: object): Promise<{ contents: string[] }> {
    return params ? this.$http.post(apiUrl, params) : this.$http.get(apiUrl)
  }

  /**
   * 新增/修改設定內容
   *
   * @param apiUrl 資源路徑
   * @param form   表單內容
   * @param user   編輯人員資訊: id & name
   */
  save(apiUrl: string, form: FormContent, user: Info): Promise<void> {
    if (form.mode && form.mode === 'put') {
      return this.$http.put(apiUrl, {
        ...form,
        admin: {
          id: user.id,
          name: user.name
        },
        platform: process.env.PROJ_PLATFORM
      })
    }

    return this.$http.post(apiUrl, {
      ...form,
      admin: {
        id: user.id,
        name: user.name
      },
      platform: process.env.PROJ_PLATFORM
    })
  }

  /**
   * 上傳檔案
   *
   * @param apiUrl   資源路徑
   * @param fileData 上傳檔案
   * @param user     編輯人員資訊: id & name
   */
  upload(apiUrl: string, formData: FormContent): Promise<void> {
    return this.$http.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default new FormService(Axios)
