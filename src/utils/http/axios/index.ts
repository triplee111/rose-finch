// utils/axios/index.ts

/**
 * axios encapsulation
 *
 * implements HttpClient interface
 */
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosPromise,
  Canceler
} from 'axios'
import qs from 'qs'

import { HttpClient } from '@src/types' // http client interface

import initProgress from './progress'

import { store } from '@core/index'

const isDev = process.env.NODE_ENV === 'development'
const contentTypeDefault = 'application/x-www-form-urlencoded; charset=UTF-8'

// axios default config
const defaults = {
  baseURL: isDev ? '/' : process.env.VUE_APP_API,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': contentTypeDefault
  },
  timeout: 180000,
  transformRequest: [
    (data: any, headers: any) =>
      headers['Content-Type'] === contentTypeDefault ? qs.stringify(data) : data
  ],
  validateStatus: (status: number) => {
    return status < 400 // Reject only if the status code is greater than or equal to 400
  }
}

class AxiosService implements HttpClient {
  $http: AxiosInstance

  protected defaults!: AxiosRequestConfig
  protected pending: Map<string, Canceler> // 存放 url 與 cancel executor

  private localStorageIdentifer: string = 'CYADMK_WORKER'

  constructor() {
    this.pending = new Map()

    this.$http = axios.create({
      ...defaults
    })

    this.init()
  }

  get(uri: string, config?: object): AxiosPromise {
    return this.$http.get(uri, {
      ...config
    })
  }

  post(uri: string, data?: any, config?: object): AxiosPromise {
    return this.$http.post(uri, data, {
      ...config
    })
  }

  put(uri: string, data?: any, config?: object): AxiosPromise {
    return this.$http.put(uri, data, {
      ...config
    })
  }

  delete(uri: string, config?: object): AxiosPromise {
    return this.$http.delete(uri, {
      ...config
    })
  }

  cancelAll() {
    this.pending.forEach(c => {
      c('canceled') // cancel request
    })
    this.pending.clear() // reset pending
  }

  private init(): void {
    initProgress(this.$http)

    this.initRequest()
    this.initResponse()
  }

  // request 預處理
  private initRequest(): any {
    let apiToken = ''

    // json web toekn
    if (store && store.state.permission.token) {
      apiToken = store.state.permission.token
    } else {
      const tokenStorage = localStorage.getItem(this.localStorageIdentifer)

      if (tokenStorage) {
        apiToken = JSON.parse(tokenStorage)
      }
    }

    this.$http.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        config.url = isDev ? `/api/${config.url}` : `/${config.url}` // add api prefix when develope

        this.cancel(config.url) // cancel duplicate request sent previously

        if (apiToken && config.headers) {
          config.headers.Authorization = `Bearer ${apiToken}`
        }

        config.cancelToken = new axios.CancelToken(c => {
          this.pending.set(config.url!, c)
        })
        return config
      },
      error => Promise.reject(error)
    )
  }

  // response 預處理
  private initResponse(): any {
    this.$http.interceptors.response.use(
      // http status success
      response => {
        this.pending.delete(response.config.url!)

        return Promise.resolve(response.data)
      },
      // http status error
      error => {
        // request is canceled
        if (axios.isCancel(error)) {
          return Promise.reject(error.message)
        }

        // request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response) {
          // unauthorized or token expired
          if (error.response.status === 401) {
            this.cancelAll()

            localStorage.removeItem(this.localStorageIdentifer)

            window.location.reload()

            return false
          }

          this.pending.delete(error.response.config.url)

          // resource not found
          if (error.response.status === 404) {
            error.response.data = {
              message: '請求資源不存在，請聯繫系統部或稍候再試'
            }
          } else if (error.response.status >= 500) {
            error.response.data = {
              message: '伺服器錯誤，請聯繫系統部或稍候再試'
            }
          }

          return Promise.reject(error.response)
        }

        // request was made but no response was received
        if (error.request) {
          return Promise.reject(error.request)
        }

        return Promise.reject(error)
      }
    )
  }

  private cancel(url: string) {
    if (this.pending.has(url)) {
      const cancel = this.pending.get(url)!
      cancel('canceled')
      this.pending.delete(url)
    }
  }
}

export default new AxiosService()
