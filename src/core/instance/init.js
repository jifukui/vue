/* @flow */
/**config导入配置信息 */
import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0
/**初始化混合
 * vue：为组件
 * 定义组件对象的原型的初始化函数
 */
export function initMixin (Vue: Class<Component>) 
{
  /**Vue原型的的初始化函数 */
  Vue.prototype._init = function (options?: Object) 
  {
    console.log("This is the first?");
    const vm: Component = this
    // a uid
    console.log("this uid is "+uid);
    vm._uid = uid++

    let startTag, endTag
    /**  istanbul ignore if 
     * 如果不是，非生产模式的调用
     * 正常情况下没有什么用
    */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) 
    {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    /**设置是否是Vue */
    vm._isVue = true
    /**options存在且options是组件初始化化此组件
     * 反之设置此组件为
     */
    if (options && options._isComponent) 
    {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      /**初始化内部组件 */
      initInternalComponent(vm, options)
    } 
    else 
    {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    /**如果不是开发模式初始化代理
     * 反之设置渲染代理为此对象
     */
    if (process.env.NODE_ENV !== 'production') 
    {
      initProxy(vm)
    } 
    else 
    {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    /**初始化生命周期 */
    initLifecycle(vm)
    /**初始化事件处理 */
    initEvents(vm)
    /**初始化渲染 */
    initRender(vm)
    /**使用钩子函数调用创建之前的过程 */
    callHook(vm, 'beforeCreate')
    /**初始化注入 */
    initInjections(vm) // resolve injections before data/props
    /**初始化状态 */
    initState(vm)
    /**初始化提供 */
    initProvide(vm) // resolve provide after data/props
    /**调用钩子函数创建的处理 */
    callHook(vm, 'created')

    /* istanbul ignore if */
    /**如果不是生产模式且 */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) 
    {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    /**进行挂载 */
    if (vm.$options.el) 
    {
      vm.$mount(vm.$options.el)
    }
  }
}
/**初始化内部组件options组件参数 
 * vm:为Vue对象
 * InternalComponentOptions：为传入的设置的Vue参数
*/
function initInternalComponent (vm: Component, options: InternalComponentOptions) 
{
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  /**内部组件的父组件 */
  opts.parent = options.parent
  /**传输数据的通道 */
  opts.propsData = options.propsData
  /**父组件的节点 */
  opts._parentVnode = options._parentVnode
  /**父组件的监听器 */
  opts._parentListeners = options._parentListeners
  /**父组件 */
  opts._renderChildren = options._renderChildren
  /**组件标签 */
  opts._componentTag = options._componentTag
  /**父元素 */
  opts._parentElm = options._parentElm
  /***引用的元素 */
  opts._refElm = options._refElm
  if (options.render) 
  {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
/** */
export function resolveConstructorOptions (Ctor: Class<Component>) 
{
  let options = Ctor.options
  if (Ctor.super) 
  {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) 
    {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) 
      {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) 
      {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
/** */
function resolveModifiedOptions (Ctor: Class<Component>): ?Object 
{
  let modified
  const latest = Ctor.options
  const extended = Ctor.extendOptions
  const sealed = Ctor.sealedOptions
  for (const key in latest) 
  {
    if (latest[key] !== sealed[key]) 
    {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}
/** */
function dedupe (latest, extended, sealed) 
{
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) 
  {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) 
    {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) 
      {
        res.push(latest[i])
      }
    }
    return res
  } 
  else 
  {
    return latest
  }
}
