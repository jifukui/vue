/* @flow */

import { warn } from 'core/util/index'
import { cached, isUndef } from 'shared/util'
/**规范化事件名称 */
const normalizeEvent = cached((name: string): 
{
  name: string,
  once: boolean,
  capture: boolean,
  passive: boolean
} => {
  const passive = name.charAt(0) === '&'
  name = passive ? name.slice(1) : name
  const once = name.charAt(0) === '~' // Prefixed last, checked first
  name = once ? name.slice(1) : name
  const capture = name.charAt(0) === '!'
  name = capture ? name.slice(1) : name
  return {
    name,
    once,
    capture,
    passive
  }
})
/**
 * 创建祈求函数
 * @param {*} fns 函数或者是函数数组 
 */
export function createFnInvoker (fns: Function | Array<Function>): Function 
{
  /**
   * 祈求函数
   */
  function invoker () 
  {
    /**获取fns的值为祈求的处理函数 */
    const fns = invoker.fns;
    /**如果处理函数为数组的处理 */
    if (Array.isArray(fns)) 
    {
      const cloned = fns.slice()
      for (let i = 0; i < cloned.length; i++) 
      {
        cloned[i].apply(null, arguments)
      }
    } 
    /**反之调用函数的 */
    else 
    {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  /**设置处理函数 */
  invoker.fns = fns
  /**返回对象 */
  return invoker
}
/**
 * 更新监听器
 * @param {*} on 
 * @param {*} oldOn 
 * @param {*} add 
 * @param {*} remove 
 * @param {*} vm 
 */
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) 
{
  let name, cur, old, event
  for (name in on) 
  {
    cur = on[name]
    old = oldOn[name]
    /**规范化事件名称 */
    event = normalizeEvent(name)
    /**如果当前属性未定义的处理，未处理 */
    if (isUndef(cur)) 
    {
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } 
    /**如果在老的兑现中未定义的处理
     * 如果在行动对象中的fns属性未定义创建新的
     * 执行添加操作
     */
    else if (isUndef(old)) 
    {
      if (isUndef(cur.fns)) 
      {
        cur = on[name] = createFnInvoker(cur)
      }
      add(event.name, cur, event.once, event.capture, event.passive)
    } 
    /**如果新的对象不等于老的对象的处理设置老的处理函数为新的 */
    else if (cur !== old) 
    {
      old.fns = cur
      on[name] = old
    }
  }
  /**遍历存在于老的对象中的属性，
   * 如果此对象不存在规范化此事件名，然后移除此事件名
   */
  for (name in oldOn) 
  {
    if (isUndef(on[name])) 
    {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
