const path = require('path')
const proj = require('./config')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin({
  disable: !process.env.MEASURE
})

const PROCESS_ENV = 'process.env'

const isOfficial =
  process.env.NODE_ENV === 'production' &&
  process.env.VUE_PRODUCTION_TYPE === 'official'

const port = 3000

// 開發模式使用
const proxyTarget =
  process.env.VUE_APP_API && process.env.VUE_APP_API.match(/localhost:/g)
    ? `${process.env.VUE_APP_API}${port}/`
    : process.env.VUE_APP_API

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? proj.assets : '/',
  outputDir: `dist/${proj.name}`,
  assetsDir: 'adm',
  productionSourceMap: !isOfficial,
  css: {
    sourceMap: !isOfficial
  },

  lintOnSave: process.env.NODE_ENV !== 'production',

  configureWebpack: smp.wrap({
    entry: `./src/app/${proj.name}/main.ts`,
    externals: {
      jquery: 'jQuery'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': resolve(`src/app/${proj.name}`),
        '@css': resolve(`src/app/${proj.name}/assets/css`),
        '@img': resolve(`src/app/${proj.name}/assets/img`),
        '@js': resolve(`src/app/${proj.name}/assets/js`),
        '@src': resolve('src'),
        '@core': resolve('src/core'),
        '@c': resolve('src/component'),
        '@m': resolve('src/module'),
        '@t': resolve('src/theme'),
        '@u': resolve('src/utils'),
        '@public': resolve('public/static')
      }
    }
  }),

  devServer: {
    allowedHosts: ['.ngrok.io'],
    port: 8000,
    proxy: {
      '/api': {
        target: proxyTarget, // target host
        changeOrigin: true, // needed for virtual hosted sites
        secure: false, // boolean, if you want to verify the SSL Certs
        pathRewrite: {
          '^/api/': '/'
        }
      }
    }
    // ref: https://github.com/chimurai/http-proxy-middleware : full proxy middleware options
  },

  chainWebpack: config => {
    /**
     * --------------------------------------------------------------------------------------
     * HappyPack plugin:
     *
     * .ts/.tsx 檔案解析啟用 happypack 分成多個 process 處理
     * --------------------------------------------------------------------------------------
     */
    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.happyPackMode = true

        return options
      })
    config.module
      .rule('tsx')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.happyPackMode = true

        return options
      })

    /**
     * --------------------------------------------------------------------------------------
     * Copy plugin:
     *
     * 設定 public folder 打包後不需複製的檔案
     * --------------------------------------------------------------------------------------
     */
    config.plugins.delete('copy')

    /**
     * --------------------------------------------------------------------------------------
     * Define plugin
     *
     * 傳送路徑參數至專案
     * --------------------------------------------------------------------------------------
     */
    config.plugin('define').tap(args => {
      Object.assign(args[0][PROCESS_ENV], {
        PROJ_PATH: JSON.stringify(proj.name),
        PROJ_PLATFORM: JSON.stringify(proj.platform.name),
        PROJ_PLATFORM_TITLE: JSON.stringify(proj.platform.title),
        PROJ_ROUTER_BASE: JSON.stringify(proj.routerBase),
        PROJ_UPLOAD_PATH: JSON.stringify(proj.upload)
      })

      return args
    })

    /**
     * --------------------------------------------------------------------------------------
     * Html plugin
     *
     * 基本模版設定，改用 index.pug
     * --------------------------------------------------------------------------------------
     */
    config.plugin('html').tap(args => {
      const template = resolve('public/index.pug')

      args[0].filename =
        process.env.NODE_ENV === 'production' ? 'adm.html' : 'index.html'

      args[0].template = template
      args[0].inject = true

      if (isOfficial) {
        args[0].minify = {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
      }

      return args
    })

    /**
     * --------------------------------------------------------------------------------------
     * Images rule
     *
     * 設定輸出的圖片格式與位置
     * --------------------------------------------------------------------------------------
     */
    const imagesRule = config.module.rule('images')

    imagesRule
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.fallback.options.name = 'adm/img/[name].[hash:6].[ext]'
        return options
      })

    /**
     * --------------------------------------------------------------------------------------
     * Typescript checker plugin
     *
     * 子專案可以進一步使用各別設定的 tsconfig
     * --------------------------------------------------------------------------------------
     */
    const ForkTsChecker = require('fork-ts-checker-webpack-plugin')
    config.plugin('fork-ts-checker').use(ForkTsChecker, [
      {
        typescript: {
          configFile: `src/app/${proj.name}/tsconfig.json`,
          memoryLimit: 2048,
          extensions: {
            vue: true
          }
        }
      }
    ])

    /**
     * --------------------------------------------------------------------------------------
     * Bundle analyzer plugin
     *
     * 透過 cmd 方式啟用 webpack bundle analyzer server
     * 單純輸出報告使用 vue-cli build 模式預設參數 --report
     * --------------------------------------------------------------------------------------
     */
    if (process.env.WEBPACK_ANALYZE) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin

      config
        .plugin('webpack-bundle-analyzer')
        .use(BundleAnalyzerPlugin)
        .tap(args => {
          args.push({
            analyzerMode: 'server',
            analyzerPort: 7777
          })

          return args
        })
    }

    /**
     * --------------------------------------------------------------------------------------
     * Svg sprite plugin
     *
     * 各專案 assets/svg/icon 內的檔案，組合成 sprite 並自動注入 APP，透過 wrapper: SvgIcon 元件調用
     * --------------------------------------------------------------------------------------
     */
    const SvgSpritePlugin = require('svg-sprite-loader/plugin')

    const svgRule = config.module.rule('svg')
    const svgSpriteRule = config.module.rule('svg-sprite-loader')

    svgRule.exclude.add(resolve(`src/app/${proj.name}/assets/svg/icon`)).end()

    svgSpriteRule
      .test(/\.(svg)(\?.*)?$/)
      .include.add(resolve(`src/app/${proj.name}/assets/svg/icon`))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        extract: true,
        spriteFilename: svgPath =>
          `${path.basename(path.dirname(svgPath))}.[hash:6].svg`,
        symbolId: svgPath =>
          `${path.basename(path.dirname(svgPath))}-${path.basename(
            svgPath,
            '.svg'
          )}`,
        publicPath: 'adm/img/'
      })

    svgSpriteRule.use('svgo-loader').loader('svgo-loader')

    config
      .plugin('svg-sprite')
      .use(SvgSpritePlugin)
      .tap(args => {
        args[0] = {
          plainSprite: true
        }
        return args
      })

    /**
     * --------------------------------------------------------------------------------------
     * Ignore plugin
     *
     * 忽略指定的套件
     * --------------------------------------------------------------------------------------
     */
    const Ignore = require('webpack/lib/IgnorePlugin')

    // Ignore all locale files of moment.min.js
    config.plugin('ignore').use(Ignore, [/^\.\/locale$/, /moment.min$/])

    /**
     * --------------------------------------------------------------------------------------
     * Terser plugin
     *
     * webpack v4 預設使用的 js 壓縮套件
     * --------------------------------------------------------------------------------------
     */
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },

  pluginOptions: {
    quasar: {
      treeShake: true
    }
  },

  transpileDependencies: [/[\\/]node_modules[\\/]quasar[\\/]/]
}

function resolve(dir) {
  return path.join(__dirname, dir)
}
