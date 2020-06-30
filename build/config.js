/** 引入path node标准函数用于处理路径相关内容*/
const path = require('path')
/** 引入 */
const buble = require('rollup-plugin-buble')
/** */
const alias = require('rollup-plugin-alias')
/** */
const cjs = require('rollup-plugin-commonjs')
/** */
const replace = require('rollup-plugin-replace')
/** */
const node = require('rollup-plugin-node-resolve')
/** */
const flow = require('rollup-plugin-flow-no-whitespace')
/** 定义Web程序的版本号 */
const version = process.env.VERSION || require('../package.json').version
/** */
const weexVersion = process.env.WEEX_VERSION || require('../packages/weex-vue-framework/package.json').version

function Displayinfo(value) {
  for (let i in value) {
    if (Object.prototype.toString.call(value[i]) === '[object Object]') {
      console.log('The Object protoprotype')
      Displayinfo(value[i])
    } else {
      console.log(i + ' value is ' + value[i])
    }
  }
}
/** 创建不可修改变量即打印信息，即程序的标准信息 */
const banner =
  '/*!\n' +
  ' * Vue.js v' + version + '\n' +
  ' * (c) 2014-' + new Date().getFullYear() + ' Evan You\n' +
  ' * Released under the MIT License.\n' +
  ' */'
/** 创建不可修改变量，weex工厂插件 */
const weexFactoryPlugin = {
  intro () {
    return 'module.exports = function weexFactory (exports, document) {'
  },
  outro () {
    return '}'
  }
}
/** 获取指定参数的绝对路径 */
const aliases = require('./alias')

/** 获取传入路径的绝对路径
 *  对存储在alias的路径进行转换
 */
const resolve = p => {
  const base = p.split('/')[0]
  // 对于第一个/号前的在aliases的处理,将路径进行拼接
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    // 对于不存在于aliases的处理
    return path.resolve(__dirname, '../', p)
  }
}
/** 建立打包规则对象,即创建创建实例 */
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),         // 入口JS文件地址
    dest: resolve('dist/vue.runtime.common.js'),    // 出口js文件地址
    format: 'cjs',                                  // 构建的格式
    banner                                          // 注释信息
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'), 
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // runtime-only production build (Browser)
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // Web compiler (CommonJS).
  'web-compiler': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-template-compiler/package.json').dependencies)
  },
  // Web compiler (UMD for in-browser use).
  'web-compiler-browser': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/browser.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'VueTemplateCompiler',
    plugins: [node(), cjs()]
  },
  // Web server renderer (CommonJS).
  'web-server-renderer': {
    entry: resolve('web/entry-server-renderer.js'),
    dest: resolve('packages/vue-server-renderer/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-basic-renderer': {
    entry: resolve('web/entry-server-basic-renderer.js'),
    dest: resolve('packages/vue-server-renderer/basic.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'renderVueComponentToString',
    plugins: [node(), cjs()]
  },
  'web-server-renderer-webpack-server-plugin': {
    entry: resolve('server/webpack-plugin/server.js'),
    dest: resolve('packages/vue-server-renderer/server-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-webpack-client-plugin': {
    entry: resolve('server/webpack-plugin/client.js'),
    dest: resolve('packages/vue-server-renderer/client-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // Weex runtime factory
  'weex-factory': {
    weex: true,
    entry: resolve('weex/entry-runtime-factory.js'),
    dest: resolve('packages/weex-vue-framework/factory.js'),
    format: 'cjs',
    plugins: [weexFactoryPlugin]
  },
  // Weex runtime framework (CommonJS).
  'weex-framework': {
    weex: true,
    entry: resolve('weex/entry-framework.js'),
    dest: resolve('packages/weex-vue-framework/index.js'),
    format: 'cjs'
  },
  // Weex compiler (CommonJS). Used by Weex's Webpack loader.
  'weex-compiler': {
    weex: true,
    entry: resolve('weex/entry-compiler.js'),
    dest: resolve('packages/weex-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/weex-template-compiler/package.json').dependencies)
  }
}
/** 创建配置文件，即根据builds进行处理
 * name为获取的键值，生成rollup支持的格式
 */
function genConfig (name) {
  // 获取键内容
  const opts = builds[name]
  const config = {
    // 设置输入文件
    input: opts.entry,
    // 设置扩展文件
    external: opts.external,
    // 设置插件
    plugins: [
      replace({
        __WEEX__: !!opts.weex,
        __WEEX_VERSION__: weexVersion,
        __VERSION__: version
      }),
      flow(),
      buble(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    // 设置输出文件
    output: {
      // 输出文件名
      file: opts.dest,
      // 输出文件格式
      format: opts.format,

      banner: opts.banner,
      // 输出模块的名字
      name: opts.moduleName || 'Vue'
    }
  }
  // 对于定义环境的处理
  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  // 对于定义_name的处理
  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })
  // 返回配置的对象
  return config
}
/** 如果过程环境设置存在 */
if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  // 如果不存在设置getBuild的值为genConfig
  // 创建创建文件
  exports.getBuild = genConfig
  // 获取所有的配置的build文件
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
