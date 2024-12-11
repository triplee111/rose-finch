// modules/form/_store/index.ts

import { MutationTree, ActionTree } from 'vuex'

import service from '../_repository'

import { RootState, FormState, ActionFetchPayload } from '@src/types'

import errorMessageHandler from '@u/store/error-message-handler'
import { normal, danger } from '@u/notify/notify-quasar'

// mutations const
const TO_STEP = 'TO_STEP'
const SET_DATA = 'SET_DATA'
const UNSET_DATA = 'UNSET_DATA'
const SET_FETCH_STATUS = 'SET_FETCH_STATUS'

const formState: FormState = {
  dataSet: {},
  formStep: {}, // 表單步驟，不一定使用
  inFetch: false // 是否在取得資料中
}

const mutations: MutationTree<FormState> = {
  [TO_STEP]: (state, { id, step }) => {
    state.formStep = {
      ...state.formStep,
      [id]: step
    }
  },
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
    if (state.formStep[id]) {
      delete state.formStep[id]
    }
  },
  [SET_FETCH_STATUS]: (state, status: boolean) => {
    state.inFetch = status
  }
}

const actions: ActionTree<FormState, RootState> = {
  async fetch({ commit }, { id, url, params }: ActionFetchPayload) {
    commit(SET_FETCH_STATUS, true)

    try {
      const configCurrent = await service.fetch(url, params)

      commit(SET_DATA, { id, data: configCurrent })
    } catch (err) {
      const message = errorMessageHandler(err)

      danger(message)

      throw new Error(message)
    } finally {
      commit(SET_FETCH_STATUS, false)
    }
  },
  async save({ commit, rootState }, { id, url, form }) {
    commit(SET_FETCH_STATUS, true)

    try {
      await service.save(url, form, rootState.auth.user)

      commit(SET_DATA, { id, data: form })

      normal('表單內容設定完成')
    } catch (error) {
      const message = errorMessageHandler(error)

      danger(message)

      throw new Error(message)
    } finally {
      commit(SET_FETCH_STATUS, false)
    }
  },
  async upload({ commit }, { id, url, formData }) {
    commit(SET_FETCH_STATUS, true)

    try {
      await service.upload(url, formData)

      commit(SET_DATA, { id, data: formData })

      normal('檔案上傳完成')
    } catch (error) {
      const message = errorMessageHandler(error)

      danger(message)

      throw new Error(message)
    } finally {
      commit(SET_FETCH_STATUS, false)
    }
  },
  stepTo({ commit }, { id, step }) {
    commit(TO_STEP, { id, step })
  },
  unset({ commit }, id) {
    commit(UNSET_DATA, id)
  }
}

export default {
  namespaced: true,
  state: formState,
  mutations,
  actions
}
