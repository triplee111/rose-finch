// utils/store/error-message-handler.ts

export default (error: any): string => {
  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object') {
    if (error.hasOwnProperty('message')) {
      return error.message
    }

    if (error.data && error.data.hasOwnProperty('message')) {
      return error.data.message
    }
  }

  return '系統錯誤，請聯繫系統部或稍候再試'
}
