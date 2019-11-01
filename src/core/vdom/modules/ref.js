/* @flow */

import { remove } from 'shared/util'
/**
 * 
 */
export default 
{
  /**
   * 创建
   * @param {*} _ 
   * @param {*} vnode 
   */
  create (_: any, vnode: VNodeWithData) 
  {
    registerRef(vnode)
  },
  /**
   * 更新
   * @param {*} oldVnode 
   * @param {*} vnode 
   */
  update (oldVnode: VNodeWithData, vnode: VNodeWithData) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true)
      registerRef(vnode)
    }
  },
  /**
   * 销毁
   * @param {*} vnode 
   */
  destroy (vnode: VNodeWithData) {
    registerRef(vnode, true)
  }
}
/**
 * 注册Ref
 * @param {*} vnode 
 * @param {*} isRemoval 
 */
export function registerRef (vnode: VNodeWithData, isRemoval: ?boolean) 
{
  /**获取组件的ref相关数据
   * 如果不存在退出
   */
  const key = vnode.data.ref
  if (!key) 
  {
    return
  }
  /**获取组件对内容 */
  const vm = vnode.context
  /**获取组件的组件实例或者是 */
  const ref = vnode.componentInstance || vnode.elm
  /**设置refs的值为 */
  const refs = vm.$refs
  /**根据传入的是移除的状态值进行处理 */
  if (isRemoval) 
  {
    /** */
    if (Array.isArray(refs[key])) 
    {
      remove(refs[key], ref)
    } 
    else if (refs[key] === ref) 
    {
      refs[key] = undefined
    }
  } 
  /**对于移除状态不为真的处理 */
  else 
  {
    if (vnode.data.refInFor) 
    {
      if (!Array.isArray(refs[key])) 
      {
        refs[key] = [ref]
      } 
      else if (refs[key].indexOf(ref) < 0) 
      {
        // $flow-disable-line
        refs[key].push(ref)
      }
    } 
    else 
    {
      refs[key] = ref
    }
  }
}
