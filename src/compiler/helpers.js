/* @flow */

import { parseFilters } from './parser/filter-parser'
/**
 * 基本警告
 * 控制台输出错误信息
 * @param {*} msg 错误信息
 */
export function baseWarn (msg: string) {
  console.error(`[Vue compiler]: ${msg}`)
}
/**
 * 去除模块功能
 * @param {*} modules 
 * @param {*} key 
 */
export function pluckModuleFunction<F: Function> (
  modules: ?Array<Object>,
  key: string
): Array<F> {
  return modules
    ? modules.map(m => m[key]).filter(_ => _)
    : []
}
/**
 * 向props数组中添加参数
 * 如果抽象元素中存在props属性直接使用不存在此属性创建一个空的数组
 * 在数组中添加对象属性名和属性值
 * @param {*} el 抽象元素
 * @param {*} name 属性名称
 * @param {*} value 属性值
 */
export function addProp (el: ASTElement, name: string, value: string) {
  (el.props || (el.props = [])).push({ name, value })
}
/**
 * 向attr数组中添加参数
 * @param {*} el 
 * @param {*} name 
 * @param {*} value 
 */
export function addAttr (el: ASTElement, name: string, value: string) {
  (el.attrs || (el.attrs = [])).push({ name, value })
}
/**
 * 向directive数组中添加参数，即添加指令
 * @param {*} el 对象
 * @param {*} name 
 * @param {*} rawName 
 * @param {*} value 
 * @param {*} arg 
 * @param {*} modifiers 
 */
export function addDirective (
  el: ASTElement,
  name: string,
  rawName: string,
  value: string,
  arg: ?string,
  modifiers: ?ASTModifiers
) {
  (el.directives || (el.directives = [])).push({ name, rawName, value, arg, modifiers })
}

/**
 * 添加处理函数，
 * @param {*} el 对象
 * @param {*} name 事件名称
 * @param {*} value 处理代码
 * @param {*} modifiers 修饰符
 * @param {*} important 重要性
 * @param {*} warn 警告
 */
export function addHandler (
  el: ASTElement,
  name: string,
  value: string,
  modifiers: ?ASTModifiers,
  important?: boolean,
  warn?: Function
) {
  // 对于不是发布模式且定义警告或者是修饰符且修饰符中有。进行警告
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    )
  }
  // 对于是捕捉事件的处理，删除修饰器的捕捉属性，在属性名前添加!号
  if (modifiers && modifiers.capture) {
    delete modifiers.capture
    name = '!' + name // mark the event as captured
  }
  // 对于是只执行一次的处理，删除只执行一次属性，在属性名前加~号
  if (modifiers && modifiers.once) {
    delete modifiers.once
    name = '~' + name // mark the event as once
  }
  // 对于
  if (modifiers && modifiers.passive) {
    delete modifiers.passive
    name = '&' + name // mark the event as passive
  }
  let events
  // 对于
  if (modifiers && modifiers.native) {
    delete modifiers.native
    events = el.nativeEvents || (el.nativeEvents = {})
  } else {
    events = el.events || (el.events = {})
  }
  // 设置新的处理函数
  const newHandler = { value, modifiers }
  // 获取老的处理函数
  const handlers = events[name]
  // 对于处理函数为数组的处理
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler)
  } else if (handlers) {
    // 对于处理函数存在的处理
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
  } else {
    // 对于处理函数不存在的处理，设置这个元素的处理函数为新的处理函数
    events[name] = newHandler
  }
}
/**
 * 获取绑定的属性
 * @param {*} el DOM对象
 * @param {*} name 属性名称
 * @param {*} getStatic 获取静态状态,这里是是否获取原生的属性的标记
 */
export function getBindingAttr (
  el: ASTElement,
  name: string,
  getStatic?: boolean
): ?string {
  /** 获取绑定属性 */
  const dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name)
  /** 对于绑定属性不为空的处理 */
  if (dynamicValue != null) {
    /** 返回处理之后的表达式 */
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    const staticValue = getAndRemoveAttr(el, name)
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

/**
 * 获取或者是移除属性，返回对应属性的值
 * @param {*} el 对象
 * @param {*} name 指令名称
 * @param {*} removeFromMap 是否删除
 */
export function getAndRemoveAttr (
  el: ASTElement,
  name: string,
  removeFromMap?: boolean
): ?string {
  let val
  /** 对于对象存在此属性的处理 */
  if ((val = el.attrsMap[name]) != null) {
    /** 获取属性列表 */
    const list = el.attrsList
    // 遍历属性列表中的属性，获取对应属性名在属性列表中的位置
    // 如果寻找到删除此属性列表中的此项
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  /** 对于定义删除的状态为真的处理，在元素的属性映射中删除此属性名 */
  if (removeFromMap) {
    delete el.attrsMap[name]
  }
  // 返回此属性名在属性映射中的值
  return val
}
