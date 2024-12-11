// core/store/module/view.ts

import { Module, MutationTree, ActionTree } from 'vuex'

import { Route } from 'vue-router'

import { QueuedConfig, ViewState } from '@src/types'

// mutations const
const SET_VIEW_CURRENT = 'SET_VIEW_CURRENT'
const ADD_VIEW = 'ADD_VIEW'
const DEL_VIEW = 'DEL_VIEW'
const DEL_OTHER_VIEWS = 'DEL_OTHER_VIEWS'
const DEL_ALL_VIEWS = 'DEL_ALL_VIEWS'
const UPDATE_VIEW = 'UPDATE_VIEW'

const states: ViewState = {
  viewCurrent: {
    path: '',
    query: {},
    params: {},
    fullPath: ''
  },
  queuedList: []
}

const mutations: MutationTree<ViewState> = {
  [SET_VIEW_CURRENT]: (state, view: QueuedConfig): void => {
    state.viewCurrent = view
  },
  [ADD_VIEW]: (state, view: QueuedConfig): void => {
    const titleLeng = 8

    if (state.queuedList.some(queued => queued.fullPath === view.fullPath)) {
      return
    }

    let title = view.query.title || view.meta.title || '未命名'
    title = title.length <= titleLeng ? title : title.slice(0, titleLeng) + '..'

    state.queuedList.push(Object.assign({}, view, { title }))
  },
  [DEL_VIEW]: (state, view: QueuedConfig): void => {
    for (const [index, queued] of state.queuedList.entries()) {
      if (queued.fullPath === view.fullPath) {
        state.queuedList.splice(index, 1)

        break
      }
    }
  },
  [DEL_OTHER_VIEWS]: (state, route: Route): void => {
    for (const [index, queued] of state.queuedList.entries()) {
      if (queued.fullPath === route.fullPath) {
        state.queuedList = state.queuedList.slice(index, index + 1)

        break
      }
    }
  },
  [DEL_ALL_VIEWS]: state => {
    state.queuedList = []
  },
  [UPDATE_VIEW]: (state, view: QueuedConfig): void => {
    for (let queued of state.queuedList) {
      if (queued.fullPath === view.fullPath) {
        queued = Object.assign(queued, view)

        break
      }
    }
  }
}

const actions: ActionTree<ViewState, {}> = {
  addView({ commit }, route: Route): void {
    const { path, name, meta, query, params, fullPath } = route

    const view = { path, name, meta, query, params, fullPath }

    commit(ADD_VIEW, view)
    commit(SET_VIEW_CURRENT, view)
  },
  delView({ state, commit }, view: QueuedConfig): void {
    if (view.fullPath === state.viewCurrent.fullPath) {
      let viewIdCurrent = state.queuedList.findIndex(queued => {
        return queued.fullPath === view.fullPath
      })

      viewIdCurrent =
        viewIdCurrent === 0 ? viewIdCurrent + 1 : viewIdCurrent - 1

      commit(SET_VIEW_CURRENT, state.queuedList[viewIdCurrent])
    }
    commit(DEL_VIEW, view)
  },
  delOtherViews({ commit }, route: Route): void {
    commit(DEL_OTHER_VIEWS, route)
  },
  delAllViews({ commit }): void {
    commit(DEL_ALL_VIEWS)
  },
  updateView({ commit }, view: QueuedConfig): void {
    commit(UPDATE_VIEW, view)
  }
}

export default {
  state: states,
  mutations,
  actions
} as Module<ViewState, {}>
