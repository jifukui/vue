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

/** 创建strats对象为一个空的对象
 * strats为配置的config.optionMergeStrategies属性
 * 即为创建空对象的函数
 */
const strats = config.optionMergeStrategies

/** 对于环境不是生产模式的处理 */
if (process.env.NODE_ENV !== 'production') {
  /**
   * 设置策略的元素和propData的值
   */
  strats.el = strats.propsData = function (parent, child, vm, key) {
    /** 如果vm对象的值为否进行警告
     * 返回默认的strat
     */
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    /** 子不存在返回父 */
    return defaultStrat(parent, child)
  }
}

/**
 * 进行数据的合并，
 * 获取数据源的所有属性
 * 如果数据目的没有此参数调用set函数设置数据数据目的此参数的值
 * 如果数据目的有此参数且数据目的和数据源的此属性都是对象，继续调用数据合并
 * @param {*} to 数据目标
 * @param {*} from 数据源
 */
function mergeData (to: Object, from: ?Object): Object {
  /** 对于数据源的值为空的处理，直接返回目的数据 */
  if (!from) {
    return to
  }
  let key, toVal, fromVal
  // 获取数据源的所有的属性名
  const keys = Object.keys(from)
  // 变量属性名
  for (let i = 0; i < keys.length; i++) {
    // 属性名
    key = keys[i]
    // 目的属性值
    toVal = to[key]
    // 源属性值
    fromVal = from[key]
    /** 如果目的对象没有这个属性名的处理添加此属性 */
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      // 如果元和目的的属性值都是对象，进行深度的数据合并
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * 合并数据的方法
 * @param {*} parentVal 父参数
 * @param {*} childVal 子参数
 * @param {*} vm Vue对象
 */
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  /** 组件对象为空的处理 */
  if (!vm) {
    // 子参数为假值 返回父参数
    if (!childVal) {
      return parentVal
    }
    // 父参数为假值返回子参数
    if (!parentVal) {
      return childVal
    }
    // 父子参数都不为空，返回mergedDataFn函数，调用的是mergedData的函数的返回值
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else if (parentVal || childVal) {
    // 这是对于组件的值为假值的处理，返回聚合实例数据的方法
    // 这里面是对于父子参数至少有一个为真值的处理
    return function mergedInstanceDataFn () {
      // 根据子参数是不是方法进行处理，是函数调用此函数，不是返回其值数据赋值给instanceData
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal
      // 根据父参数是不是方法进行处理，是函数调用此函数，不是返回其值数据赋值给defaultData
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal
      // 对于子参数的值为真的处理，对子参数的值和父参数的值进行合并
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        // 子参数的值为假值直接返回父的参数
        return defaultData
      }
    }
  }
}
/** strats对象的data属性
 * parentVal：父值
 * childVal：子值
 * vm：组件对象
 * 如果vm的值为否
 * 如果子存在且子的类型不为方法，返回父的值
 * 反之返回当前strats的值与父的值聚合到子的值
 * 反之返回聚合父的值和子的值到vm的值
 */
/**
 * 设置策略的数据
 * @param {*} parentVal 父参数
 * @param {*} childVal 子参数
 * @param {*} vm 组件对象
 */
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  // 组件对象为假值的处理
  if (!vm) {
    // 对于子参数为真且类型不是函数的处理，进行警告返回父参数
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    // 对于上述条件不成立，对此属性调用数据聚合函数
    return mergeDataOrFn.call(this, parentVal, childVal)
  }
  // 调用数据聚合函数
  return mergeDataOrFn(parentVal, childVal, vm)
}

/** 聚合钩子
 * parentVal:
 * childVal:
 * 如果子的值为否返回父的值
 * 如果子的值为真
 * 如果父的值为真返回父的值concat后的值
 * 如果父的值为假判断子是否是数组
 * 如果子的属性为数组返回子，返回子的数组化形式
 */
/**
 * 聚合钩子
 * @param {*} parentVal 
 * @param {*} childVal 
 */
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}
/** 设置strats的钩子的方法 */
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
/**
 * 聚合
 * 如果子参数不为假值，如果不是发布模式调用assertObjectType函数然后调用extend函数
 * 如果子参数为假值直接返回父参数
 * @param {*} parentVal 父参数
 * @param {*} childVal 子参数
 * @param {*} vm 组件对象
 * @param {*} key 属性名
 */
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  /** 创建资源对象 */
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}
/** strats对象中添加对应的资源的方法 */
ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
/** strats对象的watch属性
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
/**
 * 策略监听函数
 * @param {*} parentVal 
 * @param {*} childVal 
 * @param {*} vm 
 * @param {*} key 
 */
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // 如果父参数是原生的监听函数，设置父参数为未定义
  if (parentVal === nativeWatch) {
    parentVal = undefined
  }
  // 如果子参数是原生的监听函数，设置子参数为未定义
  if (childVal === nativeWatch) {
    childVal = undefined
  }
  // 如果子参数的值为返回继承父参数的对象
  if (!childVal) {
    return Object.create(parentVal || null)
  }
  // 如果不是发布模式，检测对象的类型
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  // 如果父对象的值为假，返回子参数
  if (!parentVal) {
    return childVal
  }
  // 对于父子参数都为真的处理
  const ret = {}
  //
  extend(ret, parentVal)
  // 遍历子参数中的所有属性
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    //  如果父参数的值为真且不是数组的处理
    if (parent && !Array.isArray(parent)) {
      // 转换为数组的形式
      parent = [parent]
    }
    //
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}
/** 设置strats对象的props属性，methods属性，inject属性和computed属性
 * parentVal：
 * childVal：
 * vm：
 * key：
 * 如果父对象的值为假返回子对象
 * 如果父对象的值不为假的处理
 * 创建一个空格对象，浅拷贝父对象
 * 如果子对象存在，再将此对象浅拷贝子对象，返回合并之后的对象
 */
/**
 * 设置策略的props，methods，inject，computed属性
 * @param {*} parentVal 父参数
 * @param {*} childVal 子参数
 * @param {*} vm 组件对象
 * @param {*} key 属性名
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) {
    return childVal
  }
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) {
    extend(ret, childVal)
  }
  return ret
}
/** 设置strats对象的provide属性为聚合数据和方法的函数 */
strats.provide = mergeDataOrFn

/**
 * 默认策略
 * 如果子参数的值为真返回子参数的值为假返回父参数的值
 * @param {*} parentVal 父参数
 * @param {*} childVal 子参数
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}

/** 检测组件中属性的名称是否是合法的属性名称
 * 对于组件中使用构建的标签或者是预留的标签进行警告
 */
/**
 * 
 * @param {*} options 
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
function normalizeInject (options: Object, vm: ?Component) {
  const inject = options.inject
  const normalized = options.inject = {}
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } else if (process.env.NODE_ENV !== 'production' && inject) {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}
/**
 * 指令的规则化
 * @param {*} options 
 */
function normalizeDirectives (options: Object) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}
/**
 * 判断传入的参数是否是对象
 * @param {*} name 键名
 * @param {*} value 键值
 * @param {*} vm 组件名称
 */
function assertObjectType (name: string, value: any, vm: ?Component) {
  // 对于参数不是对象的处理，进行警告
  if (!isPlainObject(value)) {
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
/** 聚合两个对象的参数
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
