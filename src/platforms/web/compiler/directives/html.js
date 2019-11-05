/* @flow */

import { addProp } from 'compiler/helpers'
/**
 * 向属性中添加innerHTML属性
 * @param {*} el 元素对象
 * @param {*} dir 
 */
export default function html (el: ASTElement, dir: ASTDirective) 
{
  if (dir.value) 
  {
    addProp(el, 'innerHTML', `_s(${dir.value})`)
  }
}
