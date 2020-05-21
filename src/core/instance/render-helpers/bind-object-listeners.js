/* @flow */

import { warn, extend, isPlainObject } from 'core/util/index'
/**
 * 这段程序还不知道是做什么用的
 * @param {*} data 
 * @param {*} value 
 */
export function bindObjectListeners (data: any, value: any): VNodeData 
{
  /**对于value的值为真的处理
   * 对于value的类型不是对象的处理警告
   * 对于value的类型是对象处理
   * 设置on的值为data.on或者是空的对象
   */
  if (value) 
  {
    if (!isPlainObject(value)) 
    {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      )
    } 
    else 
    {
      const on = data.on = data.on ? extend({}, data.on) : {}
      for (const key in value) 
      {
        const existing = on[key]
        const ours = value[key]
        /**合并 */
        on[key] = existing ? [].concat(ours, existing) : ours
      }
    }
  }
  return data
}
