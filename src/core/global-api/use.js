/* @flow */

import { toArray } from '../util/index'
/**初始化Vue的use属性
 * 根据此对象安装的插件进行处理
 * 如果此对象中未找到此插件返回全局对象
 * 
 */
export function initUse (Vue: GlobalAPI) 
{
  Vue.use = function (plugin: Function | Object) 
  {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) 
    {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') 
    {
      plugin.install.apply(plugin, args)
    } 
    else if (typeof plugin === 'function') 
    {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
