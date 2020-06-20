/* @flow */
/** vue-master\src\core\util\util.js 错误处理相关函数*/
import config from '../config'
import { warn } from './debug'
import { inBrowser } from './env'
/**
 * 错误处理函数
 * @param {*} err 错误
 * @param {*} vm 组件
 * @param {*} info 信息
 */
export function handleError (err: Error, vm: any, info: string) {
  // 组件的值为真
  if (vm) {
    let cur = vm
    // 获取父组件
    while ((cur = cur.$parent)) {
      /** 获取组件上的错误捕获函数 */
      const hooks = cur.$options.errorCaptured
      // 对于存在错误捕获函数的处理
      if (hooks) {
        // 遍历错误捕获函数
        for (let i = 0; i < hooks.length; i++) {
          try {
            /** 错误捕捉 */
            const capture = hooks[i].call(cur, err, vm, info) === false
            if (capture) {
              return
            }
          } catch (e) {
            /** 使用全局错误处理函数进行错误的处理 */
            globalHandleError(e, cur, 'errorCaptured hook')
          }
        }
      }
    }
  }
  /** 使用全局错误处理函数进行错误的处理 */
  globalHandleError(err, vm, info)
}
/**
 * 全局错误处理函数
 * @param {*} err 错误对象
 * @param {*} vm 组件对象
 * @param {*} info 错误信息
 */
function globalHandleError (err, vm, info) {
  /** 判断是否配置了错误处理 */
  if (config.errorHandler) {
    try {
      /** 调用错误处理 */
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      /** 输出错误信息 */
      logError(e, null, 'config.errorHandler')
    }
  }
  /** 输出错误信息 */
  logError(err, vm, info)
}
/**
 * 错误信息输出函数
 * @param {*} err 错误对象
 * @param {*} vm 组件对象
 * @param {*} info 错误信息
 */
function logError (err, vm, info) {
  /** 对于开发环境不是生产模式输出错误原因和错误 */
  if (process.env.NODE_ENV !== 'production') {
    warn(`Error in ${info}: "${err.toString()}"`, vm)
  }
  /** 对于是浏览器且console的类型为函数使用console.error输出错误信息 */
  if (inBrowser && typeof console !== 'undefined') {
    console.error(err)
  } else {
    throw err
  }
}
/** end vue-master\src\core\util\util.js */