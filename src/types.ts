/**
 * --------------------------------------------------------------------------------------
 * Core types
 * --------------------------------------------------------------------------------------
 */

import { RouteConfig } from 'vue-router'

export interface Info {
  id: string
  name: string
  intro: string
}

export interface AuthState {
  user: Info
  validate: string
  authProgress: boolean
}

export interface AuthResponse {
  token: string
  user: Info
  roles: string[]
}

export interface PermissionState {
  token: string
  routes?: RouteConfig[]
  roles: string[]
}

export interface QueuedConfig {
  path: string
  name?: string
  query: { [key: string]: string | Array<string | null> }
  params: { [key: string]: string }
  meta?: any
  fullPath: string
}

export interface ViewState {
  viewCurrent: QueuedConfig
  queuedList: QueuedConfig[]
}

export interface CacheConfig {
  routePath: string
  componentId: string
  data?: { [prop: string]: any }
}

export interface CachedState {
  dataCached: {
    [routePath: string]: { [componentId: string]: { [prop: string]: any } }
  }
  moduleCached: {
    [routePath: string]: { [moduleName: string]: string[] }
  }
}

export interface ModuleActions {
  actions?: string[]
  modules?: { [moduleName: string]: ModuleActions }
}

export interface RootState {
  // module
  auth: AuthState
  permission: PermissionState
  view?: ViewState
  [prop: string]: any
}

/**
 * --------------------------------------------------------------------------------------
 * Module types
 * --------------------------------------------------------------------------------------
 */

interface BaseState {
  dataSet: object
  inFetch: boolean
}

export interface ModuleCacheConfig {
  routePath: string
  moduleName: string
  moduleId: string
}

export type GridList = Array<{ [prop: string]: any | null }>

export type EditorContent =
  | {
      [prop: string]: {
        content: string
        title: string
      }
    }
  | string

export interface FormContent {
  [prop: string]: any
}

export interface GridState extends BaseState {
  dataSet: { [gridId: string]: GridList }
}

export interface EditorState extends BaseState {
  dataSet: { [editorId: string]: EditorContent }
}

export interface FormState extends BaseState {
  dataSet: { [formId: string]: FormContent }
  formStep: { [formId: string]: number }
}

export interface ExcelState extends BaseState {
  dataSet: { [excelId: string]: Array<{ [prop: string]: any }> }
}

export interface ActionFetchPayload {
  method?: string
  id?: string // uuid
  url: string // api path ex: ybact/ajaxGetList
  params?: object
}

export interface ExcelActionVerifyPayload {
  id: string // uuid
  url: string // api path ex: ybact/ajaxGetList
  rows: object[]
}

export interface ExcelServiceSendResponse {
  passList: object[] | []
  errorList: object[] | []
  duplicateList: object[] | []
}

/**
 * --------------------------------------------------------------------------------------
 * Theme types
 * --------------------------------------------------------------------------------------
 */

/**
 * Datable model
 */

export interface QTableColumn {
  name: string
  label: string
  field: string
  required?: boolean
  align?: string
  sortable?: boolean
  sort?: (a: any, b: any, rowA?: any, rowB?: any) => void
  format?: (val: any, row?: any) => void
  style?: string
  classes?: string
  autoWidth?: boolean
}

export interface DatatableModel {
  headers: string[]
  columns: any[]
  colWidths?: number[]
}

export interface SelectionDetail {
  rows: any[]
  keys: any[]
  added: boolean
  evt: any
}

/**
 * --------------------------------------------------------------------------------------
 * Utils types
 * --------------------------------------------------------------------------------------
 */

type httpGet = (uri: string, config?: object) => any

type httpPost = (uri: string, data?: any, config?: object) => any

type httpPut = (uri: string, data?: any, config?: object) => any

type httpDelete = (uri: string, config?: object) => any

export interface HttpClient {
  get: httpGet
  post: httpPost
  put: httpPut
  delete: httpDelete
}

export interface HttpResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
}
