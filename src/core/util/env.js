/* @flow */
/* globals MessageChannel */
/** vue-master\src\core\util\env.js主要是判断寄主环境 */
import { handleError } from './error'

// can we use __proto__?
/** 对象是否具有__proto__属性 */
export const hasProto = '__proto__' in {}

// Browser environment sniffing
/** isBrowser判断是否是浏览器根据是否存在window对象，返回的是一个布尔值 */
export const inBrowser = typeof window !== 'undefined'
/** 如果是浏览器获取用户代理 */
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
/** 判断浏览器是否是IE的内核 */
export const isIE = UA && /msie|trident/.test(UA)
/** 判断浏览器是否是IE9 */
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
/** 判断浏览器是否是edge浏览器 */
export const isEdge = UA && UA.indexOf('edge/') > 0
/** 判断是否是安卓的浏览器 */
export const isAndroid = UA && UA.indexOf('android') > 0
/** 判断是否是IOS的浏览器 */
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
/** 判断是否是谷歌的浏览器 */
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge

// Firefox has a "watch" function on Object.prototype...
/** 原生对象是否具有watch功能 */
export const nativeWatch = ({}).watch

export let supportsPassive = false
/** 对于inBrower的值不为否的处理
 * 给全局变量添加属性和监听器
 */
if (inBrowser) {
  try {
    const opts = {}
    /** 设置在opts对象上定义属性passive的获取函数 */
    Object.defineProperty(opts, 'passive', ({
      get () {
        /* istanbul ignore next */
        supportsPassive = true
      }
    } : Object)) 
    // https://github.com/facebook/flow/issues/285
    /** 为对象添加 */
    window.addEventListener('test-passive', null, opts)
  } catch (e) {
    console.log("Add event listener have error " + e)
  }
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
let _isServer

/** 判断是否是服务器端渲染
 *  设置_isServer属性的值
 */
export const isServerRendering = () => {
  /** 对于服务器未定义的处理 */
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}

// detect devtools
/** 设置devtool的值 */
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

/* istanbul ignore next */
/** 判断是否是原生的 */
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
/** 判断是否支持Symbol和Reflect*/
export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

/** 
 * 定义nextTick函数
*/
export const nextTick = (function () {
  /** 回调函数数组 */
  const callbacks = []
  /** 挂起状态 */
  let pending = false
  /** 计时器函数 */
  let timerFunc
  /** 定义下一个时刻处理函数
   * 根据浏览器的情况进行下一时刻处理函数的处理
  */
  function nextTickHandler () {
    pending = false
    // 获取回调处理函数的第一个值
    const copies = callbacks.slice(0)
    // 设置回调处理函数的长度为0
    callbacks.length = 0
    // 调用回调函数
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  /** 对于setImmediate不是未定义的且是原生的处理
   * 设置事件处理函数，setImmediate好像只有IE支持
   */
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = () => {
      setImmediate(nextTickHandler)
    }
  } else if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) || MessageChannel.toString() === '[object MessageChannelConstructor]')) {
    // MessageChannel的值不是未定义且MessageChannel是原生的或者MessageChannel转换为字符串的值为object MessageChannelConstructor
    // 一般会使用这个进行执行
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = nextTickHandler
    timerFunc = () => {
      port.postMessage(1)
    }
  } else {
    /** 对于支持Promise的处理 */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      const p = Promise.resolve()
      timerFunc = () => {
        p.then(nextTickHandler)
      }
    } else {
      // 对于上述的方法都不支持使用settimeout函数实现调用
      timerFunc = () => {
        setTimeout(nextTickHandler, 0)
      }
    }
  }
  /** 返回任务回调函数入队函数，回调函数入队
   * cb:回调函数
   * ctx:参数
   */
  return function queueNextTick (cb?: Function, ctx?: Object) {
    let _resolve
    /** 回调函数入队 */
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      timerFunc()
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        _resolve = resolve
      })
    }
  }
})()

/** 设置集合_Set
 *  如果支持Set使用原生的Set
 *  如果不支持Set实现Set方法
 */
let _Set
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  /** 设置Set类匹配ISet */
  _Set = class Set implements ISet {
    set: Object;
    /** 构造函数，创建一个没有原型链的对象 */
    constructor () {
      this.set = Object.create(null)
    }
    /** has函数的实现，即判断集合中是否有此参数 */
    has (key: string | number) {
      return this.set[key] === true
    }
    /** add函数的实现，向集合中添加数据*/
    add (key: string | number) {
      this.set[key] = true
    }
    /** clear函数的实现,设置set的值为一个空对对象没有原型链 */
    clear () {
      this.set = Object.create(null)
    }
  }
}
/** 定义接口类型ISet */
interface ISet
{
  has(key: string | number): boolean;
  add(key: string | number): mixed;
  clear(): void;
}

export { _Set }
export type { ISet }
