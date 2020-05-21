/* @flow */

import config from '../config'
import Dep from '../observer/dep'
import Watcher from '../observer/watcher'
import { isUpdatingChildComponent } from './lifecycle'

import {
  set,
  del,
  observe,
  observerState,
  defineReactive
} from '../observer/index'

import {
  warn,
  bind,
  noop,
  hasOwn,
  hyphenate,
  isReserved,
  handleError,
  nativeWatch,
  validateProp,
  isPlainObject,
  isServerRendering,
  isReservedAttribute
} from '../util/index'
/**
 * 定义配置属性的方法
 * enumerable:可枚举
 * configurable:可配置
 * get:
 * set:
 */
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
/**创建代理函数
 * target：目的对象
 * sourcekey:
 * key:
 * 设置对象target对象key属性的值和获取与设置函数
 */
export function proxy (target: Object, sourceKey: string, key: string) 
{
  sharedPropertyDefinition.get = function proxyGetter () 
  {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) 
  {
    this[sourceKey][key] = val
  }
  /**定义属性 */
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/**初始化对象的状态
 * vm：组件对象
 * 如果组件对象具有props属性初始化props
 * 如果组件对象有methods对象初始化methods
 * 如果组件对象有data属性初始化data,反之调用observe函数
 * 如果组件对象具有computed属性初始化计算
 * 如果组件对象具有watch属性初始化watch
 */
/**
 * 
 * @param {*} vm Vue对象
 */
export function initState (vm: Component) 
{
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) 
  {
    initProps(vm, opts.props)
  }
  if (opts.methods) 
  {
    initMethods(vm, opts.methods)
  }
  if (opts.data) 
  {
    initData(vm)
  } 
  else 
  {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) 
  {
    initComputed(vm, opts.computed)
  }
  if (opts.watch && opts.watch !== nativeWatch) 
  {
    initWatch(vm, opts.watch)
  }
}
/**初始化props
 * vm：组件对象
 * propsOptions：
 * 获取组件中的propsData的数据，设置props变量
 */
function initProps (vm: Component, propsOptions: Object) 
{
  /**propsData变量存储当前组件中$options.propsData属性的值如果不存在为空对象 */
  const propsData = vm.$options.propsData || {}
  /**props变量用于存储props属性 */
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  /**keys变量存储传入对象的属性值 */
  const keys = vm.$options._propKeys = []
  /**isRoot变量存储是否是根组件 */
  const isRoot = !vm.$parent
  // root instance props should be converted
  /**设置发布器的状态 */
  observerState.shouldConvert = isRoot
  /**将传入对象中的属性值添加至keys数组中
   * 判断value值是否是合法的props
   * 为此props对象添加发布处理
   * 如果这个属性不在组件对象中为组件添加此属性
   * 设置发布器的状态值为真
   */
  for (const key in propsOptions) 
  {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') 
    {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||config.isReservedAttr(hyphenatedKey)) 
      {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => 
      {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } 
    else 
    {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) 
    {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
/**初始化数据
 * vm：组件对象
 */
function initData (vm: Component) 
{
  /**data变量存储组件对象的数据 */
  let data = vm.$options.data
  /**设置data值 */
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  /**如果data的类型不是对象的处理设置data为空对象 */
  if (!isPlainObject(data)) 
  {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  /**
   * 设置keys的值为对象的键值
   * 设置props的值
   * 设置methods的值
   */
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  /**循环获取data数据中的值需要保证data中的数据和props中的数据不冲突 */
  while (i--) 
  {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') 
    {
      if (methods && hasOwn(methods, key)) 
      {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    /**对于props存在且此属性存在于props的处理 */
    if (props && hasOwn(props, key)) 
    {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } 
    /**对于key不是预留的参数的处理
     * 定义组件的_data属性中的key属性的设置访问函数
     */
    else if (!isReserved(key)) 
    {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
/**获取数据
 * data:为函数
 * vm:为组件
 * 如果正常返回调用函数的返回值
 * 反之返回空对象
 */
function getData (data: Function, vm: Component): any 
{
  try 
  {
    return data.call(vm, vm)
  } 
  catch (e) 
  {
    handleError(e, vm, `data()`)
    return {}
  }
}
/**设置组件的监测器操作 */
const computedWatcherOptions = { lazy: true }
/**初始化计算器
 * vm:为组件
 * computer：计算对象
 * 
 */
function initComputed (vm: Component, computed: Object) 
{
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  /**此值获取是否是服务器端渲染 */
  const isSSR = isServerRendering()

  for (const key in computed) 
  {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) 
    {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) 
    {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) 
    {
      defineComputed(vm, key, userDef)
    } 
    else if (process.env.NODE_ENV !== 'production') 
    {
      if (key in vm.$data) 
      {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } 
      else if (vm.$options.props && key in vm.$options.props) 
      {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
/**定义计算
 * target：目标
 * key:属性
 * userDef:用户定义
 */
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) 
{
  /**获取是否是服务器端进行渲染 */
  const shouldCache = !isServerRendering()
  /**如果用户定义是函数的处理
   * 如果不是服务器端渲染设置访问函数 createComputedGetter函数
   * 如果是服务器端渲染为设置访问函数为用户定义的函数
   * 设置设置属性为空
   * 如果用户定义不是函数
   * 如果用户定义的get属性是否存在
   */
  if (typeof userDef === 'function') 
  {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef
    sharedPropertyDefinition.set = noop
  } 
  else 
  {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  if (process.env.NODE_ENV !== 'production' &&sharedPropertyDefinition.set === noop) 
  {
    sharedPropertyDefinition.set = function () 
    {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/**创建计算的获取器的获取方法
 * key:
 * 返回对应属性的访问方法
 * 设置watch的值为对象的计算监视器
 * 如果存在如果监视器的状态为脏调用监视器的计算函数
 * 如果依赖的target属性存在调用监视器的depend函数
 * 返回监视器的值
 */
function createComputedGetter (key) 
{
  return function computedGetter () 
  {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) 
    {
      if (watcher.dirty) 
      {
        watcher.evaluate()
      }
      if (Dep.target) 
      {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
/**初始化方法
 * vm：组件对象
 * methods：对象
 * 获取所有method对象中的数据
 */
function initMethods (vm: Component, methods: Object) 
{
  const props = vm.$options.props
  for (const key in methods) 
  {
    if (process.env.NODE_ENV !== 'production') 
    {
      if (methods[key] == null) 
      {
        warn(
          `Method "${key}" has an undefined value in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) 
      {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) 
      {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
/**初始化监视器
 * vm：组件
 * watch：对象
 * 将watch对象中的属性创建监视器对象
 * 如果属性是数组对数组中的每一个值都创建监视器
 * 其他对象为对象创建监视器
 */
function initWatch (vm: Component, watch: Object) 
{
  for (const key in watch) 
  {
    const handler = watch[key]
    if (Array.isArray(handler)) 
    {
      for (let i = 0; i < handler.length; i++) 
      {
        createWatcher(vm, key, handler[i])
      }
    } 
    else 
    {
      createWatcher(vm, key, handler)
    }
  }
}
/**创建监视器
 * vm：组件对象
 * keyOrFn：
 * Handler：
 * option:
 * 返回组件的
 * 根据Handler是否为可扩展对象进行处理
 * 如果handler为可扩展对象设置option的值为Handler设置Handler的值为Handler的值的Handler属性
 * 如果Handler的类型为字符串类型的处理设置Handler的值为组件对象的Handler属性
 * 返回组件对象调用watch的结果
 */
function createWatcher (
  vm: Component,
  keyOrFn: string | Function,
  handler: any,
  options?: Object
) 
{
  /**对于是对象的处理 */
  if (isPlainObject(handler)) 
  {
    options = handler
    handler = handler.handler
  }
  /**对于是字符串的处理 */
  if (typeof handler === 'string') 
  {
    handler = vm[handler]
  }
  return vm.$watch(keyOrFn, handler, options)
}
/**
 * 在Vue的原型对象上添加$data和$props属性的获取方法
 * 设置原型的set和del方法
 * watch方法
 * @param {*} Vue Vue对象 
 */
export function stateMixin (Vue: Class<Component>) 
{
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {}
  dataDef.get = function () 
  { 
    return this._data 
  }
  const propsDef = {}
  propsDef.get = function () 
  { 
    return this._props 
  }
  if (process.env.NODE_ENV !== 'production') 
  {
    dataDef.set = function (newData: Object) 
    {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () 
    {
      warn(`$props is readonly.`, this)
    }
  }
  /**定义对象的data和props */
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
  /**设置对象的设置和删除方法 */
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  /**实现监听
   * 如果cb对象是可扩展对象使用createWatcher创建监听器
   * 反之创建监听器对象根据传入对象的是否立即执行进行处理返回关闭监听函数
   */
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function 
  {
    const vm: Component = this
    if (isPlainObject(cb)) 
    {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) 
    {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () 
    {
      watcher.teardown()
    }
  }
}
