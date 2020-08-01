/* @flow */
/**
 * 数据封装
 * @param {*} el 抽象的元素
 * @param {*} dir 抽象的指令
 */
export default function bind (el: ASTElement, dir: ASTDirective) 
{
  /**抽象的元素的封装数据为一个方法
   * 
   */
  el.wrapData = (code: string) => 
  {
    return `_b(${code},'${el.tag}',${dir.value},${
      dir.modifiers && dir.modifiers.prop ? 'true' : 'false'
    }${
      dir.modifiers && dir.modifiers.sync ? ',true' : ''
    })`
  }
}
