/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
/** 设置uid的值为0 */
let uid = 0
/**
 * 定义Dep类
 */
export default class Dep{
  static target: ?Watcher;//监听对象
  id: number;//id号
  subs: Array<Watcher>;//子监听数组
  /** 构造函数 */
  constructor () {
    this.id = uid++
    this.subs = []
  }
  /** 将监听器添加到此监听器的子数组中 */
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  /** 从此监听器子数组中删除此监听器*/
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  /**
   * 将此对象添加在父对象中的依赖监听器中
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
    // 转换为数组
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      // 更新数据
      subs[i].update()
    }
  }
}
//
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
/** 提取目标栈中栈顶的数据 */
export function popTarget () {
  Dep.target = targetStack.pop()
}
