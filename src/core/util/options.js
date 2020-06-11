/* @flow */

import config from '../config'
import { warn } from './debug'
import { nativeWatch } from './env'
import { set } from '../observer/index'

import {
  ASSET_TYPES,
  LIFECYCLE_HOOKS
} from 'shared/constants'

import {
  extend,
  hasOwn,
  camelize,
  toRawType,
  capitalize,
  isBuiltInTag,
  isPlainObject
} from 'shared/util'

/**创建strats对象为一个空的对象
 * strats为配置的config.optionMergeStrategies属性
 * 即为创建空对象的函数
 */
const strats = config.optionMergeStrategies

/**
 * Options with restrictions
 */
/**对于环境不是生产模式的处理 */
if (process.env.NODE_ENV !== 'production') 
{
  /** */
  strats.el = strats.propsData = function (parent, child, vm, key) 
  {
    /**如果vm对象的值为否进行警告
     * 返回默认的strat
     */
    if (!vm) 
    {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    /**子不存在返回父 */
    return defaultStrat(parent, child)
  }
}

/**
 * 进行数据的合并，将from中的属性添加至to对象
 * @param {*} to 数据目标
 * @param {*} from 数据源
 */
function mergeData (to: Object, from: ?Object): Object 
{
  /**对于数据源的值为空的处理，直接返回目的数据 */
  if (!from) 
  {
    return to
  }
  let key, toVal, fromVal
  const keys = Object.keys(from)
  /**将源数据中的数据合并到目的数据 */
  for (let i = 0; i < keys.length; i++) 
  {
    key = keys[i]
    toVal = to[key]
    fromVal = from[key]
    /**如果目的对象没有这个属性的处理添加此属性 */
    if (!hasOwn(to, key)) 
    {
      set(to, key, fromVal)
    } 
    /**对于目的对象没有此属性且目的对象的值为对象且源对象的值为对象的处理，递归调用此函数进行深度的复制 */
    else if (isPlainObject(toVal) && isPlainObject(fromVal)) 
    {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * 聚合数据
 * @param {*} parentVal 
 * @param {*} childVal 
 * @param {*} vm Vue对象
 */
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function 
{
  /**对于Vue对象不存在的处理方式 */
  if (!vm) 
  {
    // in a Vue.extend merge, both should be functions
    if (!childVal) 
    {
      return parentVal
    }
    if (!parentVal) 
    {
      return childVal
    }
    return function mergedDataFn () 
    {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } 
  /**对于两个对象有一个存在的处理 */
  else if (parentVal || childVal) 
  {
    return function mergedInstanceDataFn () 
    {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal
      if (instanceData) 
      {
        return mergeData(instanceData, defaultData)
      } 
      else 
      {
        return defaultData
      }
    }
  }
}
/**strats对象的data属性
 * parentVal：父值
 * childVal：子值
 * vm：组件对象
 * 如果vm的值为否
 * 如果子存在且子的类型不为方法，返回父的值
 * 反之返回当前strats的值与父的值聚合到子的值
 * 反之返回聚合父的值和子的值到vm的值
 */
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function 
{
  if (!vm) 
  {
    if (childVal && typeof childVal !== 'function') 
    {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}

/**
 * Hooks and props are merged as arrays.
 */
/**聚合钩子
 * parentVal:
 * childVal:
 * 如果子的值为否返回父的值
 * 如果子的值为真
 * 如果父的值为真返回父的值concat后的值
 * 如果父的值为假判断子是否是数组
 * 如果子的属性为数组返回子，返回子的数组化形式
 */
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> 
{
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}
/**设置strats的钩子的方法 */
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})


/**聚合资源
 * parentVal：父值
 * childVal：子值
 * vm：组件
 * key：键值
 * 如果子的值为真，将子的值浅拷贝到资源对象中
 * 如果子的值为假，不对资源对象进行处理
 * 返回资源对象
 */
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object 
{
  /**创建资源对象 */
  const res = Object.create(parentVal || null)
  if (childVal) 
  {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } 
  else 
  {
    return res
  }
}
/**strats对象中添加对应的资源的方法 */
ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})


/**strats对象的watch属性
 * parentVal：
 * childVal：
 * vm：
 * key：
 * 如果父的值和子的值都是对象的watch属性设置其值为undefined
 * 如果子的值为否返回父对象或者是空对象
 * 如果子的值为真父的值为否返回子对象
 * 如果父子对象都存在
 * 将父对象浅拷贝值资源对象中
 * 遍历子对象的属性
 * 如果也存在于父值中且不是数组设置临时变量为此属性值的数组化结构
 * 反之不做任何处理
 * 设置父对象的浅拷贝的此属性值为
 * 当此属性在父对象中设置此属性为数组拼接此子属性
 * 当存在于父属性中此属性在子对象中为数组设置为此子属性反之设置为子对象此属性的数组形式
 * 返回此对象的父对象的浅拷贝的合并版本
 */
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object 
{
  /**如果父的值和子的值都是对象的watch属性设置其值为undefined */
  if (parentVal === nativeWatch) 
  {
    parentVal = undefined
  }
  if (childVal === nativeWatch) 
  {
    childVal = undefined
  }
  /* istanbul ignore if */
  if (!childVal) 
  {
    return Object.create(parentVal || null)
  }
  if (process.env.NODE_ENV !== 'production') 
  {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) 
  {
    return childVal
  }
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) 
  {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) 
    {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}
/**设置strats对象的props属性，methods属性，inject属性和computed属性
 * parentVal：
 * childVal：
 * vm：
 * key：
 * 如果父对象的值为假返回子对象
 * 如果父对象的值不为假的处理
 * 创建一个空格对象，浅拷贝父对象
 * 如果子对象存在，再将此对象浅拷贝子对象，返回合并之后的对象
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object 
{
  if (childVal && process.env.NODE_ENV !== 'production') 
  {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) 
  {
    return childVal
  }
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) 
  {
    extend(ret, childVal)
  }
  return ret
}
/** 设置strats对象的provide属性为聚合数据和方法的函数 */
strats.provide = mergeDataOrFn

/**
 * Default strategy.
 */
/** childVal的值为未定义返回parent的值反之返回child的值 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}

/** 检测组件中属性的名称是否是合法的属性名称
 * 对于组件中使用构建的标签或者是预留的标签进行警告
 */
function checkComponents (options: Object) {
  for (const key in options.components) {
    const lower = key.toLowerCase()
    /** 不能是slot或者是component或者是预留的标签这里应该是没有的 */
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      )
    }
  }
}

/**
 * options：
 * vm：组件对象
 * 如果对象的props属性的值为假直接返回
 * 如果props属性为数组类型的处理
 * 遍历所有的内容如果值为字符串将字符串转换为驼峰格式并设置资源的此属性的值为type为空
 * 如果props属性为对象的处理
 * 遍历所有的属性将属性名设置为驼峰格式然后设置此属性为如果是对象为对象反之设置type为此属性的值
 * 最后设置对象的props属性值
*/
/**
 * 对对象的属性名称经过规则处理
 * @param {*} options Vue对象的options属性,或者传入的属性
 * @param {*} vm 组件对象
 */
function normalizeProps (options: Object, vm: ?Component) {
  /** 获取Vue对象的options属性的props属性的值，如果没有此属性直接返回 */
  const props = options.props
  if (!props) {
    return
  }
  const res = {}
  let i, val, name
  /** 对于props类型为数组的处理
   * 遍历所有属性，
   * 对于参数值为字符串将字符串转换为驼峰形式设置此属性的值的{ type: null }
   */
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    /** 对于props的值为对象的处理
   * 遍历所有属性
   * 获取属性值和将属性名设置为驼峰形式
   * 设置资源此属性名的值为如果是对象为对象值如果不是对象为{ type: val }
   */
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production' && props) {
    /** 这部分在生产模式中不会出现 */
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}

/**
 * 
 * @param {*} options Vue对象的options属性
 * @param {*} vm Vue对象
 */
function normalizeInject (options: Object, vm: ?Component) 
{
  const inject = options.inject
  const normalized = options.inject = {}
  if (Array.isArray(inject)) 
  {
    for (let i = 0; i < inject.length; i++) 
    {
      normalized[inject[i]] = { from: inject[i] }
    }
  } 
  else if (isPlainObject(inject)) 
  {
    for (const key in inject) 
    {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } 
  else if (process.env.NODE_ENV !== 'production' && inject) 
  {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}
/**
 * 
 * @param {*} options 
 */
function normalizeDirectives (options: Object) 
{
  const dirs = options.directives
  if (dirs) 
  {
    for (const key in dirs) 
    {
      const def = dirs[key]
      if (typeof def === 'function') 
      {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}
/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} vm 
 */
function assertObjectType (name: string, value: any, vm: ?Component) 
{
  if (!isPlainObject(value)) 
  {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
/**聚合两个对象的参数
 * parent：父对象
 * child：子对象
 * vm：
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  /** 如果不是发布模式，检测child中的组件的名称是否正确，并给出警告 */
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }
  /** 如果子对象的类型为函数的处理
   * 设置子对象为子对象的options属性
   */
  if (typeof child === 'function') {
    child = child.options
  }
  /** 规范化pros属性 */
  normalizeProps(child, vm)

  /** 规范化注射属性 */
  normalizeInject(child, vm)

  /** 规范化指令属性 */
  normalizeDirectives(child)

  /** 获取子对象的extend属性如果存在 */
  const extendsFrom = child.extends
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  /** 聚合域
   * 
   */
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
/**
 * 
 * @param {*} options 
 * @param {*} type 
 * @param {*} id 
 * @param {*} warnMissing 
 */
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) {
    return assets[id]
  }
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId]
  }
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId]
  }
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
