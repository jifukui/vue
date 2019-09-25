/* @flow */
/* globals MessageChannel */

import { handleError } from './error'

// can we use __proto__?
export const hasProto = '__proto__' in {}

// Browser environment sniffing
/**isBrowser判断是否是浏览器根据是否存在window对象 */
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
/**为对象添加属性并且是课获取的 */
if (inBrowser) 
{
  try {
    const opts = {};
    /**设置在opts对象上定义属性passive */
    Object.defineProperty(opts, 'passive', ({
      get () {
        /* istanbul ignore next */
        supportsPassive = true
      }
    }: Object)) // https://github.com/facebook/flow/issues/285
    /**为属性添加监听器 */
    window.addEventListener('test-passive', null, opts)
  } catch (e) 
  {
    console.log("Add event listener have error "+e);
  }
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
let _isServer
export const isServerRendering = () => 
{
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
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

/* istanbul ignore next */
export function isNative (Ctor: any): boolean 
{
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

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

  // An asynchronous deferring mechanism.
  // In pre 2.4, we used to use microtasks (Promise/MutationObserver)
  // but microtasks actually has too high a priority and fires in between
  // supposedly sequential events (e.g. #4521, #6690) or even between
  // bubbling of the same event (#6566). Technically setImmediate should be
  // the ideal choice, but it's not available everywhere; and the only polyfill
  // that consistently queues the callback after all DOM events triggered in the
  // same loop is by using MessageChannel.
  /* istanbul ignore if */
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) 
  {
    timerFunc = () => 
    {
      setImmediate(nextTickHandler)
    }
  } 
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
  else
  {
    /* istanbul ignore next */
    if (typeof Promise !== 'undefined' && isNative(Promise)) 
    {
      // use microtask in non-DOM environments, e.g. Weex
      const p = Promise.resolve()
      timerFunc = () => 
      {
        p.then(nextTickHandler)
      }
    } 
    else 
    {
      // fallback to setTimeout
      timerFunc = () => 
      {
        setTimeout(nextTickHandler, 0)
      }
    }
  }

  return function queueNextTick (cb?: Function, ctx?: Object) 
  {
    let _resolve
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
/** */
let _Set
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) 
{
  // use native Set when available.
  _Set = Set
} 
else 
{
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = class Set implements ISet 
  {
    set: Object;
    constructor () 
    {
      this.set = Object.create(null)
    }
    has (key: string | number) 
    {
      return this.set[key] === true
    }
    add (key: string | number) 
    {
      this.set[key] = true
    }
    clear () {
      this.set = Object.create(null)
    }
  }
}

interface ISet 
{
  has(key: string | number): boolean;
  add(key: string | number): mixed;
  clear(): void;
}

export { _Set }
export type { ISet }
