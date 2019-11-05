/* @flow */

import { addProp } from 'compiler/helpers'
/**
 * 向元素的props属性中添加textContent数据
 * @param {*} el 抽象元素
 * @param {*} dir 
 */
export default function text (el: ASTElement, dir: ASTDirective) 
{
  if (dir.value) 
  {
    addProp(el, 'textContent', `_s(${dir.value})`)
  }
}
