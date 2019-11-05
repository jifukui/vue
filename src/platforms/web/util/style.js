/* @flow */

import { cached, extend, toObject } from 'shared/util'
/**
 * 分析处理样式的文本内容
 */
export const parseStyleText = cached(function (cssText) 
{
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  /** */
  cssText.split(listDelimiter).forEach(function (item) 
  {
    if (item) 
    {
      var tmp = item.split(propertyDelimiter)
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return res
})

/**
 * 获取data数据的style属性值
 * 并将此属性值转换为对象形式
 * 如果data的静态样式不存在返回样式
 * 如果静态样式存在返回静态样式和样式的合并
 * @param {*} data 
 */
function normalizeStyleData (data: VNodeData): ?Object 
{
  /**将传入数据的style属性转换为对象形式存放在style变量中 */
  const style = normalizeStyleBinding(data.style)
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

/**
 * 将字符串或者是数组转换为对象形式
 * @param {*} bindingStyle 
 */
export function normalizeStyleBinding (bindingStyle: any): ?Object 
{
  if (Array.isArray(bindingStyle)) 
  {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') 
  {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}
/**
 * 
 * @param {*} vnode 
 * @param {*} checkChild 
 */
export function getStyle (vnode: VNode, checkChild: boolean): Object 
{
  const res = {}
  let styleData

  if (checkChild) 
  {
    let childNode = vnode
    /**子组件是否具有组件 */
    while (childNode.componentInstance) 
    {
      childNode = childNode.componentInstance._vnode
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) 
      {
        extend(res, styleData)
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) 
  {
    extend(res, styleData)
  }

  let parentNode = vnode
  while ((parentNode = parentNode.parent)) 
  {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) 
    {
      extend(res, styleData)
    }
  }
  return res
}

