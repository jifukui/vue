/* @flow */
/** config导入配置信息 */
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
 * 初始化混入函数
 * @param {*} Vue对象
 */
export function initMixin (Vue: Class<Component>) {
  /**
   * options为传入的参数结构体
   * 这个函数是Vue对象初始化的第一步
   * 首先设置组件对象的id
   * 设置对象的_isVue的值为真
   * 设置Vue对象的_renderProxy属性指向自己
   * 设置Vue对象的_self属性指向自己
   * 初始化生命周期相关函数
   * 初始化事件相关数据
   * 初始化渲染器相关数据
   * 调用钩子函数的beforeCreate
   * 初始化注射
   * 初始化状态
   * 初始化提供
   * 调用钩子函数的crated函数
   * 如果对象的$options.el属性有参数进行挂载
   * 完成Vue对象的初始化的相关工作直到元素被挂载到DOM对象上
   */
  /** Vue原型的 _init函数 */
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    /** 定义使用的Vue实例的编号 */
    vm._uid = uid++
    // 开始标签
    let startTag
    // 结束标签
    let endTag
    // 不是产品模式且config.performance和mark的值为真的处理,
    // 这里一般不会执行
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }
    vm._isVue = true
    /** options存在且options是组件初始化化此组件
     * 反之设置此Vue对象的options值为传入的options参数与此对象继承的options对象进行合并
     * 对于是组件的
     */
    if (options && options._isComponent) {
      /** 初始化内部组件 */
      initInternalComponent(vm, options)
    } else {
      /** 递归合并对象的options属性 */
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /** 如果不是生产模式的处理 */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
    /** 如果不是生产模式且 */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    /** 如果挂载元素存在进行挂载 */
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
/**
 * 初始化内部组件，即将组件挂载在父组件上
 * @param {*} vm 组件
 * @param {*} options 父组件对象
 */
function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  /** 内部组件的父组件 */
  opts.parent = options.parent
  /** 传输数据的通道 */
  opts.propsData = options.propsData
  /** 父组件的节点 */
  opts._parentVnode = options._parentVnode
  /** 父组件的监听器 */
  opts._parentListeners = options._parentListeners
  /** 父组件 */
  opts._renderChildren = options._renderChildren
  /** 组件标签 */
  opts._componentTag = options._componentTag
  /** 父元素 */
  opts._parentElm = options._parentElm
  /** 引用的元素 */
  opts._refElm = options._refElm
  /** 对于具有渲染属性的处理  */
  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
/**
 * 这个参数用于获取此对象的父对象的options参数
 * 这函数用于获取对象的options，子对象继承父对象的options对象
 * @param {*} Ctor Ctor其实是Vue函数的构造函数，这里指向的还是Vue对象
 */
export function resolveConstructorOptions (Ctor: Class<Component>) {
  /**
   * 获取Ctor对象的option参数，其实这个参数是components,directives,filters和_base这四个属性其中_base这个属性执行这个函数
   * 当前这个对象是最简单的对象
   */
  let options = Ctor.options
  /** 对于此对象的super属性的值为真的处理，即此对象的父对象 */
  if (Ctor.super) {
    /** 获取父对象的option参数 */
    const superOptions = resolveConstructorOptions(Ctor.super)
    /** 获取 */
    const cachedSuperOptions = Ctor.superOptions
    /** 对于当前的与缓存的不一致的处理
     * 更新缓存的数据
     */
    if (superOptions !== cachedSuperOptions) {
      /** 进行参数的更新 */
      Ctor.superOptions = superOptions
      /** 获取修改后的修改参数 */
      const modifiedOptions = resolveModifiedOptions(Ctor)
      /** 对于存在有修改的参数的处理
       * 将修改的参数添加至扩展的参数中
       */
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      /** 设置参数为父的当前参数与扩展的参数进行合并操作 */
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      /** 如果有name参数设置此的组件名称为当前对象 */
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
/**
 * 返回修改后的数组
 * @param {*} Ctor Vue对象
 */
function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  /** 此对象的当前值 */
  const latest = Ctor.options
  /** 此对象扩展的值 */
  const extended = Ctor.extendOptions
  /** 此对象 */
  const sealed = Ctor.sealedOptions
  /** 变量此对象当前的值
   * 对于当前的值不等于与的处理
   * 如果modified的值为假设置modified的值为空对象。
   * 设置modified对象的值为处理的值
   */
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {}
      }
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}
/**
 * 这个函数的作用是根据当前值是否是数组进行处理
 * 如果不是数组直接返回latest对象，
 * 如果是数组如果数组中的参数存在于扩展中或不存在于封闭中添加此元素到res数组中并返回此数组
 * @param {*} latest 当前的值
 * @param {*} extended 扩展的值
 * @param {*} sealed 封闭值
 */
function dedupe (latest, extended, sealed) {
  /** 对于当前的值为数组的处理
   * 创建空的对象
   * 遍历当前值的所有索引
   * 对于这个值存在于扩展中或者是不存在与sealed中将此值添加至创建的资源数组中并返回此数组
   * 对于当前值不是数组直接返回此数组
   */
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    return res
  } else {
    return latest
  }
}
