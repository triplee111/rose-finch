/**
 * nprogress setting for axios
 *
 * use interceptors and event:onDownloadProgress of axios
 */

import { AxiosInstance } from 'axios'

import nprogress from '@u/progress/nprogress/index'

const calculatePercentage = (loaded: number, total: number) =>
  Math.floor(loaded * 1.0) / total

export default (axios: AxiosInstance) => {
  let counter: number = 0

  const setupProgress = () => {
    axios.interceptors.request.use(config => {
      counter++

      if (
        config.headers && 
        config.headers.hasOwnProperty('loading')
      ) {
        return config
      }

      nprogress.start()

      return config
    })

    axios.interceptors.response.use(
      response => {
        if (--counter === 0) {
          nprogress.done()
        }
        return response
      },
      error => {
        if (--counter === 0) {
          nprogress.done()
        }
        return Promise.reject(error)
      }
    )
  }

  const setupUpdateProgress = () => {
    const update = (e: any) => {
      nprogress.inc(calculatePercentage(e.loaded, e.total))
    }

    axios.defaults.onUploadProgress = update
  }

  setupProgress()

  setupUpdateProgress()
}
