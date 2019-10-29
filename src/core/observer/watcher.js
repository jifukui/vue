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
 * newDepIds:新的依赖的id 
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
  /**构造函数 */
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) 
  {
    this.vm = vm
    vm._watchers.push(this)
    // 设置状态
    if (options) 
    {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } 
    else 
    {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'? expOrFn.toString(): ''
    // parse expression for getter
    if (typeof expOrFn === 'function') 
    {
      this.getter = expOrFn
    } 
    else 
    {
      this.getter = parsePath(expOrFn);
      if (!this.getter) 
      {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }
  /**访问器实现 */
  get () 
  {
    /**在事件处理队列中添加此监听对象 */
    pushTarget(this)
    let value
    const vm = this.vm
    try 
    {
      /**使用构造函数传入的参数进行处理 */
      value = this.getter.call(vm, vm)
    } 
    catch (e) 
    {
      if (this.user) 
      {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } 
      else 
      {
        throw e
      }
    } 
    finally 
    {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      /**如果对象的deep属性的值为真 */
      if (this.deep) 
      {
        traverse(value)
      }
      /**弹出此 */
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**添加依赖 */
  addDep (dep: Dep) 
  {
    const id = dep.id;
    /**如果在newDepIds中没有此属性的处理
     * 添加此属性将此属性压入依赖数组中
     * 如果depIds中也没有此属性，将此属性添加至Sub属性中
     */
    if (!this.newDepIds.has(id)) 
    {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) 
      {
        dep.addSub(this)
      }
    }
  }

  /**清除依赖，清除Sub属性中的依赖 */
  cleanupDeps () 
  {
    let i = this.deps.length
    while (i--) 
    {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) 
      {
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

  /**更新依赖 */
  update () 
  {
    /* istanbul ignore else */
    if (this.lazy) 
    {
      this.dirty = true
    } 
    else if (this.sync) 
    {
      this.run()
    } 
    else 
    {
      queueWatcher(this)
    }
  }

  /**运行监听器 */
  run () 
  {
    /**对于监听器处于运行模式的处理
     * 调用获取参数
     * 如果参数不等于当前的值
     * 或者value是对象
     * 或者deep模式的处理
     * 设置老值为当前值，设置当前值为获取到的值，调用回调函数进行处理
     */
    if (this.active) 
    {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) 
      {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) 
        {
          try 
          {
            this.cb.call(this.vm, value, oldValue)
          } 
          catch (e) 
          {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } 
        else 
        {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  /**更新当前监听器的值，设置是否修改为否 */
  evaluate () 
  {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  /**全部的依赖 */
  depend () 
  {
    let i = this.deps.length
    while (i--) 
    {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  /**关闭监听器，删除所有的依赖 */
  teardown () 
  {
    if (this.active) 
    {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) 
      {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) 
      {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
/**集合对象 */
const seenObjects = new Set()
function traverse (val: any) 
{
  /**清空集合对象 */
  seenObjects.clear()
  _traverse(val, seenObjects)
}
/**这个函数在deep为真的时候调用
 * 这个函数的作用是判定val的值不是对象和数组且不可扩展时直接返回
 * 对于对象具有__ob__s属相如果有此属性返回没有进行添加
 * 对于是数组和对象递归进行处理，即用来设置seen对象
 * val：
 * seen：
 */
function _traverse (val: any, seen: ISet) 
{
  let i, keys
  /**是否是数组 */
  const isA = Array.isArray(val)
  /**对于val不是数组也不是对象或者是此对象不可以进行扩展的处理
   * 返回空
   */
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) 
  {
    return
  }
  /**对于对象具有__ob__属性 */
  if (val.__ob__) 
  {
    const depId = val.__ob__.dep.id
    /**对于对象具有depid属性值的属性
     * 返回空
     */
    if (seen.has(depId)) 
    {
      return
    }
    /**反之对此对象添加此属相 */
    seen.add(depId)
  }
  /**对于是数组的处理 */
  if (isA) 
  {
    i = val.length
    while (i--) 
    {
      _traverse(val[i], seen)
    }
  } 
  /**对于不是数组的处理 */
  else 
  {
    keys = Object.keys(val)
    i = keys.length
    while (i--) 
    {
      _traverse(val[keys[i]], seen)
    }
  }
}
