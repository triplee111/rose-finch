'use strict'

/** 設定專案啟動用相關參數 */

// 取得指令的路徑參數
const RAW_ARGV = process.argv.slice(2)
const ARGS = require('minimist')(RAW_ARGV)

const utils = require('./utils')

const PROJ_NAME = utils.getProject(ARGS) // 專案路徑

const PLATFORM = utils.getPlatform(PROJ_NAME) // 平台代碼

const PATH_NAME = utils.getPathName(PROJ_NAME) // 路徑名稱 for router base

const ASSETS_PATH = utils.getAppAssetsPath(PROJ_NAME, PLATFORM.name) // 資源路徑 for bundle files

const UPLOAD_PATH = utils.getUploadPath(PLATFORM.name) // 上傳檔案資源路徑

utils.setProcessEnvParam(ARGS)

module.exports = {
  name: PROJ_NAME,
  platform: PLATFORM,
  routerBase: PATH_NAME,
  assets: ASSETS_PATH,
  upload: UPLOAD_PATH
}
