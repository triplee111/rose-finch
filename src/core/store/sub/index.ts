/**
 * Author: chrisvuefritz
 * Patreon: https://www.patreon.com/chrisvuefritz
 *
 * Register each file as a corresponding Vuex module. Module nesting
 * will mirror [sub-]directory hierarchy and modules are namespaced
 * as the camelCase equivalent of their file name.
 */

import camelCase from 'lodash/camelCase'

interface StoreData {
  modules: StoreData | any
}

const modulesCache: { [prop: string]: string } = {}

const storeData: StoreData = { modules: {} }
;(function updateModules() {
  // Allow us to dynamically require all Vuex module files.
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requireModule = require.context(
    // Search for files in the current directory.
    '.',
    // Search for files in subdirectories.
    true,
    // Include any .js or .ts files that are not this file or a unit test or types.
    /^((?!index|types|\.unit\.).)*\.(ts|js)$/
  )

  // For every Vuex module...
  requireModule.keys().forEach(fileName => {
    const moduleDefinition = requireModule(fileName).default

    // Auto set namespaced value true
    moduleDefinition.namespaced = true

    // Skip the module during hot reload if it refers to the
    // same module definition as the one we have cached.
    if (modulesCache[fileName] === moduleDefinition) return

    // Update the module cache, for efficient hot reloading.
    modulesCache[fileName] = moduleDefinition

    // Get the module path as an array.
    const modulePath: string[] = fileName
      // Remove the "./" from the beginning.
      .replace(/^\.\//, '')
      // Remove the file extension from the end.
      .replace(/\.\w+$/, '')
      // Split nested modules into an array path.
      .split(/\//)
      // camelCase all module namespaces and names.
      .map(camelCase)

    // Get the modules object for the current path.
    const { modules } = getNamespace(storeData, modulePath)

    // Add the module to our modules object.
    modules[modulePath.pop() || 'empty'] = {
      // Modules are namespaced by default.
      ...moduleDefinition
    }
  })

  // If the environment supports hot reloading...
  if (module.hot) {
    // Whenever any Vuex module is updated...
    module.hot.accept(requireModule.keys(), () => {
      // Update `storeData.modules` with the latest definitions.
      updateModules()
      // Trigger a hot update in the store.
      require('../index').default.hotUpdate({ modules: storeData.modules })
    })
  }
})()

// Recursively get the namespace of a Vuex module, even if nested.
function getNamespace(subtree: StoreData, path: string[]): StoreData {
  if (path.length === 1) return subtree

  const namespace = path.shift() || 'empty'

  subtree.modules[namespace] = {
    modules: {},
    namespaced: true,
    ...subtree.modules[namespace]
  }

  return getNamespace(subtree.modules[namespace], path)
}

export default storeData.modules
