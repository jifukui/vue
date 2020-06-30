/**
 * 引入路径
 */
const path = require('path')
/**
 * 
 * @param {*} p 
 */
const resolve = p => path.resolve(__dirname, '../', p)
/** 设置这些文件名对应的路径 */
module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  entries: resolve('src/entries'),
  sfc: resolve('src/sfc')
}
