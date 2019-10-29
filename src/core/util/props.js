/* @flow */

import { warn } from './debug'
import { observe, observerState } from '../observer/index'
import {
  hasOwn,
  isObject,
  toRawType,
  hyphenate,
  capitalize,
  isPlainObject
} from 'shared/util'
/**类型别名 PropOptions
 * type
 * default
 * required
 * validator
*/
type PropOptions = {
  type: Function | Array<Function> | null,
  default: any,
  required: ?boolean,
  validator: ?Function
};
/**有效的数据Prop
 * key:键值
 * propOptions:对象
 * propData:
 * vm
 */
export function validateProp (
  key: string,
  propOptions: Object,
  propsData: Object,
  vm?: Component
): any 
{
  /**获取propOptions对象的某个属性 */
  const prop = propOptions[key]
  /**判断propsData中的key是否为此对象的自有属性 */
  const absent = !hasOwn(propsData, key)
  let value = propsData[key]
  // 对于prop的type的值为布尔型数据的处理设置value的值为布尔值
  if (isType(Boolean, prop.type)) 
  {
    /**对于key不为自身属性且自身没有默认属性的处理
     * 设置value的值为假
     */
    if (absent && !hasOwn(prop, 'default')) 
    {
      value = false
    } 
    /**对于prop的type属性不为字符串型且value的值为空或者value的值恒等于将key转换为除首字母外其他都为小写字母的形式的处理
     * 设置value的值为真
     */
    else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) 
    {
      value = true
    }
  }
  // check default value
  /**对于value值未定义的处理 */
  if (value === undefined) 
  {
    /**获取value的值为默认属性 */
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldConvert = observerState.shouldConvert
    observerState.shouldConvert = true
    observe(value)
    observerState.shouldConvert = prevShouldConvert
  }
  if (process.env.NODE_ENV !== 'production') 
  {
    assertProp(prop, key, value, vm, absent)
  }
  return value
}

/**
 * Get the default value of a prop.
 */
/**获取默认值 */
function getPropDefaultValue (vm: ?Component, prop: PropOptions, key: string): any 
{
  // no default, return undefined
  /**对于对象没有此属性的处理 */
  if (!hasOwn(prop, 'default')) 
  {
    return undefined
  }
  /**设置def的值为此对象的默认的属性 */
  const def = prop.default
  // warn against non-factory defaults for Object & Array
  /**对于不是生产模式且def是对象的处理，进行警告 */
  if (process.env.NODE_ENV !== 'production' && isObject(def)) 
  {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    )
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  /** */
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) 
  {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  /**对于def的值为函数获调用此函数的返回值，反之返回此数据 */
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
/**访问数据 */
function assertProp (
  prop: PropOptions,
  name: string,
  value: any,
  vm: ?Component,
  absent: boolean
) 
{
  /**对于prop的require的值为真且absent的值为真的处理，
   * 警告并返回 
   * */
  if (prop.required && absent) 
  {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    )
    return
  }
  /**对于value的值为空且prop的require的属性为真的处理
   * 直接返回
   */
  if (value == null && !prop.required) 
  {
    return
  }
  let type = prop.type
  let valid = !type || type === true
  const expectedTypes = []
  /**对于prop的type属性为真的处理
   * 
   */
  if (type) 
  {
    if (!Array.isArray(type)) 
    {
      type = [type]
    }
    for (let i = 0; i < type.length && !valid; i++) 
    {
      const assertedType = assertType(value, type[i])
      expectedTypes.push(assertedType.expectedType || '')
      valid = assertedType.valid
    }
  }
  /**对于vaild的处理
   * 进行警告
   */
  if (!valid) 
  {
    warn(
      `Invalid prop: type check failed for prop "${name}".` +
      ` Expected ${expectedTypes.map(capitalize).join(', ')}` +
      `, got ${toRawType(value)}.`,
      vm
    )
    return
  }
  const validator = prop.validator
  if (validator) 
  {
    if (!validator(value)) 
    {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      )
    }
  }
}
/**定义简单的检测 */
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/
/**检测传入的数据value是否是对应的数据类型
 * 返回值：
 * valid：数据类型是否匹配
 * expectedtype：type的数据类型，即期望的数据类型
*/
function assertType (value: any, type: Function): {valid: boolean;expectedType: string;} 
{
  let valid
  /**获取expectedType的属性 */
  const expectedType = getType(type)
  /**对于expectedType的类型匹配的处理对于对象返回value的原型是否是type
   * 反之对于对象的处理
   * 对于数组的处理
   * 对于其他值的处理
   */
  if (simpleCheckRE.test(expectedType)) 
  {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // for primitive wrapper objects
    if (!valid && t === 'object') 
    {
      valid = value instanceof type
    }
  } 
  else if (expectedType === 'Object') 
  {
    valid = isPlainObject(value)
  } 
  else if (expectedType === 'Array') 
  {
    valid = Array.isArray(value)
  } 
  else 
  {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}

/**获取对象的类型 */
function getType (fn) 
{
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}
/**判断出入的数据类型是否相等 */
function isType (type, fn) 
{
  if (!Array.isArray(fn)) 
  {
    return getType(fn) === getType(type)
  }
  for (let i = 0, len = fn.length; i < len; i++) 
  {
    if (getType(fn[i]) === getType(type)) 
    {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}
