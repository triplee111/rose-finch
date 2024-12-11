/**
 * Service container
 *
 * author: Markus Oberlehner
 * from: https://markus.oberlehner.net/blog/the-ioc-container-pattern-with-vue/
 *
 * edited by: Wilson
 */
import camelCase from 'lodash/camelCase'

const requireModule = require.context(
  // Search for files in the repository directory.
  '@core/repository',
  // Search for files in subdirectories.
  true,
  // Include any .js or .ts files that are not this file or a unit test or types.
  /^((?!index|types|\.unit\.).)*\.(ts|js)$/
)

export default {
  ...requireModule.keys().reduce((prev, fileName) => {
    const repositoryName = `$${camelCase(
      fileName
        // Remove the "./" from the beginning.
        .replace(/^\.\//, '')
        // Remove the file extension from the end.
        .replace(/\.\w+$/, '')
    )}`

    const RepoService = requireModule(fileName).default

    return {
      ...prev,
      [repositoryName]: RepoService
    }
  }, {})
} as {
  [props: string]: { [funcName: string]: (...args: any) => Promise<any> | void }
}
