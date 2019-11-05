/* @flow */

import { isDef, isObject } from 'shared/util'
/**
 * 为节点
 * @param {*} vnode 
 */
export function genClassForVnode (vnode: VNode): string {
  let data = vnode.data
  let parentNode = vnode
  let childNode = vnode
  while (isDef(childNode.componentInstance)) 
  {
    childNode = childNode.componentInstance._vnode
    if (childNode.data) 
    {
      data = mergeClassData(childNode.data, data)
    }
  }
  while (isDef(parentNode = parentNode.parent)) 
  {
    if (parentNode.data) 
    {
      data = mergeClassData(data, parentNode.data)
    }
  }
  return renderClass(data.staticClass, data.class)
}
/**
 * 聚合类数据
 * staticClass为父和子的静态类的合并
 * class为如果子的class属性不存在为父的class如果存在为子的class和父的class组成的数组
 * @param {*} child 节点
 * @param {*} parent 
 */
function mergeClassData (child: VNodeData, parent: VNodeData): {
  staticClass: string,
  class: any
} 
{
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}
/**
 * 如果动态样式或者是静态样式有一个存在进行样式的和合并，反之返回空字符串
 * @param {*} staticClass 静态样式 
 * @param {*} dynamicClass 动态样式
 */
export function renderClass (
  staticClass: ?string,
  dynamicClass: any
): string 
{
  if (isDef(staticClass) || isDef(dynamicClass)) 
  {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}
/**
 * 如果两个字符串都不为空返回两个字符串的合并，反之返回存在的字符串
 * @param {*} a  字符串
 * @param {*} b  字符串
 */
export function concat (a: ?string, b: ?string): string 
{
  return a ? b ? (a + ' ' + b) : a : (b || '')
}
/**
 * 
 * @param {*} value 
 */
export function stringifyClass (value: any): string 
{
  if (Array.isArray(value)) 
  {
    return stringifyArray(value)
  }
  if (isObject(value)) 
  {
    return stringifyObject(value)
  }
  if (typeof value === 'string') 
  {
    return value
  }
  /* istanbul ignore next */
  return ''
}
/**
 * 数组字符串化
 * @param {*} value 
 */
function stringifyArray (value: Array<any>): string 
{
  let res = ''
  let stringified
  for (let i = 0, l = value.length; i < l; i++) 
  {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') 
    {
      if (res) 
      {
        res += ' '
      }
      res += stringified
    }
  }
  return res
}
/**
 * 对象的字符串化
 * @param {*} value 
 */
function stringifyObject (value: Object): string 
{
  let res = ''
  for (const key in value) 
  {
    if (value[key]) 
    {
      if (res) 
      {
        res += ' '
      }
      res += key
    }
  }
  return res
}
