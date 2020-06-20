/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * 返回此对象的dom元素对象
 * @param {*} el 字符串或者是元素DOM对象
 */
export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    /** 查询id 标签是否存在
     * 对于不存在进行警告，但是创建一个div的对象
     * 对于存在返回元素对象
     */
    const selected = document.querySelector(el)
    // 没有获取到此元素
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}
