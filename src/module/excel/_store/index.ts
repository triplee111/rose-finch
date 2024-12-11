// modules/excel/_store/index.ts

import { MutationTree, ActionTree } from 'vuex'

import service from '../_repository'

import { ExcelState, ExcelActionVerifyPayload, RootState } from '@src/types'

import errorMessageHandler from '@src/utils/store/error-message-handler'
import { normal, danger } from '@src/utils/notify/notify-quasar'

// mutations const
const SET_FETCH_STATUS = 'SET_FETCH_STATUS'
const SET_DATA = 'SET_DATA'
const SET_ROWS = 'SET_ROWS'
const UNSET_DATA = 'UNSET_DATA'

const excelState: ExcelState = {
  dataSet: {},
  inFetch: false // 是否在取得資料中
}

const mutations: MutationTree<ExcelState> = {
  [SET_DATA]: (state, { id, data }) => {
    state.dataSet = {
      ...state.dataSet,
      [id]: data
    }
  },
  [SET_ROWS]: (state, { id, rows }) => {
    if (Array.isArray(rows)) {
      rows.forEach((rowData, rowId) => {
        state.dataSet[id].splice(rowId, 1, rowData)
      })
    } else {
      Object.keys(rows).forEach(rowId => {
        state.dataSet[id].splice(parseInt(rowId, 10), 1, rows[rowId])
      })
    }
  },
  [UNSET_DATA]: (state, ids) => {
    for (const mid of ids) {
      if (state.dataSet[mid]) {
        delete state.dataSet[mid]
      }
    }
  },
  [SET_FETCH_STATUS]: (state, status: boolean) => {
    state.inFetch = status
  }
}

const actions: ActionTree<ExcelState, RootState> = {
  set({ commit }, { id, sheetData }) {
    commit(SET_DATA, { id, data: sheetData })
  },
  async verify({ commit }, { id, url, rows }: ExcelActionVerifyPayload) {
    try {
      const { rowsVerified } = await service.verify(url, rows)

      commit(SET_ROWS, { id, rows: rowsVerified })
    } catch (err: any) {
      throw new Error(err)
    }
  },
  async send({ state, commit, rootState }, { id, url }) {
    commit(SET_FETCH_STATUS, true)

    try {
      const { passList, errorList, duplicateList } = await service.send(
        url,
        state.dataSet[id],
        rootState.auth.user
      )
      const sheetData = [...errorList, ...duplicateList, ...passList]

      commit(SET_DATA, { id, data: sheetData })

      normal({
        ignoreDefaults: true,
        position: 'top',
        timeout: 10000,
        html: true,
        actions: [
          {
            label: '確認',
            color: 'white'
          }
        ],
        message: `
          <p>資料處理完成，結果如下: </p>
          <p class="text-body1">寫入/更新 ${passList.length} 筆，重複 ${duplicateList.length} 筆，移除 ${errorList.length} 筆</p>
        `
      })
    } catch (err) {
      const message = errorMessageHandler(err)

      danger(message)

      throw new Error(message)
    } finally {
      commit(SET_FETCH_STATUS, false)
    }
  },
  unset({ commit }, ids: string[]) {
    commit(UNSET_DATA, ids)
  }
}

export default {
  namespaced: true,
  state: excelState,
  mutations,
  actions
}
