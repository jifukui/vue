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
    /**获取这个对象已经安装的插件 */
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    /**对于插件在安装的组件中找到返回这个全局API对象 */
    if (installedPlugins.indexOf(plugin) > -1) 
    {
      return this
    }
    /**如果没有找到这个插件
     * 设置args的值为传入参数的从第二个开始到最后
     * 
     */
    const args = toArray(arguments, 1)
    args.unshift(this)
    /**对于插件的安装属性为函数的处理调用组件的安装 */
    if (typeof plugin.install === 'function') 
    {
      plugin.install.apply(plugin, args)
    } 
    /**如果插件的类型为函数，调用插件应用的函数 */
    else if (typeof plugin === 'function') 
    {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    /**返回全局API对象 */
    return this
  }
}
