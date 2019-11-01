/* @flow */

import { createFnInvoker } from './update-listeners'
import { remove, isDef, isUndef, isTrue } from 'shared/util'
/**
 * 聚合节点的钩子函数
 * @param {*} def 钩子对象
 * @param {*} hookKey 键值
 * @param {*} hook 处理函数
 */
export function mergeVNodeHook (def: Object, hookKey: string, hook: Function) 
{
  let invoker
  const oldHook = def[hookKey]
  /**
   * 
   */
  function wrappedHook () 
  {
    hook.apply(this, arguments)
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook)
  }
  /**对于老的钩子没有被定义的处理 */
  if (isUndef(oldHook)) 
  {
    // no existing hook
    invoker = createFnInvoker([wrappedHook])
  } 
  /**对于老的钩子被定义的处理 */
  else 
  {
    /**对于老的钩子的处理函数被定义且老的钩子被聚合的处理 */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) 
    {
      // already a merged invoker
      invoker = oldHook
      invoker.fns.push(wrappedHook)
    } 
    /**对于上述不成立的处理，创建新的函数 */
    else 
    {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook])
    }
  }
  /**设置Invoker的聚合状态 */
  invoker.merged = true
  /**设置对象的钩子的新的值 */
  def[hookKey] = invoker
}
