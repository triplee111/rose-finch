// utils/filter/grid-data-filter.ts

import {
  filter,
  values,
  join,
  toLower,
  includes,
  trim,
  compose,
  useWith,
  identity
} from 'ramda'

const pred = useWith(includes, [
  identity,
  compose(
    toLower,
    join(' '),
    values
  )
])

// fn :: String -> [a] -> [a]
export default useWith(filter, [
  compose(
    pred,
    trim
  ),
  identity
])
