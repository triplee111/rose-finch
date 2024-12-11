// utils/progress/nprogress.ts

import './style.styl'

import NProgress from 'nprogress'

const defaults = {
  template:
    '<div class="bar" role="bar"><div class="peg"></div></div><div class="progress-groove"></div>'
}

NProgress.configure(defaults)

export default NProgress
