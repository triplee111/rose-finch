// utils/notify/notify-quasar.ts

import { Notify } from 'quasar'

// 成功提示
export const normal = (payload: string | object) => {
  let config = {
    message: '',
    color: 'positive'
  }

  if (typeof payload === 'string') {
    config.message = payload
  } else {
    config = {
      ...config,
      ...payload
    }
  }

  Notify.create(config)
}

// 警告提示
export const warning = (payload: string | object) => {
  let config = {
    message: '',
    color: 'warning'
  }

  if (typeof payload === 'string') {
    config.message = payload
  } else {
    config = {
      ...config,
      ...payload
    }
  }

  Notify.create(config)
}

// 錯誤提示
export const danger = (payload: string | object) => {
  let config = {
    message: '',
    color: 'negative'
  }

  if (typeof payload === 'string') {
    config.message = payload
  } else {
    config = {
      ...config,
      ...payload
    }
  }

  Notify.create(config)
}
