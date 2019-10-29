/* @flow */

import { cached, extend, toObject } from 'shared/util'

export const parseStyleText = cached(function (cssText) 
{
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
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

// merge static and dynamic style data on the same vnode
/**聚合静态和动态样式
 * data:
 */
function normalizeStyleData (data: VNodeData): ?Object 
{
  const style = normalizeStyleBinding(data.style)
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
/**将字符串或者是数组转换为对象形式 */
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
 * parent component style should be after child's
 * so that parent component's style could override it
 */
/**获取样式
 * Vnode：
 * checkChild:
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

