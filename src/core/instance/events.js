/* @flow */

import {
  tip,
  toArray,
  hyphenate,
  handleError,
  formatComponentName
} from '../util/index'
import { updateListeners } from '../vdom/helpers/index'
/** 初始化事件
 * 初始化组件的事件对象为空对象
 * 创建空的事件对象
 * 设置有钩子事件为否
 * 获取父监听处理，如果有更新组件监听
*/
/**
 * 事件初始化
 * @param {*} vm 组件对象
 * 初始化组件的事件对象
 * 初始化组件有钩子事件为否
 */
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  /** 获取 */
  // 父组件接收子组件的消息时会在子组件上存在此对象
  const listeners = vm.$options._parentListeners
  /** 如果组件的存在父组件的监听器属性的处理
   * 更新当前组件的监听器
   */
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

let target: Component
/**
 * 对象添加事件监听
 * @param {*} event 事件名称
 * @param {*} fn 事件处理函数
 * @param {*} once 是否只执行一次
 */
function add (event, fn, once) {
  if (once) {
    target.$once(event, fn)
  } else {
    target.$on(event, fn)
  }
}
/**
 * 移除事件监听
 * @param {*} event 事件名称
 * @param {*} fn 处理函数
 */
function remove (event, fn) {
  target.$off(event, fn)
}
/**
 * 更新组件的监听器
 * @param {*} vm 组件
 * @param {*} listeners 监听器
 * @param {*} oldListeners 老的监听器
 */
export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  /** 调用监听器的更新方法 */
  updateListeners(listeners, oldListeners || {}, add, remove, vm)
}
/** 事件混合，将事件添加至事件数组中
 * event：事件名称
 * fn:事件处理函数
 * 对于事件为数组，按序进行处理
 * 对于事件为字符串，将此对象添加至事件数组中如果是以hook:开始的设置对象具有hook处理事件的状态值为真
 */
export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  /** 定义组件监听的自定义事件
   * event事件名称或者是字符串数组
   * fn：方法
   */
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    // 对于传入的事件名称为数组的处理
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      // 向此事件中添加此处理函数
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      // 如果事件名称是以hook开始的设置对象具有hook事件
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }
  /** once，设置事件只执行一次
   * event:事件
   * fn:函数
   */
  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    /** 定义删除此对象，然后调用此函数 */
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }
  /** 删除事件处理函数中的处理项
   * event：
   * fn:
   * 如果传入的参数不为0，设置对象的事件对象为空对象返回此对象
   * 如果事件为数组分别调用off函数返回vm
   * 从事件属性对象中获取对应的属性
   * 如果为空返回
   * 如果参数的长度为1设置事件处理函数为空返回对象
   * 如果处理函数存在
   */
  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // 如果参数不为0的处理
    console.log('I have called')
    console.log(arguments.length)
    // 传入参数的个数为0删除此对象的所有事件
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // 如果事件是数组的处理，删除这些事件的这个函数
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
    // 对于只是一个事件如果参数为1删除此事件的所有方法，如果方法存在删除此事件的这个函数
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null
      return vm
    }
    if (fn) {
      // specific handler
      let cb
      let i = cbs.length
      while (i--) {
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }
  /** 子组件向父组件传输消息，调用对应的处理函数
   * event：
   * 设置vm为当前的对象
   * 设置cbs:为当前
   */
  Vue.prototype.$emit = function (event: string): Component {
    // 设置vm为当前的Vue对象
    const vm: Component = this
    // 对于不是生产模式的处理
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    /**
     * 从组件注册的事件获取此事件的回调函数，这里对vm对象是子组件
     */
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args)
        } catch (e) {
          handleError(e, vm, `event handler for "${event}"`)
        }
      }
    }
    return vm
  }
}
