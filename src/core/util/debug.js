/* @flow */

import config from '../config'
import { noop } from 'shared/util'
// 声明警告函数 空的程序执行体
export let warn = noop
// 声明提示函数 空的程序执行体
export let tip = noop
// 产生组件追踪
export let generateComponentTrace = (noop: any) // work around flow check
// 格式化组件名称
export let formatComponentName = (noop: any)
/** 如果开发环境不是生产模式的处理 */
if (process.env.NODE_ENV !== 'production') {
  /** 判断是否有定义console */
  const hasConsole = typeof console !== 'undefined'
  /** */
  const classifyRE = /(?:^|[-_])(\w)/g
  const classify = str => str
    .replace(classifyRE, c => c.toUpperCase())
    .replace(/[-_]/g, '')
  /** 警告函数 */
  warn = (msg, vm) => {
    const trace = vm ? generateComponentTrace(vm) : ''
    /** 对于有警告处理函数的处理，使用警告处理函数 */
    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace)
    } else if (hasConsole && (!config.silent)) {
      /** 对于没有警告处理函数的处理使用控制台输出 */
      console.error(`[Vue warn]: ${msg}${trace}`)
    }
  }
  /** 提示函数的实现 */
  tip = (msg, vm) => {
    if (hasConsole && (!config.silent)) {
      console.warn(`[Vue tip]: ${msg}` + (
        vm ? generateComponentTrace(vm) : ''
      ))
    }
  }
  /** 格式化组件名称函数 */
  formatComponentName = (vm, includeFile) => {
    /** 对于是根组件的处理 */
    if (vm.$root === vm) {
      return '<Root>'
    }
    const options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {}
    let name = options.name || options._componentTag
    const file = options.__file
    if (!name && file) {
      const match = file.match(/([^/\\]+)\.vue$/)
      name = match && match[1]
    }

    return (
      (name ? `<${classify(name)}>` : `<Anonymous>`) +
      (file && includeFile !== false ? ` at ${file}` : '')
    )
  }
  /** 重复函数的实现，将字符串重复多次 */
  const repeat = (str, n) => {
    let res = ''
    while (n) {
      if (n % 2 === 1) res += str
      if (n > 1) str += str
      n >>= 1
    }
    return res
  }
  /** 产生组件追踪 */
  generateComponentTrace = vm => {
    /** 对于组件是Vue对象且组件存在父组件 */
    if (vm._isVue && vm.$parent) {
      const tree = []
      let currentRecursiveSequence = 0
      while (vm) {
        /** 对于树的长度大于0的处理 */
        if (tree.length > 0) {
          const last = tree[tree.length - 1]
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++
            vm = vm.$parent
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence]
            currentRecursiveSequence = 0
          }
        }
        /** 向树中添加对象并设置vm为当前vm的父对象 */
        tree.push(vm)
        vm = vm.$parent
      }
      return '\n\nfound in\n\n' + tree
        .map((vm, i) => `${
          i === 0 ? '---> ' : repeat(' ', 5 + i * 2)
        }${
          Array.isArray(vm)
            ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
            : formatComponentName(vm)
        }`)
        .join('\n')
    } else {
      return `\n\n(found in ${formatComponentName(vm)})`
    }
  }
}
