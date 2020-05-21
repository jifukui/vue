/**
 * 构建Vue的项目
 */
/** 文件系统 */
const fs = require('fs')
/** 路径 */
const path = require('path')
/** 压缩 */
const zlib = require('zlib')
/** */
const rollup = require('rollup')
/** */
const uglify = require('uglify-js')

/** 判断是否存在此路径对于不存在此路径的创建此目录，这个目录是用于存放生成的最终文件的路径 */
if (!fs.existsSync('dist')) 
{
  fs.mkdirSync('dist')
}
/** 定义 */
let builds = require('./config').getAllBuilds()
console.log("the process.arg is "+process.argv[0]);
// filter builds via command line arg
//过滤环境变量第一个环境变量是node的路径，第二个环境变量是当前脚本的路径，没有第三个变量
if (process.argv[2]) 
{
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
}
//所以当前的情况是这个执行的是没有weex的键名 
else 
{
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}
console.log("process value is "+process.env.NODE_ENV);
//构建相关的文件
build(builds)
/**
 * 构建函数
 * @param {*} builds 
 */
function build (builds) {
  let built = 0
  // 总的构建的数量
  const total = builds.length
  // 
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}
/**
 * 创建实例，rollup最终生成的文件
 * @param {*} config 配置信息
 */
function buildEntry (config) {
  const output = config.output
  //
  const { file, banner } = output
  // 
  const isProd = /min\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      if (isProd) {
        var minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}
/**
 * 
 * @param {*} dest 
 * @param {*} code 
 * @param {*} zip 
 */
function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}
/**
 * 将文件的大小转换为kb单位
 * @param {*} code 
 */
function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
/**
 * 输出错误信息
 * @param {*} e 
 */
function logError (e) {
  console.log(e)
}
/**
 * 输出绿色内容
 * @param {*} str 
 */
function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
