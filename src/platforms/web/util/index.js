/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * Query an element selector if it's not an element already.
 */
/**查询元素是否存在 */
export function query (el: string | Element): Element 
{
  if (typeof el === 'string') 
  {
    /**查询id 标签是否存在
     * 对于不存在进行警告，但是创建一个div的对象
     * 对于存在返回对象
     */
    const selected = document.querySelector(el)
    if (!selected) 
    {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    return selected
  } 
  else 
  {
    return el
  }
}
