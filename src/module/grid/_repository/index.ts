// modules/grid/_repository/index.ts

import { HttpClient, GridList } from '@src/types'

import { Axios } from '@u/http'

class GridService {
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
  fetch(apiUrl: string, params?: object): Promise<{ list: GridList }> {
    return params ? this.$http.post(apiUrl, params) : this.$http.get(apiUrl)
  }

  /**
   * 移除特定資料
   *
   * @param apiUrl 資源路徑
   * @param params 參數
   */
  delete(apiUrl: string, params?: object): Promise<void> {
    return params ? this.$http.post(apiUrl, params) : this.$http.get(apiUrl)
  }
}

export default new GridService(Axios)
