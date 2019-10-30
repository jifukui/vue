/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { warn, extend, mergeOptions } from '../util/index'
import { defineComputed, proxy } from '../instance/state'
/**初始化扩展
 * 全局API的扩展的实现
 * 返回扩展的对象
 */
export function initExtend (Vue: GlobalAPI) 
{
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  /**全局API的扩展，返回扩展的全局对象
   * extendOptions：扩展对象
   */
  Vue.extend = function (extendOptions: Object): Function 
  {
    /**获取扩展的属性 */
    extendOptions = extendOptions || {}
    /**定义此对象 */
    const Super = this
    /**定义此对象的cid */
    const SuperId = Super.cid
    /**获取扩展对象的_Ctor相关 */
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    /**如果缓存的SuperID属性值为真返回此属性对象 */
    if (cachedCtors[SuperId]) 
    {
      return cachedCtors[SuperId]
    }
    /**获取扩展对象的名字 */
    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production') 
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) 
      {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        )
      }
    }
    /**定义减法
     * 调用此对象的初始化方法
     */
    const Sub = function VueComponent (options) 
    {
      this._init(options)
    }
    /**定义Sub对象的原型属性为创建的当前的原型属性 */
    Sub.prototype = Object.create(Super.prototype)
    /**定义构造函数 */
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    /**Sub对象的属性值为聚合当前的属性值和扩展的属性值 */
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    /**如果props属性为真初始化其props属性 */
    if (Sub.options.props) 
    {
      initProps(Sub)
    }
    /**如果计算属性为真初始化计算属性 */
    if (Sub.options.computed) 
    {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    /**设置扩展，混合和使用的方法 */
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    /**设置资源的 */
    ASSET_TYPES.forEach(function (type) 
    {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    /**如果name的值为真的处理 */
    if (name) 
    {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}
/**初始化Props
 * 获取对象的options.props属性值
 * 
 */
function initProps (Comp) 
{
  const props = Comp.options.props
  for (const key in props) 
  {
    proxy(Comp.prototype, `_props`, key)
  }
}
/**初始化计算 */
function initComputed (Comp) 
{
  const computed = Comp.options.computed
  for (const key in computed) 
  {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
