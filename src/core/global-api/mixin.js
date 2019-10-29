/* @flow */

import { mergeOptions } from '../util/index'
/**定义对象的混合属性 */
export function initMixin (Vue: GlobalAPI) 
{
  Vue.mixin = function (mixin: Object) 
  {
    /**将此对象的options属性与传入的对象进行混合并返回混合后的此对象 */
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
