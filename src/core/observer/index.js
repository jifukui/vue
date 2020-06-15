/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'
/** 获取对象的所用属性名称 */
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
/** 设置observerState的值 */
export const observerState = {
  shouldConvert: true
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
/** 定义Observer类 观察类
 * value:对象
 * dep:依赖
 * vmCount:
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data
  /** 构造函数，
   * 设置对象的值为
   */
  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    /** 定义对象的__ob__属性 */
    def(value, '__ob__', this)
    /** 对于值为数组的处理 */
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  /** 获取对象的所有键值
   * 定义
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
/** 设置target的__proto__属性为src */
function protoAugment (target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/** 拷贝参数
 * 将src中的keys属性拷贝到target对象中
 */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
/**
 * value：
 * asRootData：
 * 返回发布对象
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  /** 对于value的不是对象或者value是VNode的实例的处理
   * 直接返回
   */
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  /** 设置Ob的值为Observer或者是空对象 */
  let ob: Observer | void
  /** 对于value自身具有__ob__属性且其是Observer的实例的处理
   * 设置ob的值为value.__ob__
   */
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    /** 对于observerState的shouldConvert属性为真
   * 且不是服务器端渲染
   * 且value不是数组或者不是
   * 且
   * 且value的isVue属性不为真的处理
   * 根据value创建一个新的Observer对象
   */
    ob = new Observer(value)
  }
  /** 如果asRootData的值和ob的值为针对处理设置ob的vmCount的值自增1 */
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * 定义对象的反应属性
 * @param {*} obj Vue对象
 * @param {*} key 属性名
 * @param {*} val 属性值
 * @param {*} customSetter 用户定义的设置处理函数 null
 * @param {*} shallow 是否隐藏 true
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 创建新的依赖对象
  const dep = new Dep()
  /** 获取对象的对应属性的属性描述符 */
  const property = Object.getOwnPropertyDescriptor(obj, key)
  /** 对于此参数的属性不可进行配置，退出 */
  if (property && property.configurable === false) {
    return
  }
  /** 获取 获取和设置函数 */
  const getter = property && property.get
  const setter = property && property.set
  //
  let childOb = !shallow && observe(val)
  /** 定义属性
   * obj:对象
   * key:属性
   * 定义对象的属性为可枚举和可配置以及设置函数和获取函数
   */
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      /** 如果有getter函数调用getter函数反之直接返回此值 */
      const value = getter ? getter.call(obj) : val
      /** 对于Dep的target的属性不为否的处理
       * 更新依赖数组
       */
      // 对于依赖的目标存在的处理
      if (Dep.target) {
        // 将此对象添加到依赖数组
        dep.depend()
        // 如果不进行隐藏
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* 对于参数没有发生变化的处理 */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      /** 对于有设置器的调用设置器更新参数反之直接设置此参数值 */
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // 通知依赖参数改变
      dep.notify()
    }
  })
}

/**
 * 为对象设置属性值
 * @param {*} target 数组型的数据对象
 * @param {*} key 属性
 * @param {*} val 值
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  /** 对于对象是数组且key为有效的索引值的处理
   * 删除指定位置的值并向指定位置添加新的值
  */
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  /** 对于对象具有此属性的处理
   * 设置此对象此属性的值
   */
  if (hasOwn(target, key)) {
    target[key] = val
    return val
  }
  /** 获取对象的__ob__的值存在在ob中 */
  const ob = (target: any).__ob__
  /** 对于对象的_isVue的属性为真或者ob存在且ob的vmCount的值不为0的处理
   * 进行警告和退出 */
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  /** ob的值为否，添加对象的此属性和属性值 */
  if (!ob) {
    target[key] = val
    return val
  }
  /** 定义反应处理*/
  defineReactive(ob.value, key, val)
  /** 定义提示 */
  ob.dep.notify()
  /** 返回参数值 */
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
/** 删除功能,删除数组此索引位置的值或者是对象的此自身属性
 * target:数组对象或者是对象
 * key:键值或者是索引号
 */
export function del (target: Array<any> | Object, key: any) {
  /** 对于target是数组且key为有效的数组索引值
   * 更新此位置的数值，删除此位置的值
   */
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  /** 设置ob的值为对象__ob__的值 */
  const ob = (target: any).__ob__;
  /** 如果对象的_isVue的为真或者是ob.vmCount的值为真的处理
   * 返回
   */
  if (target._isVue || (ob && ob.vmCount)) {
    // process.env.NODE_ENV !== 'production' && warn ('Avoid deleting properties on a Vue instance or its root $data - just set it to null.')
    return
  }
  /** 对于对象具有此属性返回 */
  if (!hasOwn(target, key)) {
    return
  }
  /** 删除对象的此属性 */
  delete target[key]
  /** 如果对象的值为否的处理
   * 返回
   */
  if (!ob) {
    return
  }
  /** 调用对象的通知函数 */
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
/** 依赖数组，更新对象的相关依赖数组 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
