/* @flow */

import { warn } from '../util/index'
import { hasSymbol } from 'core/util/env'
import { defineReactive, observerState } from '../observer/index'
/**privide和inject为一对功能是用于祖组件向后代子孙组件提供数据 */
/**初始化提供
 * vm：为组件对象
 * 根据对象的$options.provide属性是否为空进行处理
 * 不为空且属性的类型为函数调用此函数，反之返回此对象
 * 为空不做任何处理
*/
export function initProvide (vm: Component) 
{
  const provide = vm.$options.provide
  /**对于provide的属性存在且是函数的处理 */
  if (provide) 
  {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}
/**
 * 注射初始化
 * @param {*} vm 
 */
export function initInjections (vm: Component) 
{
  /**获取需要注射的数据 */
  const result = resolveInject(vm.$options.inject, vm)
  /**如果有需要注射的内容
   * 设置服务器的状态值为否
   * 对需要注射的数据进行遍历
   * 设置组件的对应属性的响应函数
   */
  if (result) 
  {
    observerState.shouldConvert = false
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') 
      {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } 
      else 
      {
        /**组件对于属性的响应函数 */
        defineReactive(vm, key, result[key])
      }
    })
    observerState.shouldConvert = true
  }
}
/**这个函数是获取需要注射的数据
 * inject：注射的数据
 * vm：组件对象，被注射的对象
 * 如果inject的值不为否
 * 创建一个空的对象
 * 根据hasSymbol进行处理，获取对象的所有可枚举属性
 * 遍历此对象的所有可枚举属性
 */
export function resolveInject (inject: any, vm: Component): ?Object 
{
  if (inject) 
  {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null)
    /**获取注射对象的所有可枚举属性名 */
    const keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(key => {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject)
    /**遍历所有注射对象的可枚举属性 */
    for (let i = 0; i < keys.length; i++) 
    {
      /**存储值 */
      const key = keys[i]
      /**存储此值的注射属性的from属性 */
      const provideKey = inject[key].from
      let source = vm
      /**遍历此组件的所有存在的父组件，如果vm不为否继续执行为否返回空的对象 */
      while (source) 
      {
        /**对于此组件有_provided属性且_provided属性中存在provideKey在向结果中添加此属性的值为 */
        if (source._provided && provideKey in source._provided) 
        {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
      /**遍历完成之后如果注射组件中有default属性
       * 
       */
      if (!source) 
      {
        if ('default' in inject[key]) 
        {
          const provideDefault = inject[key].default
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault
        } 
        else if (process.env.NODE_ENV !== 'production') 
        {
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}
