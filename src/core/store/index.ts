// core/store/index.ts

import Vue from 'vue'

import Vuex, { GetterTree, MutationTree } from 'vuex'

// import moduleActionFilter from '@src/utils/store/module-action-filter'

import { RootState } from '@src/types'

// modules store
import modules from './sub/index'

// const moduleActionList = moduleActionFilter(modules)

// const rootState: RootState = {
//   inProgress: false,
//   // moduleActionList,
//   permission: {
//     token: '',
//     roles: []
//   }
// }

// const SET_MODULES_TREE = 'SET_MODULES_TREE'

// const getters: GetterTree<RootState, RootState> = {
//   progress: state => state.inProgress
// }

// const mutations: MutationTree<RootState> = {
//   [SET_MODULES_TREE]: (state, actionList: object) => {
//     state.moduleActionList = {
//       ...state.moduleActionList,
//       ...actionList
//     }
//   }
// }

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
