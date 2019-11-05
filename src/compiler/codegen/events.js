/* @flow */

const fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/
const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/

// keyCode aliases
const keyCodes: { [key: string]: number | Array<number> } = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
}

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
/** */
const genGuard = condition => `if(${condition})return null;`

const modifierCode: { [key: string]: string } = 
{
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard(`$event.target !== $event.currentTarget`),
  ctrl: genGuard(`!$event.ctrlKey`),
  shift: genGuard(`!$event.shiftKey`),
  alt: genGuard(`!$event.altKey`),
  meta: genGuard(`!$event.metaKey`),
  left: genGuard(`'button' in $event && $event.button !== 0`),
  middle: genGuard(`'button' in $event && $event.button !== 1`),
  right: genGuard(`'button' in $event && $event.button !== 2`)
}
/**
 * 参数处理代码
 * @param {*} events 
 * @param {*} isNative 
 * @param {*} warn 
 */
export function genHandlers (
  events: ASTElementHandlers,
  isNative: boolean,
  warn: Function
): string 
{
  /**根据传入的isNative进行处理 设置res的值 */
  let res = isNative ? 'nativeOn:{' : 'on:{'
  /**变量事件属性 */
  for (const name in events) 
  {
    /**获取事件值 */
    const handler = events[name]
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) 
    {
      warn(
        `Use "contextmenu" instead of "click.right" since right clicks ` +
        `do not actually fire "click" events.`
      )
    }
    /**字符串转换 */
    res += `"${name}":${genHandler(name, handler)},`
  }
  /**生成最终的字符串 */
  return res.slice(0, -1) + '}'
}
/**
 * 产生处理代码
 * @param {*} name 事件名称
 * @param {*} handler 事件处理函数
 */
function genHandler (
  name: string,
  handler: ASTElementHandler | Array<ASTElementHandler>
): string 
{
  /**如果事件处理函数的值为假返回空函数 */
  if (!handler) 
  {
    return 'function(){}'
  }
  /**如果事件处理函数是数组的处理 */
  if (Array.isArray(handler)) 
  {
    /**返回数组处理的形式 */
    return `[${handler.map(handler => genHandler(name, handler)).join(',')}]`
  }

  const isMethodPath = simplePathRE.test(handler.value)
  const isFunctionExpression = fnExpRE.test(handler.value)

  if (!handler.modifiers) 
  {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : `function($event){${handler.value}}` // inline statement
  } 
  else 
  {
    let code = ''
    let genModifierCode = ''
    const keys = []
    for (const key in handler.modifiers) 
    {
      if (modifierCode[key]) 
      {
        genModifierCode += modifierCode[key]
        // left/right
        if (keyCodes[key]) 
        {
          keys.push(key)
        }
      } 
      else if (key === 'exact') 
      {
        const modifiers: ASTModifiers = (handler.modifiers: any)
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(keyModifier => !modifiers[keyModifier])
            .map(keyModifier => `$event.${keyModifier}Key`)
            .join('||')
        )
      } 
      else 
      {
        keys.push(key)
      }
    }
    if (keys.length) 
    {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) 
    {
      code += genModifierCode
    }
    const handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? `(${handler.value})($event)`
        : handler.value
    return `function($event){${code}${handlerCode}}`
  }
}
/**
 * 产生键值过滤器代码
 * @param {*} keys 
 */
function genKeyFilter (keys: Array<string>): string 
{
  return `if(!('button' in $event)&&${keys.map(genFilterCode).join('&&')})return null;`
}
/**
 * 产生过滤代码
 * @param {*} key 
 */
function genFilterCode (key: string): string 
{
  /**将key转换为10进制的整数 */
  const keyVal = parseInt(key, 10)
  /**如果转换的值为真的处理
   * 返回
   */
  if (keyVal) 
  {
    return `$event.keyCode!==${keyVal}`
  }
  /**设置code的值在 */
  const code = keyCodes[key]
  return (
    `_k($event.keyCode,` +
    `${JSON.stringify(key)},` +
    `${JSON.stringify(code)},` +
    `$event.key)`
  )
}
