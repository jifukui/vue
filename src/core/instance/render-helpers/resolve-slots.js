/* @flow */

/**
 * 
 * @param {*} children 要渲染的子对象
 * @param {*} context  要渲染的内容
 */
export function resolveSlots (
  children: ?Array<VNode>,
  context: ?Component
): { [key: string]: Array<VNode> } 
{
  const slots = {}
  /**对于子对象的值为假的处理，返回空的对象 */
  if (!children) 
  {
    return slots
  }
  /**定义默认的槽
   * 变量子对象的所有参数
   */
  const defaultSlot = []
  for (let i = 0, l = children.length; i < l; i++) 
  {
    const child = children[i]
    const data = child.data
    // 删除属性上有槽数据的槽数据
    if (data && data.attrs && data.attrs.slot) 
    {
      delete data.attrs.slot
    }
    /**对于 */
    if ((child.context === context || child.functionalContext === context) &&data && data.slot != null) 
    {
      const name = child.data.slot
      const slot = (slots[name] || (slots[name] = []))
      if (child.tag === 'template') 
      {
        slot.push.apply(slot, child.children)
      } 
      else 
      {
        slot.push(child)
      }
    } 
    else 
    {
      defaultSlot.push(child)
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) 
  {
    slots.default = defaultSlot
  }
  return slots
}
/**
 * 判断是否是空白
 * @param {*} node 
 */
function isWhitespace (node: VNode): boolean {
  return node.isComment || node.text === ' '
}
/**
 * 
 * @param {*} fns 
 * @param {*} res 
 */
export function resolveScopedSlots (
  fns: ScopedSlotsData, // see flow/vnode
  res?: Object
): { [key: string]: Function } 
{
  res = res || {}
  for (let i = 0; i < fns.length; i++) 
  {
    if (Array.isArray(fns[i])) 
    {
      resolveScopedSlots(fns[i], res)
    } 
    else 
    {
      res[fns[i].key] = fns[i].fn
    }
  }
  return res
}
