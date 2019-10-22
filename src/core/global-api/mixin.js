/* @flow */

import { mergeOptions } from '../util/index'
/**定义对象的混合属性 */
export function initMixin (Vue: GlobalAPI) 
{
  Vue.mixin = function (mixin: Object) 
  {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
