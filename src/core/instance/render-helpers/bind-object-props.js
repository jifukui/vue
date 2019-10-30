/* @flow */

import config from 'core/config'

import {
  warn,
  isObject,
  toObject,
  isReservedAttribute
} from 'core/util/index'

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
/**
 * 
 * @param {*} data 
 * @param {*} tag 
 * @param {*} value 
 * @param {*} asProp 
 * @param {*} isSync 是否同步
 */
export function bindObjectProps (
  data: any,
  tag: string,
  value: any,
  asProp: boolean,
  isSync?: boolean
): VNodeData 
{
  if (value) 
  {
    if (!isObject(value)) 
    {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      )
    } 
    else 
    {
      /**对于value的类型为数组的处理，设置value的值将其转换为数组的方式 */
      if (Array.isArray(value)) 
      {
        value = toObject(value)
      }
      let hash
      /**变量value的所有属性 */
      for (const key in value) 
      {
        /**对于属性值为class或者是style或者是预留的处理
         * 设置hash的值为data
         */
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) 
        {
          hash = data
        } 
        /**对于其他的处理
         * 设置type的值为data.attrs.type的值
         */
        else 
        {
          const type = data.attrs && data.attrs.type
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {})
        }
        if (!(key in hash)) 
        {
          hash[key] = value[key]

          if (isSync) 
          {
            const on = data.on || (data.on = {})
            on[`update:${key}`] = function ($event) 
            {
              value[key] = $event
            }
          }
        }
      }
    }
  }
  return data
}
