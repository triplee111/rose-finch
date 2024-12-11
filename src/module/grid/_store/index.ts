// modules/grid/_store/index.ts

import { MutationTree, ActionTree } from 'vuex'

import service from '../_repository'

import { GridState, ActionFetchPayload } from '@src/types'

import errorMessageHandler from '@u/store/error-message-handler'
import { normal, danger } from '@u/notify/notify-quasar'

// mutations const
const SET_DATA = 'SET_DATA'
const UNSET_DATA = 'UNSET_DATA'
const SET_FETCH_STATUS = 'SET_FETCH_STATUS'

const gridState: GridState = {
  dataSet: {},
  inFetch: false // 是否在取得資料中
}

const mutations: MutationTree<GridState> = {
  [SET_DATA]: (state, { id, data }) => {
    state.dataSet = {
      ...state.dataSet,
      [id]: data
    }
  },
  [UNSET_DATA]: (state, id) => {
    if (state.dataSet[id]) {
      delete state.dataSet[id]
    }
  },
  [SET_FETCH_STATUS]: (state, status: boolean) => {
    state.inFetch = status
  }
}

const actions: ActionTree<GridState, {}> = {
  async fetch({ commit }, { id, url, params }: ActionFetchPayload) {
    commit(SET_FETCH_STATUS, true)

    try {
      const { list } = params
        ? await service.fetch(url, params)
        : await service.fetch(url)

      commit(SET_DATA, { id, data: list })
    } catch (error) {
      const message = errorMessageHandler(error)

      danger(message)

      throw new Error(message)
    } finally {
      commit(SET_FETCH_STATUS, false)
    }
  },
  async delete({ commit }, { url, params }: ActionFetchPayload) {
    commit(SET_FETCH_STATUS, true)

    try {
      params ? await service.delete(url, params) : await service.delete(url)

      normal('目標資料已移除')
    } catch (error) {
      const message = errorMessageHandler(error)

      danger(message)

      throw new Error(message)
    } finally {
      commit(SET_FETCH_STATUS, false)
    }
  },
  unset({ commit }, id) {
    commit(UNSET_DATA, id)
  }
}

export default {
  namespaced: true,
  state: gridState,
  mutations,
  actions
}
