/* @flow */
/* globals MessageChannel */
/**vue-master\src\core\util\env.js主要是判断寄主环境 */
import { handleError } from './error'

// can we use __proto__?
export const hasProto = '__proto__' in {}

// Browser environment sniffing
/**isBrowser判断是否是浏览器根据是否存在window对象，返回的是一个布尔值 */
export const inBrowser = typeof window !== 'undefined'
/**如果是浏览器获取用户代理 */
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
/**判断浏览器是否是IE的内核 */
export const isIE = UA && /msie|trident/.test(UA)
/**判断浏览器是否是IE9 */
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
/**判断浏览器是否是edge浏览器 */
export const isEdge = UA && UA.indexOf('edge/') > 0
/**判断是否是安卓的浏览器 */
export const isAndroid = UA && UA.indexOf('android') > 0
/**判断是否是IOS的浏览器 */
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
/**判断是否是谷歌的浏览器 */
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge

// Firefox has a "watch" function on Object.prototype...
export const nativeWatch = ({}).watch

export let supportsPassive = false
/**对于inBrower的值不为否的处理
 * 给全局变量添加属性和监听器
 */
if (inBrowser) 
{
  try {
    const opts = {};
    /**设置在opts对象上定义属性passive的获取函数 */
    Object.defineProperty(opts, 'passive', ({
      get () {
        /* istanbul ignore next */
        supportsPassive = true
      }
    }: Object)) 
    // https://github.com/facebook/flow/issues/285
    /**为对象添加 */
    window.addEventListener('test-passive', null, opts)
  } 
  catch (e) 
  {
    console.log("Add event listener have error "+e);
  }
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
let _isServer
/**服务器端渲染的处理
 * 设置_isServer属性的值
 */
export const isServerRendering = () => 
{
  /**对于服务器未定义的处理 */
  if (_isServer === undefined) 
  {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') 
    {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server'
    } 
    else 
    {
      _isServer = false
    }
  }
  return _isServer
}

// detect devtools
/**设置devtool的值 */
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

/* istanbul ignore next */
/**判断是否是原生的 */
export function isNative (Ctor: any): boolean 
{
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
/**判断undefined是否是原生的 */
export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

/**
 * Defer a task to execute it asynchronously.
 */
/** 定义nextTick函数
 * 
*/
export const nextTick = (function () 
{
  const callbacks = []
  let pending = false
  let timerFunc
  /**定义下一个时刻处理函数 
   * 根据浏览器的情况进行下一时刻处理函数的处理
  */
  function nextTickHandler () 
  {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) 
    {
      copies[i]()
    }
  }
  /**对于setImmediate不是未定义的且是原生的处理
   * 设置事件处理函数
   */
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) 
  {
    timerFunc = () => 
    {
      setImmediate(nextTickHandler)
    }
  } 
  /**如果对于MessageChannel不是未定义的处理，使用MessaeChannel */
  else if (typeof MessageChannel !== 'undefined' && 
  (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]'
  )) 
  {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = nextTickHandler
    timerFunc = () => {
      port.postMessage(1)
    }
  } 
  /**对于没有以上两个函数的处理 */
  else
  {
    /* istanbul ignore next */
    /**对于有Promise的处理 */
    if (typeof Promise !== 'undefined' && isNative(Promise)) 
    {
      // use microtask in non-DOM environments, e.g. Weex
      const p = Promise.resolve()
      timerFunc = () => 
      {
        p.then(nextTickHandler)
      }
    } 
    /**实在是啥也没有使用timeout处理 */
    else 
    {
      // fallback to setTimeout
      timerFunc = () => 
      {
        setTimeout(nextTickHandler, 0)
      }
    }
  }
  /**返回任务回调函数入队函数 */
  return function queueNextTick (cb?: Function, ctx?: Object) 
  {
    let _resolve;
    /**回调函数入队 */
    callbacks.push(() => 
    {
      if (cb) 
      {
        try 
        {
          cb.call(ctx)
        } 
        catch (e) 
        {
          handleError(e, ctx, 'nextTick')
        }
      } 
      else if (_resolve) 
      {
        _resolve(ctx)
      }
    })
    if (!pending) 
    {
      pending = true
      timerFunc()
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') 
    {
      return new Promise((resolve, reject) => 
      {
        _resolve = resolve
      })
    }
  }
})()
/**判断定义Set是否是原生的
 * 对于是原生的处理是设置_Set为Set
 * 反之
 */
let _Set
if (typeof Set !== 'undefined' && isNative(Set)) 
{
  // use native Set when available.
  _Set = Set
} 
else 
{
  // a non-standard Set polyfill that only works with primitive keys.
  /**设置Set类匹配ISet */
  _Set = class Set implements ISet 
  {
    set: Object;
    /**构造函数 */
    constructor () 
    {
      this.set = Object.create(null)
    }
    /**has函数的实现 */
    has (key: string | number) 
    {
      return this.set[key] === true
    }
    /**add函数的实现 */
    add (key: string | number) 
    {
      this.set[key] = true
    }
    /**clear函数的实现 */
    clear () 
    {
      this.set = Object.create(null)
    }
  }
}
/**定义接口类型ISet */
interface ISet 
{
  has(key: string | number): boolean;
  add(key: string | number): mixed;
  clear(): void;
}

export { _Set }
export type { ISet }
