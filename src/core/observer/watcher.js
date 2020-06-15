/* @flow */

import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError
} from '../util/index'

import type { ISet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
/**导出默认的监视器
 * vm：组件对象
 * expression：
 * cb:回调函数
 * id:监听器的ID
 * deep:深度模式
 * user:用户模式
 * lazy:懒散模式
 * sync:同步状态
 * dirty:参数是否修改
 * active:监听器活动的状态
 * deps:当前依赖数组
 * newDeps:新的依赖数组
 * depIds:依赖的id
 * newDepIds: 新的依赖的id
 * getter:获取器
 * value:监听器的参数
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: ISet;
  newDepIds: ISet;
  getter: Function;
  value: any;
  /** 构造函数 */
  constructor (
    vm: Component,  //组件
    expOrFn: string | Function, //
    cb: Function,  //
    options?: Object //参数值
  ) {
    // 设置此对象的this指针的vm的值为传入的组件对象
    this.vm = vm
    // Vue对象的监听器中压入此监听器
    vm._watchers.push(this)
    // 设置参数deep深度userlay懒sync同步
    if (options) {
      this.deep = !!options.deep //深度
      this.user = !!options.user //用户 
      this.lazy = !!options.lazy //懒
      this.sync = !!options.sync //同步
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    //
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'? expOrFn.toString(): ''
    // 如果expOrFn的类型为函数的处理设置这个监听器的获取函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // 如果expOrFn的类型不是函数的处理，调用路径解析函数获取获取器
      // 如果获取器函数的值为假设置获取器函数为空函数同时进行提醒
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    // 根据当前监听器的lazy的值进行获取当前监听器的值
    this.value = this.lazy
      ? undefined
      : this.get()
  }
  // 监听器的获取函数
  get () {
    // 在目标栈中将当前的监听器进行压栈，同时设置当前的依赖目标为当前的监听器
    pushTarget(this)
    let value
    // 获取当前的Vue对象
    const vm = this.vm
    try {
      /** 使用当前监听器的获取器获取当前Vue对象的并传入Vue对象作为参数进行获取参数 */
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      /** 如果对象的deep属性的值为真 */
      if (this.deep) {
        traverse(value)
      }
      /** 在目标栈中弹出此监听器
       * 并设置当前的依赖对象为栈顶监听器
       */
      popTarget()
      //
      this.cleanupDeps()
    }
    return value
  }

  /** 添加依赖 */
  addDep (dep: Dep) {
    // 获取依赖的ID号
    const id = dep.id;
    /** 如果在newDepIds中没有这个ID号的依赖的处理进行
     * 在新的依赖的ID中添加此依赖的ID
     * 将此依赖压入到依赖的栈中
     * 如果depIds中也没有此属性，将此属性添加至Sub属性中
     */
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /** 清除依赖，清除Sub属性中的依赖 */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /** 更新依赖 */
  update () {
    /** 如果是懒更新，设置这个对象的状态为脏 */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      // 如果是同步修改
      this.run()
    } else {
      // 其他状态将这个对象添加到监听数组中
      queueWatcher(this)
    }
  }

  /** 运行监听器 */
  run () {
    if (this.active) {
      /** 对于监听器处于运行模式的处理
     * 调用获取参数
     * 如果参数不等于当前的值
     * 或者value是对象
     * 或者deep模式的处理
     * 设置老值为当前值，设置当前值为获取到的值，调用回调函数进行处理
     */
      const value = this.get()
      if (
        value !== this.value ||
        isObject(value) ||
        this.deep
      ) {
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
  /** 更新当前监听器的值，设置是否修改为否 */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }
  /** 全部的依赖 */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  /** 关闭监听器，删除所有的依赖 */
  teardown () {
    // 如果当前监听器是有效的处理
    if (this.active) {
      // 如果当前的Vue组件不处于将要销毁状态的处理
      if (!this.vm._isBeingDestroyed) {
        // 在当前监听器的Vue组件中的监听器数组删除此监听器
        remove(this.vm._watchers, this)
      }
      // 获取此监听器的依赖，并删除此依赖的子监听事件
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      // 设置当前的监听器处于非活跃状态
      this.active = false
    }
  }
}

/** 集合对象 */
const seenObjects = new Set()
function traverse (val: any) {
  /** 清空集合对象 */
  seenObjects.clear()
  _traverse(val, seenObjects)
}
/** 这个函数在deep为真的时候调用
 * 这个函数的作用是判定val的值不是对象和数组且不可扩展时直接返回
 * 对于对象具有__ob__s属相如果有此属性返回没有进行添加
 * 对于是数组和对象递归进行处理，即用来设置seen对象
 * val：
 * seen：
 */
function _traverse (val: any, seen: ISet) {
  let i, keys
  /** 是否是数组 */
  const isA = Array.isArray(val)
  /** 对于val不是数组也不是对象或者是此对象不可以进行扩展的处理
   * 返回空
   */
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  /** 对于对象具有__ob__属性 */
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    /** 对于对象具有depid属性值的属性
     * 返回空
     */
    if (seen.has(depId)) {
      return
    }
    /** 反之对此对象添加此属相 */
    seen.add(depId)
  }
  /** 对于是数组的处理 */
  if (isA) {
    i = val.length
    while (i--) {
      _traverse(val[i], seen)
    }
  } else {
    /** 对于不是数组的处理 */
    keys = Object.keys(val)
    i = keys.length
    while (i--) {
      _traverse(val[keys[i]], seen)
    }
  }
}
