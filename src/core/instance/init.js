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
/**
 * Vue的实例化，定义Vue对象的_init方法
 * @param {*} Vue对象
 */
export function initMixin (Vue: Class<Component>) 
{
  /**
   * Vue的原型初始化函数
   * options：为传入的对象
   */
  Vue.prototype._init = function (options?: Object) 
  {
    const vm: Component = this
    /**定义使用的Vue实例的编号 */
    vm._uid = uid++

    let startTag, endTag
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) 
    {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }
    /**设置是否是Vue */
    vm._isVue = true
    /**options存在且options是组件初始化化此组件
     * 反之设置此Vue对象的options值为传入的options参数与此对象继承的options对象进行合并
     */
    if (options && options._isComponent) 
    {
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
    /**如果不是生产模式的处理 */
    if (process.env.NODE_ENV !== 'production') 
    {
      initProxy(vm)
    } 
    /**对于是生产模式的处理
     * 设置Vue对象的_renderProxy属性的值为当前Vue对象
     */
    else 
    {
      vm._renderProxy = vm
    }
    /**设置_self属性的值为vm */
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
/**
 * 初始化内部组件
 * @param {*} vm 
 * @param {*} options 
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
/**
 * 这个参数用于获取此对象的父对象的options参数
 * 这函数用于获取对象的options，子对象继承父对象的options对象
 * @param {*} Ctor Ctor其实是Vue函数的构造函数，这里指向的还是Vue对象
 */
export function resolveConstructorOptions (Ctor: Class<Component>) 
{
  /**
   * 获取Ctor对象的option参数，其实这个参数是components,directives,filters和_base这四个属性其中_base这个属性执行这个函数
   * 当前这个对象是最简单的对象
   */
  let options = Ctor.options
  /**对于此对象的super属性的值为真的处理，即此对象的父对象 */
  if (Ctor.super) 
  {
    /**获取父对象的option参数 */
    const superOptions = resolveConstructorOptions(Ctor.super)
    /**获取 */
    const cachedSuperOptions = Ctor.superOptions
    /**对于当前的与缓存的不一致的处理
     * 更新缓存的数据
     */
    if (superOptions !== cachedSuperOptions) 
    {
      /**进行参数的更新 */
      Ctor.superOptions = superOptions
      /**获取修改后的修改参数 */
      const modifiedOptions = resolveModifiedOptions(Ctor)
      /**对于存在有修改的参数的处理
       * 将修改的参数添加至扩展的参数中
       */
      if (modifiedOptions) 
      {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      /**设置参数为父的当前参数与扩展的参数进行合并操作 */
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      /**如果有name参数设置此的组件名称为当前对象 */
      if (options.name) 
      {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
/**
 * 返回修改后对象
 * @param {*} Ctor Vue对象
 */
function resolveModifiedOptions (Ctor: Class<Component>): ?Object 
{
  let modified
  /**此对象的当前值 */
  const latest = Ctor.options
  /**此对象扩展的值 */
  const extended = Ctor.extendOptions
  /**此对象 */
  const sealed = Ctor.sealedOptions
  /**变量此对象当前的值
   * 对于当前的值不等于与的处理
   * 如果modified的值为假设置modified的值为空对象。
   * 设置modified对象的值为处理的值
   */
  for (const key in latest) 
  {
    if (latest[key] !== sealed[key]) 
    {
      if (!modified) 
      {
        modified = {}
      }
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}
/**
 * 这个函数的作用是根据当前值是否是数组进行处理
 * 如果不是数组直接返回此对象，
 * 如果是数组如果数组中的参数存在于扩展中获取不存在于封闭中添加此元素
 * @param {*} latest 当前的值
 * @param {*} extended 扩展的值
 * @param {*} sealed 封闭值
 */
function dedupe (latest, extended, sealed) 
{
  /**对于当前的值为数组的处理
   * 创建空的对象
   * 遍历当前值的所有索引
   * 对于这个值存在于扩展中或者是不存在与sealed中将此值添加至创建的资源数组中并返回此数组
   * 对于当前值不是数组直接返回此数组
   */
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
