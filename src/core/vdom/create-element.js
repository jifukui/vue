/* @flow */

import config from '../config'
import VNode, { createEmptyVNode } from './vnode'
import { createComponent } from './create-component'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  isPrimitive,
  resolveAsset
} from '../util/index'

import {
  normalizeChildren,
  simpleNormalizeChildren
} from './helpers/index'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

/**
 * 创建DOM元素
 * @param {*} context 组件对象
 * @param {*} tag 标签
 * @param {*} data 数据
 * @param {*} children 子对象
 * @param {*} normalizationType 规范化模式
 * @param {*} alwaysNormalize 是否总是规范化模式
 */
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode 
{
  /**如果data为数组或者data是原始对象的处理
   * 设置normalizationType的值为children
   * children的值为data，data的值为未定义
   */
  if (Array.isArray(data) || isPrimitive(data)) 
  {
    normalizationType = children
    children = data
    data = undefined
  }
  /**如果alwaysNormalize的值为真的处理 */
  if (isTrue(alwaysNormalize)) 
  {
    normalizationType = ALWAYS_NORMALIZE
  }
  /**调用创建元素函数进行真正的创建元素 */
  return _createElement(context, tag, data, children, normalizationType)
}
/**
 * 真正的创建DOM元素的函数
 * @param {*} context 组件对象
 * @param {*} tag 组件标签
 * @param {*} data 数据
 * @param {*} children 子对象
 * @param {*} normalizationType 规范化类型
 */
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode 
{
  /**data定义且data的__ob__属性也被定义的处理，返回空的虚拟节点 */
  if (isDef(data) && isDef((data: any).__ob__)) 
  {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  /**如果data被定义且data的is属性被定义的处理
   * 设置tag的值为data的is属性值
   */
  if (isDef(data) && isDef(data.is)) 
  {
    tag = data.is
  }
  /**如果tag的值不空的处理，返回空的虚拟节点 */
  if (!tag) 
  {
    return createEmptyVNode()
  }
  if (process.env.NODE_ENV !== 'production' &&isDef(data) && isDef(data.key) && !isPrimitive(data.key)) 
  {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    )
  }
  /**如果children为数组且第一个子对象为函数的处理
   * 设置data的scopedSlots的属性
   */
  if (Array.isArray(children) &&typeof children[0] === 'function') 
  {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  /**如果常规类型的值为ALWAYS_NORMALIZE
   * 设置children的值为调用normalizeChildren后的结果
   * 如果为SIMPLE_NORMALIZEchildren的值为调用simpleNormalizeChildren的结果
   */
  if (normalizationType === ALWAYS_NORMALIZE) 
  {
    children = normalizeChildren(children)
  } 
  else if (normalizationType === SIMPLE_NORMALIZE) 
  {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  /**如果tag的类型为字符串的处理 */
  if (typeof tag === 'string') 
  {
    let Ctor
    /**设置ns的值为context.$vnode.ns或者是 */
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) 
    {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } 
    else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) 
    {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } 
    else 
    {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } 
  /**如果tag的类型不是字符串的处理 */
  else 
  {
    // direct component options / constructor
    /**设置vnode的值为创建组件后的值 */
    vnode = createComponent(tag, data, context, children)
  }
  /**如果vnode定义且ns的值为真调用applyNS函数，最终返回vnode
   * 反之返回调用createEmptyVNode的结果
  */
  if (isDef(vnode)) 
  {
    if (ns) 
    {
      applyNS(vnode, ns)
    }
    return vnode
  } 
  else 
  {
    return createEmptyVNode()
  }
}
/**
 * 
 * @param {*} vnode 
 * @param {*} ns 
 * @param {*} force 
 */
function applyNS (vnode, ns, force) 
{
  vnode.ns = ns
  if (vnode.tag === 'foreignObject') 
  {
    // use default namespace inside foreignObject
    ns = undefined
    force = true
  }
  if (isDef(vnode.children)) 
  {
    for (let i = 0, l = vnode.children.length; i < l; i++) 
    {
      const child = vnode.children[i]
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) 
      {
        applyNS(child, ns, force)
      }
    }
  }
}
