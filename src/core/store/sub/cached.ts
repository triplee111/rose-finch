// core/store/module/cached.ts

import mergeDeep from 'lodash/merge'

import { Module, MutationTree, ActionTree } from 'vuex'

import { CacheConfig, ModuleCacheConfig, CachedState } from '@src/types'

// mutations const
const CACHE_COMPONENT = 'CACHE_COMPONENT'
const CLEAR_CACHE = 'CLEAR_CACHE'
const CLEAR_CACHE_ALL = 'CLEAR_CACHE_ALL'

const CACHE_MODULE_ID = 'CACHE_MODULE_ID'
const REMOVE_MODULE_ID = 'REMOVE_MODULE_ID'
const CLEAR_MODULE = 'CLEAR_MODULE'

const states: CachedState = {
  dataCached: {},
  moduleCached: {}
}

const mutations: MutationTree<CachedState> = {
  [CACHE_COMPONENT]: (
    state,
    { routePath, componentId, data }: CacheConfig
  ): void => {
    if (data) {
      let routePathCacheNew: {
        [routePath: string]: {
          [componentId: string]: { [prop: string]: any }
        }
      } = {}

      if (state.dataCached[routePath]) {
        routePathCacheNew = {
          ...state.dataCached[routePath],
          [componentId]: data
        }
      } else {
        routePathCacheNew = {
          [componentId]: data
        }
      }

      state.dataCached = {
        ...state.dataCached,
        [routePath]: routePathCacheNew
      }
    }
  },
  [CLEAR_CACHE]: (state, routePath: string): void => {
    if (state.dataCached[routePath]) {
      delete state.dataCached[routePath]
    }
  },
  [CACHE_MODULE_ID]: (
    state,
    { routePath, moduleName, moduleId }: ModuleCacheConfig
  ) => {
    if (!state.moduleCached.hasOwnProperty(routePath)) {
      state.moduleCached[routePath] = {}
    }

    if (!state.moduleCached[routePath].hasOwnProperty(moduleName)) {
      state.moduleCached[routePath][moduleName] = []
    }

    state.moduleCached[routePath][moduleName].push(moduleId)
  },
  [REMOVE_MODULE_ID]: (
    state,
    { routePath, moduleName, moduleId }: ModuleCacheConfig
  ) => {
    if (
      state.moduleCached.hasOwnProperty(routePath) &&
      state.moduleCached[routePath].hasOwnProperty(moduleName)
    ) {
      state.moduleCached[routePath][moduleName].filter(
        value => value === moduleId
      )
    }
  },
  [CLEAR_MODULE]: (state, routePath: string) => {
    delete state.moduleCached[routePath]
  },
  [CLEAR_CACHE_ALL]: (state): void => {
    state.dataCached = {}
    state.moduleCached = {}
  }
}

const actions: ActionTree<CachedState, {}> = {
  cacheData({ commit }, data: CacheConfig): void {
    commit(CACHE_COMPONENT, data)
  },
  cacheModuleId({ commit }, data: ModuleCacheConfig) {
    commit(CACHE_MODULE_ID, data)
  },
  removeModuleId({ commit }, data: ModuleCacheConfig) {
    commit(REMOVE_MODULE_ID, data)
  },
  clearCache({ state, commit, dispatch }, routePath: string): void {
    commit(CLEAR_CACHE, routePath)

    if (state.moduleCached.hasOwnProperty(routePath)) {
      const modules = state.moduleCached[routePath]

      Object.keys(modules).forEach(moduleName => {
        const moduleIds = state.moduleCached[routePath][moduleName]

        dispatch(`${moduleName}/unset`, moduleIds, { root: true })
      })

      commit(CLEAR_MODULE, routePath)
    }
  },
  reset({ commit }): void {
    commit(CLEAR_CACHE_ALL)
  }
}

export default {
  state: states,
  mutations,
  actions
} as Module<CachedState, {}>
