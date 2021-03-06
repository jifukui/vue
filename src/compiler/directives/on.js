/* @flow */

import { warn } from 'core/util/index'
/**
 * 定义对于on事件的处理
 * @param {*} el DOM元素
 * @param {*} dir 指令
 */
export default function on (el: ASTElement, dir: ASTDirective) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn(`v-on without argument does not support modifiers.`)
  }
  // 元素对象封装监视器
  el.wrapListeners = (code: string) => `_g(${code},${dir.value})`
}
