// core/repository/auth.ts

import { HttpClient } from '@src/types'

import { Axios } from '@u/http' // defaul http client

// 路徑暫時性設為各專案的 controller + method，之後會替換為統一格式接口
// const PROJ_PATH = `${process.env.PROJ_PATH}_adm`
const PROJ_PATH = 'adminAuth'

// auth service
const SIGN_IN = `${PROJ_PATH}/ajaxSignin` // 登入
const SIGN_OUT = `${PROJ_PATH}/ajaxSignout` // 登出

class AuthService {
  private $http: HttpClient

  constructor(httpClient: HttpClient) {
    this.$http = httpClient
  }

  /**
   * 使用者登入
   * @param username 會員帳號
   * @param password 會員密碼
   */
  async signin(username: string, password: string): Promise<any> {
    const data = await this.$http.post(SIGN_IN, {
      username,
      password
    })

    if (data.token) {
      // store token in local storage
      localStorage.setItem('worker', JSON.stringify(data))
    }

    return data
  }

  /**
   * 使用者登出
   */
  signout(): void {
    this.$http.post(SIGN_OUT)

    // remove token stored in local storage
    localStorage.removeItem('worker')
  }
}

export default new AuthService(Axios)
