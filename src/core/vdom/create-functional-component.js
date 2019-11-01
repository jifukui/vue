/* @flow */

import VNode from './vnode'
import { createElement } from './create-element'
import { resolveInject } from '../instance/inject'
import { resolveSlots } from '../instance/render-helpers/resolve-slots'
import { installRenderHelpers } from '../instance/render-helpers/index'

import {
  isDef,
  isTrue,
  camelize,
  emptyObject,
  validateProp
} from '../util/index'
/**
 * 内容渲染函数
 * @param {*} data 节点数据
 * @param {*} props props值
 * @param {*} children 子组件
 * @param {*} parent 内容
 * @param {*} Ctor 组件
 */
function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) 
{
  /**获取组件的参数 */
  const options = Ctor.options
  this.data = data
  this.props = props
  this.children = children
  this.parent = parent
  this.listeners = data.on || emptyObject
  this.injections = resolveInject(options.inject, parent)
  this.slots = () => resolveSlots(children, parent)

  /**根据传入的对象获取 */
  const contextVm = Object.create(parent)
  /**设置是否被编译过 */
  const isCompiled = isTrue(options._compiled)
  /**设置 */
  const needNormalization = !isCompiled

  // support for compiled functional template
  /**对于编译的值为真的处理
   * 更新本对象的options参数
   */
  if (isCompiled) 
  {
    // exposing $options for renderStatic()
    this.$options = options
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots()
    this.$scopedSlots = data.scopedSlots || emptyObject
  }
  /**对于_scopeId的值为真的处理
   * 设置_c函数
   */
  if (options._scopeId) 
  {
    this._c = (a, b, c, d) => 
    {
      const vnode: ?VNode = createElement(contextVm, a, b, c, d, needNormalization)
      if (vnode) {
        vnode.functionalScopeId = options._scopeId
        vnode.functionalContext = parent
      }
      return vnode
    }
  } 
  /**
   * 对于_scopeId的值为假的处理
   */
  else 
  {
    this._c = (a, b, c, d) => createElement(contextVm, a, b, c, d, needNormalization)
  }
}
/** */
installRenderHelpers(FunctionalRenderContext.prototype)
/**
 * 创建组件函数
 * @param {*} Ctor 组件类
 * @param {*} propsData props数据
 * @param {*} data 节点数据
 * @param {*} contextVm 组件
 * @param {*} children 子组件
 */
export function createFunctionalComponent (
  Ctor: Class<Component>,
  propsData: ?Object,
  data: VNodeData,
  contextVm: Component,
  children: ?Array<VNode>
): VNode | void 
{
  const options = Ctor.options
  const props = {}
  /**获取组件中的props数据 */
  const propOptions = options.props
  /**如果propOptions被定义
   * 变量其中的属性并将其添加至props对象中
   */
  if (isDef(propOptions)) 
  {
    for (const key in propOptions) 
    {
      props[key] = validateProp(key, propOptions, propsData || emptyObject)
    }
  } 
  /**如果propOptions的值未定义的处理
   * 如果data.attrs被定义过将其中的属性添加至props中
   */
  else 
  {
    if (isDef(data.attrs))
    {
      mergeProps(props, data.attrs)
    }
    /**如果定义data.props将其中的属性添加至props中 */
    if (isDef(data.props)) 
    {
      mergeProps(props, data.props)
    }
  }
  /**创建新的渲染内容 */
  const renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  )
  /**设置vnode的值为调用 */
  const vnode = options.render.call(null, renderContext._c, renderContext)
  /**如果vnode原型链中存在Vnode
   * 设置vnode
   */
  if (vnode instanceof VNode) 
  {
    vnode.functionalContext = contextVm
    vnode.functionalOptions = options
    if (data.slot) 
    {
      (vnode.data || (vnode.data = {})).slot = data.slot
    }
  }

  return vnode
}
/**聚合Props，
 * 将form中的可枚举属性添加至to中并将属性值转换为驼峰式
 * 将其中的属性转换为驼峰式 */
function mergeProps (to, from) 
{
  for (const key in from) 
  {
    to[camelize(key)] = from[key]
  }
}
