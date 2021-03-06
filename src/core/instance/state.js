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
/** 创建代理函数
 * target：目的对象
 * sourcekey:对象的键名
 * key:对象的键名
 * 设置对象target对象key属性的值和获取与设置函数
 */
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  /** 定义属性 */
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/** 初始化对象的状态
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
export function initState (vm: Component) {
  // 定义监听器
  vm._watchers = []
  const opts = vm.$options
  // 初始化props
  if (opts.props) {
    initProps(vm, opts.props)
  }
  // 初始化methods
  if (opts.methods) {
    initMethods(vm, opts.methods)
  }
  // 初始化data
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // 初始化computed
  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
  // 初始化watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
/**
 * 初始化组件的Props属性
 * @param {*} vm 组件
 * @param {*} propsOptions props参数 
 */
function initProps (vm: Component, propsOptions: Object) {
  // 获取此组件的的Props属性
  const propsData = vm.$options.propsData || {}
  /** props变量用于存储props属性 */
  const props = vm._props = {}
  /** keys和vm.$options._propKeys初始化为空数组，存储的是props属性的属性名 */
  const keys = vm.$options._propKeys = []
  /** isRoot变量存储是否是根组件 */
  const isRoot = !vm.$parent
  /** 设置发布器的状态 */
  observerState.shouldConvert = isRoot
  /** 将传入对象中的属性值添加至keys数组中
   * 判断value值是否是合法的props
   * 为此props对象添加发布处理
   * 如果这个属性不在组件对象中为组件添加此属性
   * 设置发布器的状态值为真
   */
  for (const key in propsOptions) {
    // 在属性名数组中添加此属性名
    keys.push(key)
    // 判断是否是合法的属性名
    const value = validateProp(key, propsOptions, propsData, vm)
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
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
    } else {
      defineReactive(props, key, value)
    }
    // 对于键名不存在于组件中的处理，设置组件对此属性进行代理处理
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
/** 初始化数据
 * vm：组件对象
 */
function initData (vm: Component) {
  /** data变量存储组件对象的数据 */
  let data = vm.$options.data
  /** 设置data值和Vue对象的值为data或者是data函数返回的值 */
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  /** 如果data的类型不是对象的处理设置data为空对象 */
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  /**
   * 设置keys的值为对象的键值
   * 设置props的值
   * 设置methods的值
   */
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  /** 循环获取data数据中的值需要保证data中的数据和props中的数据不冲突 */
  while (i--) {
    const key = keys[i]
    // 对于methods中也存在这个属性名的处理
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    /** 对于props存在且此属性存在于props的处理 */
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      /** 对于key不是预留的参数的处理
     * 定义组件的_data属性中的key属性的设置访问函数
     */
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
/** 获取数据
 * data:为函数
 * vm:为组件
 * 如果正常返回调用函数的返回值
 * 反之返回空对象
 */
function getData (data: Function, vm: Component): any {
  try {
    // 使用data函数，传入的对象为vm,参数为vm
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  }
}
/** 设置组件的监测器操作 */
const computedWatcherOptions = { lazy: true }
/**
 * 初始化计算属性
 * @param {*} vm 组件对象
 * @param {*} computed 计算对象
 */
function initComputed (vm: Component, computed: Object) {
  // 创建空的对象
  const watchers = vm._computedWatchers = Object.create(null)
  /** 此值获取是否是服务器端渲染 */
  const isSSR = isServerRendering()
  // 遍历计算属性中的属性
  for (const key in computed) {
    const userDef = computed[key]
    // 根据属性值设置getter函数
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }
    // 对于不是服务器端渲染的处理
    if (!isSSR) {
      // 设置监听器中这个属性的值为新创建的监听对象
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }
    // 对于属性不存在于组件中
    if (!(key in vm)) {
      //
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // 对于不是发布模式的处理
      // 这个键值存在于data属性中
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        // 这个属性存在于props属性中
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
/**
 * 
 * @param {*} target 目标对象
 * @param {*} key 属性值
 * @param {*} userDef 处理函数
 */
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  /** 获取是否是服务器端进行渲染 */
  const shouldCache = !isServerRendering()
  /** 如果用户定义是函数的处理
   * 如果不是服务器端渲染设置访问函数 createComputedGetter函数
   * 如果是服务器端渲染为设置访问函数为用户定义的函数
   * 设置设置属性为空
   * 如果用户定义不是函数
   * 如果用户定义的get属性是否存在
   */
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  if (process.env.NODE_ENV !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  // 定义目标的此属性的描述符
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/** 创建计算的获取器的获取方法
 * key:
 * 返回对应属性的访问方法
 * 设置watch的值为对象的计算监视器
 * 如果存在如果监视器的状态为脏调用监视器的计算函数
 * 如果依赖的target属性存在调用监视器的depend函数
 * 返回监视器的值
 */
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
/** 初始化方法
 * vm：组件对象
 * methods：对象
 * 获取所有method对象中的数据
 */
function initMethods (vm: Component, methods: Object) {
  // 获取组件的props属性
  const props = vm.$options.props
  /** 遍历所有的方法属性，如果方法中的数据不为空调用bind函数将这个 */
  for (const key in methods) {
    // 对于不是生产模式进行对方法属性和probs属性是否具有相同的属性名进行判断
    if (process.env.NODE_ENV !== 'production') {
      // 对于方法的此属性的值为空的处理进行警告
      if (methods[key] == null) {
        warn(
          `Method "${key}" has an undefined value in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    // 将此方法绑定在
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
/** 初始化监视器
 * vm：组件
 * watch：对象
 * 将watch对象中的属性创建监视器对象
 * 如果属性是数组对数组中的每一个值都创建监视器
 * 其他对象为对象创建监视器
 */
/**
 * 初始化监听属性
 * @param {*} vm 组件对象
 * @param {*} watch 监听对象
 */
function initWatch (vm: Component, watch: Object) {
  // 遍历监听属性的属性
  for (const key in watch) {
    // 获取监听器的处理函数
    const handler = watch[key]
    // 对于是数组的处理
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
/** 创建监视器
 * vm：组件对象
 * keyOrFn：属性值或者是函数
 * Handler：处理函数
 * option:传入的参数
 * 返回组件的
 * 根据Handler是否为可扩展对象进行处理
 * 如果handler为可扩展对象设置option的值为Handler设置Handler的值为Handler的值的Handler属性
 * 如果Handler的类型为字符串类型的处理设置Handler的值为组件对象的Handler属性
 * 返回组件对象调用watch的结果
 */
/**
 * 创建监听器
 * @param {*} vm 组件对象 
 * @param {*} keyOrFn 属性名
 * @param {*} handler 处理函数
 * @param {*} options 参数值
 */
function createWatcher (
  vm: Component,
  keyOrFn: string | Function,
  handler: any,
  options?: Object
) {
  /** 如果传入的handler是对象的处理*/
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  /** 对于处理函数是字符串的处理设置处理函数 */
  if (typeof handler === 'string') {
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
export function stateMixin (Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {}
  dataDef.get = function () { 
    return this._data 
  }
  const propsDef = {}
  propsDef.get = function () { 
    return this._props 
  }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData: Object) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  /** 定义对象的data和props */
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
  /** 设置对象的设置和删除方法 */
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  /** 实现监听
   * 如果cb对象是可扩展对象使用createWatcher创建监听器
   * 反之创建监听器对象根据传入对象的是否立即执行进行处理返回关闭监听函数
   */
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
