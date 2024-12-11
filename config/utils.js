'use strict'

/**
 * 啟動專案時，用於參數設定的 utilities
 */

const URL_PATTERN = require('url-pattern')

const PROJECTS = require('./projects.json')
const SERVERS = require('./fileServer.json')
const UPLOAD_SERVERS = require('./uploadServer.json')

const STAGING_PATHNAME = 'actions/act_evt/web_mem' // 正測站網址片段

/**
 * 取得參數設定的專案路徑
 *
 * @params object args
 * @return string
 */
function getProject(args) {
  if (args && args.hasOwnProperty('path')) {
    const pathArray = args.path.split('.')

    // 只輸入一個參數的話直接回傳
    if (pathArray.length === 1) {
      return pathArray[0]
    }

    return PROJECTS.hasOwnProperty(pathArray[0]) &&
      PROJECTS[pathArray[0]].alias.hasOwnProperty(pathArray[1])
      ? `${pathArray[0]}/${PROJECTS[pathArray[0]].alias[pathArray[1]]}`
      : pathArray.join('/')
  }

  return PROJECTS.current
}

/**
 * 取得活動平台代碼
 *
 * @params string 專案名稱
 *
 * @return string
 */
function getPlatform(projectName) {
  let pattern = new URL_PATTERN(':platform/:projName')
  let obj = pattern.match(projectName)

  if (obj !== null && obj.hasOwnProperty('platform')) {
    return {
      name: obj.platform,
      title: PROJECTS.hasOwnProperty(obj.platform)
        ? PROJECTS[obj.platform].title
        : ''
    }
  }

  return {
    name: '',
    title: ''
  }
}

/**
 * 取得目前環境的完整 path name
 *
 * @params string 專案名稱
 *
 * @return string
 */
function getPathName(projectName) {
  if (process.env.NODE_ENV !== 'production') {
    return '/'
  }

  // FIXME: 正式站各平台的 pathname
  if (process.env.VUE_PRODUCTION_TYPE === 'official') {
    return `/${projectName}/admin`
  }

  return `/${STAGING_PATHNAME}/${projectName}/admin`
}

/**
 * 取得活動對應的檔案伺服器
 *
 * @params string    專案名稱
 * @params platforom 平台代碼
 *
 * @return string
 */
function getAppAssetsPath(project, platform = '') {
  if (process.env.NODE_ENV !== 'production') {
    return ''
  }

  // 正式站使用各平台的 file server
  if (process.env.VUE_PRODUCTION_TYPE === 'official') {
    if (platform === '' || !SERVERS[platform]) {
      return `${project}`
    }
    return `${SERVERS[platform]}${project}`
  }
  return `${process.env.VUE_APP_ASSETS_URL}${project}`
}

/**
 * 命令參數處理
 *
 * @param {object} args
 */
function setProcessEnvParam(args) {
  if (args) {
    if (args.hasOwnProperty('analyze')) {
      process.env.WEBPACK_ANALYZE = true
    }

    if (args.hasOwnProperty('measure')) {
      process.env.MEASURE = true
    }
  }

  return
}

/**
 * 取得活動對應的上傳檔案伺服器
 *
 * @params platforom 平台代碼
 *
 * @return string
 */
function getUploadPath(platform = '') {
  // 正式站使用各平台的 upload server
  if (process.env.VUE_PRODUCTION_TYPE === 'official') {
    if (platform === '' || !UPLOAD_SERVERS[platform]) {
      // TODO:
      return ''
    }
    return `${UPLOAD_SERVERS[platform]}`
  }
  return `${process.env.VUE_APP_UPLOAD_ASSETS_URL}${platform}/`
}

function setProcessEnvParam(args) {
  if (args) {
    if (args.hasOwnProperty('analyze')) {
      process.env.WEBPACK_ANALYZE = true
    }

    if (args.hasOwnProperty('measure')) {
      process.env.MEASURE = true
    }
  }

  return
}

module.exports = {
  getProject,
  getPlatform,
  getPathName,
  getAppAssetsPath,
  setProcessEnvParam,
  getUploadPath
}
