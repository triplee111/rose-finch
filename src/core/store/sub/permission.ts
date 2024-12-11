// core/store/modules/permission.ts

import { Module, MutationTree, ActionTree } from 'vuex'

import { RouteConfig } from 'vue-router'

import { PermissionState } from '@src/types'

const SET_TOKEN = 'SET_TOKEN'
const SET_ROUTES = 'SET_ROUTES'
const SET_ROLES = 'SET_ROLES'

const IS_DEV = process.env.NODE_ENV !== 'production'

const states: PermissionState = {
  token: IS_DEV ? '12345678' : '',
  roles: IS_DEV ? ['super'] : [],
  routes: []
}

const mutations: MutationTree<PermissionState> = {
  [SET_TOKEN]: (state, token: string) => {
    state.token = token
  },
  [SET_ROLES]: (state, roles: string[]) => {
    state.roles = roles
  },
  [SET_ROUTES](state, accessRoutes: RouteConfig[]) {
    state.routes = accessRoutes
  }
}

const actions: ActionTree<PermissionState, {}> = {
  setToken({ commit }, token: string): void {
    commit(SET_TOKEN, token)
  },
  setRoles({ commit }, roles: string[]): void {
    commit(SET_ROLES, roles)
  },
  setRoutes({ commit }, accessRoutes: RouteConfig[]) {
    commit(SET_ROUTES, accessRoutes)
  }
}

export default {
  state: states,
  mutations,
  actions
} as Module<PermissionState, {}>
