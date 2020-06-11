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
/** 初始化渲染
 * 定义组件的槽和扩展槽的处理
 * 定义组件创建DOM元素的实现
 * 定义组件的属性和监听器改变的处理
 * vm：组件对象或Vue组件
 */
/**
 * 渲染的混入
 * 渲染的初始化
 * @param {*} vm Vue对象
 * 设置组件的$vnode属性为对象的_parentVnode属性的值
 * 设置组件的$slots的值为
 */
export function initRender (vm: Component) {
  // 虚拟节点
  vm._vnode = null
  /** 参数 */
  const options = vm.$options
  /** 父节点 */
  const parentVnode = vm.$vnode = options._parentVnode 
  /** 父对象的内容 */
  const renderContext = parentVnode && parentVnode.context
  /** 确定槽的参数 */
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  /** 设置槽范围的参数为空的对象 */
  vm.$scopedSlots = emptyObject
  /** 设置_c函数的方法为创建DOM元素*/
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  /** 设置对象$createElement的属相为创建DOM元素 强制使用规范格式*/
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  /** 获取父数据 */
  const parentData = parentVnode && parentVnode.data
  /** 给组件添加attrs和listeners的处理 */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}
/** 渲染的混入
 * Vue：组件对象
 */
export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  /** 安装转换助手 */
  installRenderHelpers(Vue.prototype)
  /** 定义组件的nextTick的方法实现 */
  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }
  /** 定义Vue的渲染属性函数的处理 */
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    /** 解构获取对象的render属性值和_parentVnode属性值 */
    const { render, _parentVnode } = vm.$options
    /** 对于组件被挂载的处理 */
    if (vm._isMounted) {
      /** 遍历组件的$slots的所有属性
       * 如果值的渲染属性为真深度的克隆此阐述到此组件的属性中
       */
      for (const key in vm.$slots) {
        const slot = vm.$slots[key]
        /** 对于已经被渲染的处理 */
        if (slot._rendered) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */)
        }
      }
    }
    /** 设置组件的作用域插槽的值为父节点的数据属性中的作用域插槽或者是个空的对象 */
    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      /** 调用call方法 */
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          } catch (e) {
            handleError(e, vm, `renderError`)
            vnode = vm._vnode
          }
        } else {
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    }
    /** vNode为渲染的对象，如果vnode的实例不是VNode */
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
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
