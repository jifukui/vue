/* @flow */

import { warn } from 'core/util/index'
import { cached, isUndef } from 'shared/util'
/**
 * 事件名称规范化
 */
const normalizeEvent = cached((name: string): {
  name: string,
  once: boolean,
  capture: boolean,
  passive: boolean
} => {
  // 第一个字符是否为&
  const passive = name.charAt(0) === '&'
  // 获取名称
  name = passive ? name.slice(1) : name
  // 第一个字符为~
  const once = name.charAt(0) === '~' // Prefixed last, checked first
  name = once ? name.slice(1) : name
  // 第一个字符为!
  const capture = name.charAt(0) === '!'
  name = capture ? name.slice(1) : name
  return {
    name, // 事件名称
    once, // 第一个字符是否是&字符
    capture, // 第一个字符是否为~
    passive // 第一个字符是否为!
  }
})
/**
 * 创建祈求函数
 * @param {*} fns 函数或者是函数数组
 */
export function createFnInvoker (fns: Function | Array<Function>): Function {
  /**
   * 祈求函数
   */
  function invoker () {
    /** 获取fns的值为祈求的处理函数 */
    const fns = invoker.fns;
    /** 如果处理函数为数组的处理 */
    if (Array.isArray(fns)) {
      const cloned = fns.slice()
      for (let i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments)
      }
    } else {
      return fns.apply(null, arguments)
    }
  }
  /** 设置处理函数 */
  invoker.fns = fns
  /** 返回对象 */
  return invoker
}
/**
 * 更新监听器
 * @param {*} on 新的监听器
 * @param {*} oldOn 老的监听器
 * @param {*} add 添加函数
 * @param {*} remove 删除函数
 * @param {*} vm Vue对象
 */
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, cur, old, event
  // 遍历父监听器中的监听的事件
  for (name in on) {
    cur = on[name]
    old = oldOn[name]
    /** 规范化事件名称 */
    event = normalizeEvent(name)
    /** 如果当前属性未定义的处理，跳过 */
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } else if (isUndef(old)) {
       /**
        * 事件监听在新的监听器中存在但是在老的监听器中不存在，但是没有定义回调函数的处理
        * 设置新的监听器的值为创建祈求函数
        */
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      // 添加事件监听
      add(event.name, cur, event.once, event.capture, event.passive)
    } else if (cur !== old) {
      /** 如果新的对象不等于老的对象的处理设置老的处理函数为新的 */
      old.fns = cur
      on[name] = old
    }
  }
  /** 遍历存在于老的对象中的属性，
   * 如果监听的时间函数不存在，删除此事件处理中的老的处理函数
   */
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
