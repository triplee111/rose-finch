// core/store/modules/auth.ts

import { Module, MutationTree, ActionTree } from 'vuex'

import { Info, AuthState, AuthResponse } from '@src/types'

import service from '@core/container/serviceContainer' // core service container

const IS_DEV = process.env.NODE_ENV !== 'production'

// mutations const
const SET_USER_INFO = 'SET_USER_INFO'
const SET_AUTH_PROGRESS = 'SET_AUTH_PROGRESS'
const SET_VALIDATE = 'SET_VALIDATE'

const states: AuthState = {
  user: {
    id: IS_DEV ? '20170702' : '',
    name: IS_DEV ? 'Wilson' : '',
    intro: IS_DEV ? 'testintro' : ''
  },
  validate: '',
  authProgress: false
}

const mutations: MutationTree<AuthState> = {
  [SET_USER_INFO]: (state, { id, name, intro }: Info) => {
    state.user = {
      ...state.user,
      id,
      name,
      intro
    }
  },
  [SET_AUTH_PROGRESS]: (state, bool) => {
    state.authProgress = bool
  },
  [SET_VALIDATE]: (state, message) => {
    state.validate = message
  }
}

const actions: ActionTree<AuthState, {}> = {
  async signin({ commit, dispatch }, { username, password }) {
    commit(SET_VALIDATE, '')

    username = username.toLowerCase().replace(/\D+/g, '')
    password = password.replace(/ /g, '')

    if (username === '' || password === '') {
      commit(SET_VALIDATE, 'SIGNIN_FORBIDDEN')
      return false
    }

    commit(SET_AUTH_PROGRESS, true)

    try {
      const { user, token, roles }: AuthResponse = await service.$auth.signin(
        username,
        password
      )

      commit(SET_USER_INFO, user)

      dispatch('permission/setToken', token, { root: true })
      dispatch('permission/setRoles', roles, { root: true })
    } catch (error) {
      error.status && error.status < 500 && error.status !== 404
        ? commit(SET_VALIDATE, 'SIGNIN_FORBIDDEN')
        : commit(SET_VALIDATE, 'BAD_GATEWAY')
    } finally {
      commit(SET_AUTH_PROGRESS, false)
    }
  },
  signout({ commit, dispatch }) {
    service.$auth.signout()

    commit(SET_USER_INFO, {
      id: '',
      name: '',
      intro: ''
    })

    dispatch('permission/setToken', '', { root: true })
    dispatch('permission/setRoles', [], { root: true })

    window.location.reload()
  }
}

export default {
  state: states,
  mutations,
  actions
} as Module<AuthState, {}>
