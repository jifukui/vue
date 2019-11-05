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
 * 
 * @param {*} modules 
 * @param {*} key 
 */
export function pluckModuleFunction<F: Function> (
  modules: ?Array<Object>,
  key: string
): Array<F> 
{
  return modules
    ? modules.map(m => m[key]).filter(_ => _)
    : []
}
/**
 * 向props数组中添加参数
 * @param {*} el 抽象元素
 * @param {*} name 属性名称
 * @param {*} value 属性值
 */
export function addProp (el: ASTElement, name: string, value: string) 
{
  (el.props || (el.props = [])).push({ name, value })
}
/**
 * 向attr数组中添加参数
 * @param {*} el 
 * @param {*} name 
 * @param {*} value 
 */
export function addAttr (el: ASTElement, name: string, value: string) 
{
  (el.attrs || (el.attrs = [])).push({ name, value })
}
/**
 * 向directive数组中添加参数
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
) 
{
  (el.directives || (el.directives = [])).push({ name, rawName, value, arg, modifiers })
}

/**
 * 添加处理函数
 * @param {*} el 
 * @param {*} name 
 * @param {*} value 
 * @param {*} modifiers 
 * @param {*} important 
 * @param {*} warn 
 */
export function addHandler (
  el: ASTElement,
  name: string,
  value: string,
  modifiers: ?ASTModifiers,
  important?: boolean,
  warn?: Function
) 
{
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    )
  }
  // check capture modifier
  if (modifiers && modifiers.capture) 
  {
    delete modifiers.capture
    name = '!' + name // mark the event as captured
  }
  if (modifiers && modifiers.once) 
  {
    delete modifiers.once
    name = '~' + name // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) 
  {
    delete modifiers.passive
    name = '&' + name // mark the event as passive
  }
  let events
  if (modifiers && modifiers.native) 
  {
    delete modifiers.native
    events = el.nativeEvents || (el.nativeEvents = {})
  } 
  else 
  {
    events = el.events || (el.events = {})
  }
  const newHandler = { value, modifiers }
  const handlers = events[name]
  /* istanbul ignore if */
  if (Array.isArray(handlers)) 
  {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler)
  } 
  else if (handlers) 
  {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
  } 
  else 
  {
    events[name] = newHandler
  }
}
/**
 * 获取绑定的属性
 * @param {*} el DOM对象
 * @param {*} name 属性名称
 * @param {*} getStatic 获取静态状态
 */
export function getBindingAttr (
  el: ASTElement,
  name: string,
  getStatic?: boolean
): ?string 
{
  /**获取绑定属性 */
  const dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name)
  /**对于绑定属性不为空的处理 */
  if (dynamicValue != null) 
  {
    /**返回处理之后的表达式 */
    return parseFilters(dynamicValue)
  } 
  /**对于 */
  else if (getStatic !== false) 
  {
    const staticValue = getAndRemoveAttr(el, name)
    if (staticValue != null) 
    {
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
): ?string 
{
  let val
  /**对于对象存在此属性的处理 */
  if ((val = el.attrsMap[name]) != null) 
  {
    /**获取属性列表 */
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) 
    {
      if (list[i].name === name) 
      {
        list.splice(i, 1)
        break
      }
    }
  }
  /**删除的处理 */
  if (removeFromMap) 
  {
    delete el.attrsMap[name]
  }
  return val
}
