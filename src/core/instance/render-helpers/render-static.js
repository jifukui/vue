/* @flow */

import { cloneVNode, cloneVNodes } from 'core/vdom/vnode'

/**
 * 静态渲染
 * @param {*} index 
 * @param {*} isInFor 
 * 返回设置好的节点
 */
export function renderStatic (
  index: number,
  isInFor?: boolean
): VNode | Array<VNode> 
{
  /**获取此对象的静态渲染函数 */
  const renderFns = this.$options.staticRenderFns
  /**获取渲染的缓存 */
  const cached = renderFns.cached || (renderFns.cached = [])
  /**获取指定的渲染对象的缓存 */
  let tree = cached[index]
  /**对于tree的值不为空且isInFor的值为假的处理，将tree数组化 */
  if (tree && !isInFor) 
  {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = renderFns[index].call(this._renderProxy, null, this)
  /**标记为静态且不是只更新一次 */
  markStatic(tree, `__static__${index}`, false)
  return tree
}

/**
 * 标记节点为静态且只渲染一次
 * @param {*} tree 节点
 * @param {*} index 索引值
 * @param {*} key 键名
 */
export function markOnce (
  tree: VNode | Array<VNode>,
  index: number,
  key: string
) 
{
  markStatic(tree, `__once__${index}${key ? `_${key}` : ``}`, true)
  return tree
}
/**
 * 标记节点为静态
 * @param {*} tree  虚拟节点
 * @param {*} key 属性键
 * @param {*} isOnce 是否只渲染一次
 */
function markStatic (
  tree: VNode | Array<VNode>,
  key: string,
  isOnce: boolean
) 
{
  /**对于tree的是值为数组的处理 */
  if (Array.isArray(tree)) 
  {
    /**变量tree的所有元素
     * 对于此元素存在且类型不是字符串的处理
     * 调用markStaticNode设置此元素的相关属性
     */
    for (let i = 0; i < tree.length; i++) 
    {
      if (tree[i] && typeof tree[i] !== 'string') 
      {
        markStaticNode(tree[i], `${key}_${i}`, isOnce)
      }
    }
  } 
  /**对于不是数组的处理 */
  else 
  {
    markStaticNode(tree, key, isOnce)
  }
}
/**
 * 设置节点相关属性，即标记节点为静态节点
 * @param {*} node 节点
 * @param {*} key 属性值
 * @param {*} isOnce 是否只渲染一次
 */
function markStaticNode (node, key, isOnce) 
{
  node.isStatic = true
  node.key = key
  node.isOnce = isOnce
}
