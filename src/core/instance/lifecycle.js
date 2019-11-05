/* @flow */

import config from '../config'
import Watcher from '../observer/watcher'
import { mark, measure } from '../util/perf'
import { createEmptyVNode } from '../vdom/vnode'
import { observerState } from '../observer/index'
import { updateComponentListeners } from './events'
import { resolveSlots } from './render-helpers/resolve-slots'

import {
  warn,
  noop,
  remove,
  handleError,
  emptyObject,
  validateProp
} from '../util/index'

export let activeInstance: any = null
export let isUpdatingChildComponent: boolean = false
/**
 * 初始化生命周期
 * 设置组件对象的相关参数和初始化相关的参数
 * @param {*} vm 
 */
export function initLifecycle (vm: Component) 
{
  /**
   * 获取Vue对象的options对象
   */
  const options = vm.$options

  // locate first non-abstract parent
  /**获取组件的父组件 */
  let parent = options.parent
  /**对于父组件存在且abstract属性为假的处理
   * 如果父组件的.$options.abstract的值为真且parent.$parent的值为真的处理
   * 更新parent的是使上述条件不成立
   * 在主组件的子组件队列中添加此组件
   */
  if (parent && !options.abstract) 
  {
    while (parent.$options.abstract && parent.$parent) 
    {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }
  /**设置此组件的一些默认值 */
  /**此组件的父组件 */
  vm.$parent = parent
  /**此组件是否是根组件 */
  vm.$root = parent ? parent.$root : vm
  /**此组件的子组件 */
  vm.$children = []
  /** */
  vm.$refs = {}
  /**此组件的监听器 */
  vm._watcher = null
  /**此组件的活跃状态 */
  vm._inactive = null
  /**此组件的暂停状态 */
  vm._directInactive = false
  /**此组件的挂载状态 */
  vm._isMounted = false
  /**此组件的销毁状态 */
  vm._isDestroyed = false
  /**此组件的预销毁状态 */
  vm._isBeingDestroyed = false
}
/**组件的生命周期混合，实现组件的更新，强制更新和销毁的实现 */
export function lifecycleMixin (Vue: Class<Component>) 
{
  /**添加组件的更新哈数
   * vnode：
   * hydrating
   */
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) 
  {
    const vm: Component = this
    /**这个组件被挂载调用回调函数，进行预处理 */
    if (vm._isMounted) 
    {
      callHook(vm, 'beforeUpdate')
    }
    /**上一级元素 */
    const prevEl = vm.$el
    /**上一级节点 */
    const prevVnode = vm._vnode
    /**上一级有效实例 */
    const prevActiveInstance = activeInstance
    /**设置有效实例为当前实例 */
    activeInstance = vm
    /**设置当前节点的父节点为传入的vnode */
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    /**如果上一级节点不存在的处理，设置此节点的el值为调用__patch__函数的处理 */
    if (!prevVnode) 
    {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null
    } 
    else 
    {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    /**上一级元素存在的处理，设置上一级的__vue__的值为null */
    if (prevEl) 
    {
      prevEl.__vue__ = null
    }
    /**本组件的$el的值为真的处理设置vm.$el.__vue__的值为vm */
    if (vm.$el) 
    {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    /**如果 */
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) 
    {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
  /**更新所有当前的组件的_watcher */
  Vue.prototype.$forceUpdate = function () 
  {
    const vm: Component = this
    if (vm._watcher) 
    {
      vm._watcher.update()
    }
  }
/**销毁组件  */
  Vue.prototype.$destroy = function () 
  {
    const vm: Component = this
    /**如果组件的开始销毁状态为真返回 */
    if (vm._isBeingDestroyed) 
    {
      return
    }
    /**调用开始销毁的钩子函数 */
    callHook(vm, 'beforeDestroy')
    /**设置开始销毁的值为真 */
    vm._isBeingDestroyed = true
    // remove self from parent
    /**获取当前组件的父组件并在父组件的子组件中删除此组件 */
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) 
    {
      remove(parent.$children, vm)
    }
    // teardown watchers
    /**关闭此组件的监听器 */
    if (vm._watcher) 
    {
      vm._watcher.teardown()
    }
    /**删除此组件的所有组件的监听器 */
    let i = vm._watchers.length
    while (i--) 
    {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    /**如果此组件的 */
    if (vm._data.__ob__) 
    {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    /**设置此组件的销毁状态为真 */
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) 
    {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) 
    {
      vm.$vnode.parent = null
    }
  }
}
/**挂载组件,Vue对象$mount的具体实现
 * vm:组件对象
 * el:挂载的元素
 * hydrating：这个值一般很少用
 */
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component 
{
  vm.$el = el
  /** */
  if (!vm.$options.render) 
  {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') 
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||vm.$options.el || el) 
      {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } 
      else 
      {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  /**调用挂载回调函数 */
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) 
  {
    updateComponent = () => 
    {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } 
  else 
  {
    /**定义组件更新的方法 */
    updateComponent = () => 
    {
      vm._update(vm._render(), hydrating)
    }
  }

  vm._watcher = new Watcher(vm, updateComponent, noop)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) 
  {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}

export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: VNode,
  renderChildren: ?Array<VNode>
) 
{
  if (process.env.NODE_ENV !== 'production') 
  {
    isUpdatingChildComponent = true
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  const hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  )

  vm.$options._parentVnode = parentVnode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) 
  { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  vm.$options._renderChildren = renderChildren

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject
  vm.$listeners = listeners || emptyObject

  // update props
  if (propsData && vm.$options.props) 
  {
    observerState.shouldConvert = false
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) 
    {
      const key = propKeys[i]
      props[key] = validateProp(key, vm.$options.props, propsData, vm)
    }
    observerState.shouldConvert = true
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }

  // update listeners
  if (listeners) 
  {
    const oldListeners = vm.$options._parentListeners
    vm.$options._parentListeners = listeners
    updateComponentListeners(vm, listeners, oldListeners)
  }
  // resolve slots + force update if has children
  if (hasChildren) 
  {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }

  if (process.env.NODE_ENV !== 'production') 
  {
    isUpdatingChildComponent = false
  }
}
/**在组件树中向上获取组件的状态，即获取组件的状态 */
function isInInactiveTree (vm) 
{
  /**组件存在，如果组件的有效态为真返回真，反之返回假 */
  while (vm && (vm = vm.$parent)) 
  {
    if (vm._inactive) 
    {
      return true
    }
  }
  return false
}
/**设置子组件的状态 */
export function activateChildComponent (vm: Component, direct?: boolean) 
{
  if (direct) 
  {
    vm._directInactive = false
    if (isInInactiveTree(vm)) 
    {
      return
    }
  } 
  else if (vm._directInactive) 
  {
    return
  }
  if (vm._inactive || vm._inactive === null) 
  {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) 
    {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}
/**暂停组件
 * vm：组件对象
 * direct:暂停标志
 */
export function deactivateChildComponent (vm: Component, direct?: boolean) 
{
  /**暂停的处理
   * 设置暂停状态为真
   * 如果组件的状态为真返回
   */
  if (direct) 
  {
    vm._directInactive = true
    if (isInInactiveTree(vm)) 
    {
      return
    }
  }
  /**如果组件的活跃状态为假的处理且要解除暂停的处理
   * 设置主键的活跃状态为真，
   * 变量此组件的子组件设置为停止暂停
   * 调用钩子函数
   */
  if (!vm._inactive) 
  {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) 
    {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}
/**调用钩子函数
 * vm：组件
 * hook：状态字符串
 */
export function callHook (vm: Component, hook: string) {
  /**获取组件对应的钩子函数 */
  const handlers = vm.$options[hook]
  /**对于钩子函数存在的处理 */
  if (handlers) 
  {
    for (let i = 0, j = handlers.length; i < j; i++) 
    {
      try 
      {
        handlers[i].call(vm)
      } 
      catch (e) 
      {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  /**对于组件定义_hasHookEvent的处理 */
  if (vm._hasHookEvent) 
  {
    vm.$emit('hook:' + hook)
  }
}
