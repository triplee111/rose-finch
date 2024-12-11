// // utils/store/dispatch-all.ts

// import { Store } from 'vuex'

// import { ModuleActions } from '@src/types'

// export default class DispatchAll {
//   private store: Store<ModuleActions>
//   private actionList: { [moduleName: string]: ModuleActions }

//   constructor(store: Store<ModuleActions>) {
//     this.store = store
//     this.actionList = store.state.moduleActionList

//     this.init()
//   }

//   init() {
//     this.dispatchActionForAllModules('init')
//   }

//   reset() {
//     this.dispatchActionForAllModules('reset')
//   }

//   private dispatchActionForAllModules(
//     actionName: string,
//     actionList = this.actionList
//   ) {
//     // For every module...
//     for (const moduleName in actionList) {
//       if (actionList.hasOwnProperty(moduleName)) {
//         const moduleDefinition = actionList[moduleName]

//         // If the action is defined on the module...
//         if (
//           moduleDefinition.actions &&
//           moduleDefinition.actions.includes(actionName)
//         ) {
//           // Dispatch the action if the module is namespaced. Otherwise,
//           // set a flag to dispatch the action globally at the end.
//           this.store.dispatch(`${moduleName}/${actionName}`)
//         }

//         // If there are any nested sub-modules...
//         if (moduleDefinition.modules) {
//           // Also dispatch the action for these sub-modules.
//           this.dispatchActionForAllModules(actionName, moduleDefinition.modules)
//         }
//       }
//     }
//   }
// }
