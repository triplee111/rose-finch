// modules/editor/_repository/index.ts

import { HttpClient, EditorContent, Info } from '@src/types'

import { Axios } from '@u/http'

class EditorService {
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
  fetch(apiUrl: string, params?: object): Promise<{ content: string[] }> {
    return params ? this.$http.post(apiUrl, params) : this.$http.get(apiUrl)
  }

  /**
   * 新增/修改文案內容
   *
   * @param apiUrl  資源路徑
   * @param content 文案編輯內容
   * @param user    編輯人員資訊: id & name
   */
  save(apiUrl: string, content: EditorContent, user: Info): Promise<void> {
    return this.$http.post(apiUrl, {
      content,
      admin: {
        id: user.id,
        name: user.name
      }
    })
  }
}

export default new EditorService(Axios)
