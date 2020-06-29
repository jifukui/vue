/* @flow */

import { addProp } from 'compiler/helpers'
/**
 * 向属性中添加innerHTML属性
 * 向抽象属性中添加对象属性名为innerHTML属性值为_s(dir.value的值)
 * @param {*} el 抽象元素
 * @param {*} dir 抽象指令
 */
export default function html (el: ASTElement, dir: ASTDirective) {
  // 对于指令中有value属性，在
  if (dir.value) {
    addProp(el, 'innerHTML', `_s(${dir.value})`)
  }
}
