/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
/** 设置uid的值为0 */
let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
/** 创建Dep类 */
export default class Dep{
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;
  /** 构造函数 */
  constructor () {
    this.id = uid++
    this.subs = []
  }
  /** 将sub压入对象数组中 */
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  /** 移除对象中的数据 */
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  /** 定义depend函数
   * 设置Dep对象的压入数组中
   */
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  /** Dep的通知函数
   * 设置此对象的所有子进行更新
   */
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

/** 定义Dep的目标为空 */
Dep.target = null
/** 目标栈数组 */
const targetStack = []
/** 向目标栈中压入数据 */
export function pushTarget (_target: Watcher) {
  if (Dep.target) {
    targetStack.push(Dep.target)
  }
  Dep.target = _target
}
/** 提取目标栈中的数据 */
export function popTarget () {
  Dep.target = targetStack.pop()
}
