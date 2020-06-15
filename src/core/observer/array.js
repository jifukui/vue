/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'
/** 设置arrayProto的值为数组构造函数的原型 */
const arrayProto = Array.prototype
/** 数组的实现 */
export const arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */
/** 数组方法的实现 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // 获取这些方法
  const original = arrayProto[method]
  // 数组方法中这些方法的属性
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    // 通知参数改变
    ob.dep.notify()
    return result
  })
})
