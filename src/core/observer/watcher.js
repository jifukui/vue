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
 * cb:
 * id:
 * deep:
 * user:
 * lazy:
 * sync:
 * dirty:
 * active:
 * deps:
 * newDeps:
 * depIds:
 * newDepIds:
 * getter:
 * value:
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
    // options
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

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  /** */
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

  /**
   * Add a dependency to this directive.
   */
  /**添加依赖
   * 如果
   */
  addDep (dep: Dep) 
  {
    const id = dep.id
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

  /**
   * Clean up for dependency collection.
   */
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

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
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

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () 
  {
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
  /**设置对象的value为 */
  evaluate () 
  {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  /** */
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
const seenObjects = new Set()
function traverse (val: any) 
{
  /**创建一个空对象 */
  seenObjects.clear()
  _traverse(val, seenObjects)
}
/**这个函数的作用未知但是 */
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
