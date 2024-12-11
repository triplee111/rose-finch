// utils/store/module-action-filter.ts

import { ModuleActions } from '@src/types'

export default function moduleActionFilter(modules: {
  [moduleName: string]: any
}): { [moduleName: string]: ModuleActions } {
  const moduleActionList: { [moduleName: string]: ModuleActions } = {}

  for (const moduleName in modules) {
    if (modules.hasOwnProperty(moduleName)) {
      const moduleDefinition = modules[moduleName]

      // If the action is defined on the module...
      if (moduleDefinition.actions) {
        if (!moduleActionList[moduleName]) moduleActionList[moduleName] = {}

        moduleActionList[moduleName].actions = []

        for (const actionName in moduleDefinition.actions) {
          if (moduleDefinition.actions.hasOwnProperty(actionName)) {
            moduleActionList[moduleName].actions!.push(actionName)
          }
        }
      }

      // If there are any nested sub-modules...
      if (moduleDefinition.modules) {
        if (!moduleActionList[moduleName]) moduleActionList[moduleName] = {}

        moduleActionList[moduleName].modules = moduleActionFilter(
          moduleDefinition.modules
        )
      }
    }
  }

  return moduleActionList
}
