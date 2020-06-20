/* @flow */

import { toNumber, toString, looseEqual, looseIndexOf } from 'shared/util'
import { createTextVNode, createEmptyVNode } from 'core/vdom/vnode'
import { renderList } from './render-list'
import { renderSlot } from './render-slot'
import { resolveFilter } from './resolve-filter'
import { checkKeyCodes } from './check-keycodes'
import { bindObjectProps } from './bind-object-props'
import { renderStatic, markOnce } from './render-static'
import { bindObjectListeners } from './bind-object-listeners'
import { resolveScopedSlots } from './resolve-slots'
/** 导出安装渲染帮助函数 */
export function installRenderHelpers (target: any) {
  target._o = markOnce // 标记一次
  target._n = toNumber // 转换为数字
  target._s = toString  // 转换为字符串
  target._l = renderList // 渲染链表
  target._t = renderSlot  // 渲染的槽
  target._q = looseEqual   // 不相等
  target._i = looseIndexOf //
  target._m = renderStatic //
  target._f = resolveFilter  //
  target._k = checkKeyCodes  //
  target._b = bindObjectProps  //
  target._v = createTextVNode  // 创建文本节点
  target._e = createEmptyVNode // 创建空节点
  target._u = resolveScopedSlots  // 范围槽
  target._g = bindObjectListeners // 绑定事件监听器
}
