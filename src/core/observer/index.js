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
/**获取对象的所用属性名称 */
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
/**设置observerState的值 */
export const observerState = {
  shouldConvert: true
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
/**定义Observer类
 * value:
 * dep:
 * vmCount:
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data
  /**构造函数 */
  constructor (value: any) 
  {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    /**对于值为数组的处理 */
    if (Array.isArray(value)) 
    {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } 
    else 
    {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  /** */
  walk (obj: Object) 
  {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) 
    {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) 
  {
    for (let i = 0, l = items.length; i < l; i++) 
    {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object, keys: any) 
{
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) 
{
  for (let i = 0, l = keys.length; i < l; i++) 
  {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void 
{
  if (!isObject(value) || value instanceof VNode) 
  {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) 
  {
    ob = value.__ob__
  } 
  else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) 
  {
    ob = new Observer(value)
  }
  if (asRootData && ob) 
  {
    ob.vmCount++
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
/**定义对象的反应属性
 * obj:
 * string:
 * val:
 * customSetter:
 * shallow
*/
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
  /**获取对象的对应属性的属性描述符 */
  const property = Object.getOwnPropertyDescriptor(obj, key)
  /**如果属性的可配置属性为否则退出 */
  if (property && property.configurable === false) 
  {
    return
  }

  // cater for pre-defined getter/setters
  /**获取获取和设置函数 */
  const getter = property && property.get
  const setter = property && property.set

  let childOb = !shallow && observe(val)
  /**定义属性
   * obj:对象
   * key:属性
   * 定义对象的属性为可枚举和可配置以及设置函数和获取函数
   */
  Object.defineProperty(obj, key, 
    {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () 
    {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) 
      {
        dep.depend()
        if (childOb) 
        {
          childOb.dep.depend()
          if (Array.isArray(value)) 
          {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) 
    {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) 
      {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) 
      {
        customSetter()
      }
      if (setter) 
      {
        setter.call(obj, newVal)
      } 
      else 
      {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

/**
 * target：对象或者是数组
 * key:键值
 * val:参数值
 */
export function set (target: Array<any> | Object, key: any, val: any): any 
{
  /**对于对象是数组且key为有效的索引值的处理
   * 删除指定位置的值并向指定位置添加新的值
  */
  if (Array.isArray(target) && isValidArrayIndex(key)) 
  {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  /**对于对象具有此属性的处理
   * 设置此对象此属性的值
   */
  if (hasOwn(target, key)) 
  {
    target[key] = val
    return val
  }
  /**设置ob为对象的__ob__属性 */
  const ob = (target: any).__ob__
  /**进行警告和退出 */
  if (target._isVue || (ob && ob.vmCount)) 
  {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  /**ob的值不否，添加对象的此属性和属性值 */
  if (!ob) 
  {
    target[key] = val
    return val
  }
  /**定义反应函数, */
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
/** */
export function del (target: Array<any> | Object, key: any) 
{
  /**对于target是数组且key为有效的数组索引值
   * 更新此位置的数值
   */
  if (Array.isArray(target) && isValidArrayIndex(key)) 
  {
    target.splice(key, 1)
    return
  }
  /**设置ob的值为对象__ob__的值 */
  const ob = (target: any).__ob__
  /**如果对象的_isVue的为真或者是ob.vmCount的值为真的处理
   * 返回
   */
  if (target._isVue || (ob && ob.vmCount)) 
  {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  /**对于对象具有此属性返回 */
  if (!hasOwn(target, key)) 
  {
    return
  }
  /**删除对象的此属性 */
  delete target[key]
  /**如果对象的值为否的处理
   * 返回
   */
  if (!ob) 
  {
    return
  }
  /**调用对象的通知函数 */
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
/** */
function dependArray (value: Array<any>) 
{
  for (let e, i = 0, l = value.length; i < l; i++) 
  {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) 
    {
      dependArray(e)
    }
  }
}
