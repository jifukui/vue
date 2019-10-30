/* @flow */

import {
  warn,
  nextTick,
  emptyObject,
  handleError,
  defineReactive
} from '../util/index'

import { createElement } from '../vdom/create-element'
import { installRenderHelpers } from './render-helpers/index'
import { resolveSlots } from './render-helpers/resolve-slots'
import VNode, { cloneVNodes, createEmptyVNode } from '../vdom/vnode'

import { isUpdatingChildComponent } from './lifecycle'
/**初始化渲染
 * vm：组件对象
 */
export function initRender (vm: Component) 
{
  vm._vnode = null // the root of the child tree
  /**参数 */
  const options = vm.$options
  /**父节点 */
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  /**父对象的内容 */
  const renderContext = parentVnode && parentVnode.context
  /** */
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  /** */
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  /**创建文本元素 */
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  /** */
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  /**获取父数据 */
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  /**给组件添加attrs和listeners的处理 */
  if (process.env.NODE_ENV !== 'production') 
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } 
  else 
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}
/**渲染的混合
 * Vue：组件对象
 */
export function renderMixin (Vue: Class<Component>) 
{
  // install runtime convenience helpers
  /**安装转换助手 */
  installRenderHelpers(Vue.prototype)
  /**定义组件的nextTick的方法实现 */
  Vue.prototype.$nextTick = function (fn: Function) 
  {
    return nextTick(fn, this)
  }
  /**定义Vue的渲染属性 */
  Vue.prototype._render = function (): VNode 
  {
    const vm: Component = this
    /**解构获取对象的render属性值和_parentVnode属性值 */
    const { render, _parentVnode } = vm.$options
    /**对于组件被挂载的处理 */
    if (vm._isMounted) 
    {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      /**遍历组件的$slots的所有属性
       * 如果值的渲染属性为真深度的克隆此阐述到此组件的属性中
       */
      for (const key in vm.$slots) 
      {
        const slot = vm.$slots[key]
        if (slot._rendered) 
        {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */)
        }
      }
    }
    /**设置组件的作用域插槽的值为父节点的数据属性中的作用域插槽或者是个空的对象 */
    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try 
    {
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) 
    {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') 
      {
        if (vm.$options.renderError) 
        {
          try 
          {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          } 
          catch (e) 
          {
            handleError(e, vm, `renderError`)
            vnode = vm._vnode
          }
        } 
        else 
        {
          vnode = vm._vnode
        }
      } 
      else 
      {
        vnode = vm._vnode
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) 
    {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) 
      {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
}
