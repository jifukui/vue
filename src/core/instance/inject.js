/* @flow */

import { warn } from '../util/index'
import { hasSymbol } from 'core/util/env'
import { defineReactive, observerState } from '../observer/index'
/**
 * 设置组件的提供属性
 * @param {*} vm Vue对象
 */
export function initProvide (vm: Component) {
  // 获取组件的提供属性
  const provide = vm.$options.provide
  /** 对于provide的属性存在的处理
   * 如果提供属性是函数调用此函数
   * 如果提供属性不是函数直接设置对象的_provided属性为provide的值
   */
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}
/**
 * 注射初始化
 * @param {*} vm 
 */
export function initInjections (vm: Component) {
  /** 获取此组件的注入属性 */
  const result = resolveInject(vm.$options.inject, vm)
  /** 如果有需要注射的内容
   * 设置服务器的状态值为否
   * 对需要注射的数据进行遍历
   * 设置组件的对应属性的响应函数
   */
  if (result) {
    observerState.shouldConvert = false
    // 遍历结果中的书友的值
    Object.keys(result).forEach(key => {
      // 对于开发环境不是生产环境的处理
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        /** 组件对于属性的响应函数 */
        defineReactive(vm, key, result[key])
      }
    })
    observerState.shouldConvert = true
  }
}
/** 这个函数是获取需要注射的数据
 * inject：注射的数据
 * vm：组件对象，被注射的对象
 * 如果inject的值不为否
 * 创建一个空的对象
 * 根据hasSymbol进行处理，获取对象的所有可枚举属性
 * 遍历此对象的所有可枚举属性
 */
export function resolveInject (inject: any, vm: Component): ?Object {
  // 对于有inject属性的处理
  if (inject) {
    // 创建一个空的对象
    const result = Object.create(null)
    /** 获取注射对象的所有可枚举属性名 */
    const keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(key => {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject)
    /** 遍历所有注射对象的可枚举属性 */
    for (let i = 0; i < keys.length; i++) {
      /** 存储值 */
      const key = keys[i]
      /** 存储此值的注射属性的from属性,即属性的来源 */
      const provideKey = inject[key].from
      // 设置数据源为传入的组件
      let source = vm
      // 在组件链中寻找提供此数据的来源
      while (source) {
        /** 如果组件的中存在此_provided且这个组件的源存在于组件的_provided属性中
         * 设置结果的对应的键的值为组件_provided属性的对应的值
         * 退出此次循环
         */
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey]
          break
        }
        // 反之在父组件中继续寻找
        source = source.$parent
      }
     // 对于没有在组件链中寻找到的处理方式
      if (!source) {
        // 如果default为此组件中的内容
        if ('default' in inject[key]) {
          // 获取注入属性的默认值
          const provideDefault = inject[key].default
          // 设置值为如果是函数调用函数，如果不是函数直接使用提供的值
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          // 对于不是生产模式的处理进行警告
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    // 返回结果
    return result
  }
}
