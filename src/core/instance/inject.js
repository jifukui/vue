/* @flow */

import { warn } from '../util/index'
import { hasSymbol } from 'core/util/env'
import { defineReactive, observerState } from '../observer/index'
/**初始化
 * 根据对象的$options.provide属性是否为空进行处理
 * 不为空且属性的类型为函数调用此函数，反之返回此对象
 * 为空不做任何处理
*/
export function initProvide (vm: Component) 
{
  const provide = vm.$options.provide
  if (provide) 
  {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}
/**初始化注射 */
export function initInjections (vm: Component) 
{
  const result = resolveInject(vm.$options.inject, vm)
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
        defineReactive(vm, key, result[key])
      }
    })
    observerState.shouldConvert = true
  }
}
/**
 * inject：
 * vm：
 * 如果inject的值不为否
 * 创建一个空的对象
 * 根据hasSymbol进行处理，获取对象的所有属性
 * 
 */
export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) 
  {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null)
    const keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(key => {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) 
    {
      const key = keys[i]
      const provideKey = inject[key].from
      let source = vm
      while (source) 
      {
        if (source._provided && provideKey in source._provided) 
        {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
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
