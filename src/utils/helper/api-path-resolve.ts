// utils/helper/api-path-resolve.ts

export default function(path: string, params: { [prop: string]: string }) {
  let regex

  Object.keys(params).forEach(target => {
    regex = new RegExp(`{${target}}`)

    path = path.replace(regex, params[target])
  })

  return path
}
