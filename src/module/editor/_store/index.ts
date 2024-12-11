// modules/editor/_store/index.ts

import { MutationTree, ActionTree } from 'vuex'

import service from '../_repository'

import { RootState, EditorState, ActionFetchPayload } from '@src/types'

import errorMessageHandler from '@u/store/error-message-handler'
import { normal, danger } from '@u/notify/notify-quasar'

// mutations const
const SET_DATA = 'SET_DATA'
const UNSET_DATA = 'UNSET_DATA'
const SET_FETCH_STATUS = 'SET_FETCH_STATUS'

const editorState: EditorState = {
  dataSet: {},
  inFetch: false // 是否在取得資料中
}

const mutations: MutationTree<EditorState> = {
  [SET_DATA]: (state, { id, data }) => {
    state.dataSet = {
      ...state.dataSet,
      [id]: data
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

const actions: ActionTree<EditorState, RootState> = {
  async fetch({ commit }, { id, url, params }: ActionFetchPayload) {
    commit(SET_FETCH_STATUS, true)

    try {
      const { content } = await service.fetch(url, params)

      commit(SET_DATA, { id, data: content })
    } catch (err) {
      const message = errorMessageHandler(err)

      danger(message)

      throw new Error(message)
    } finally {
      commit(SET_FETCH_STATUS, false)
    }
  },
  async save({ commit, rootState }, { id, url, content }) {
    commit(SET_FETCH_STATUS, true)

    try {
      await service.save(url, content, rootState.auth.user)

      commit(SET_DATA, { id, data: content })

      normal('編輯內容設定完成')
    } catch (error) {
      const message = errorMessageHandler(error)

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
  state: editorState,
  mutations,
  actions
}
