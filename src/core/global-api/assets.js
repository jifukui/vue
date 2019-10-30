/* @flow */

import config from '../config'
import { ASSET_TYPES } from 'shared/constants'
import { warn, isPlainObject } from '../util/index'
/**初始化资产寄存器
 * 设置GlobalAPI的相关属性的方法
 * 如果definition的值为假的处理返回Vue的这个
 */
export function initAssetRegisters (Vue: GlobalAPI) 
{
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => 
  {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void 
    {
      if (!definition) 
      {
        return this.options[type + 's'][id]
      } 
      else 
      {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') 
        {
          if (type === 'component' && config.isReservedTag(id)) 
          {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            )
          }
        }
        /**如果是组件且definition的类型为对象
         * 设置definition的name属性
         * 设置definition的值
         */
        if (type === 'component' && isPlainObject(definition)) 
        {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        /**如果是指令且指令的类型为函数的处理
         * 设置definition的绑定属性和更新属性
         */
        if (type === 'directive' && typeof definition === 'function') 
        {
          definition = { bind: definition, update: definition }
        }
        /**设置对象的Vue对象的此属性的属性的值为definition，最后返回definition */
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
