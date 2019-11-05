/* @flow */

import config from '../config'
import { ASSET_TYPES } from 'shared/constants'
import { warn, isPlainObject } from '../util/index'
/**
 * 定义Vue的一些方法的处理，初始化资源注册
 * component
 * directive
 * filter
 * @param {*} Vue Vue对象
 */
export function initAssetRegisters (Vue: GlobalAPI) 
{
  ASSET_TYPES.forEach(type => 
  {
    /**
     * Vue的一些方法的实现
     * id:为名字
     * definition：为传入的对象
     */
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void 
    {
      /**如果传入的definition的值为否的处理
       * 返回当前Vue对象的对应组件的对应方法的实现
       */
      if (!definition) 
      {
        return this.options[type + 's'][id]
      } 
      /**如果传入的参数的值不会空的处理 */
      else 
      {
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
         * 设置definition的值为调用自己的扩展方法后的值
         */
        if (type === 'component' && isPlainObject(definition)) 
        {
          definition.name = definition.name || id
          /**options._base指向Vue对象自己，调用 */
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
