/* @flow */

/**
 * 产生组件模式
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */
export function genComponentModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean 
{
  const { number, trim } = modifiers || {}
  /**设置基本的表达式 */
  const baseValueExpression = '$$v'
  let valueExpression = baseValueExpression
  if (trim) 
  {
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
        `? ${baseValueExpression}.trim()` +
        `: ${baseValueExpression})`
  }
  if (number) 
  {
    valueExpression = `_n(${valueExpression})`
  }
  const assignment = genAssignmentCode(value, valueExpression)

  el.model = {
    value: `(${value})`,
    expression: `"${value}"`,
    callback: `function (${baseValueExpression}) {${assignment}}`
  }
}

/**
 * 根据传入的数值，设置其数值或是设置方法
 * @param {*} value 
 * @param {*} assignment 
 */
export function genAssignmentCode (
  value: string,
  assignment: string
): string 
{
  /**返回进行模块化处理结束后的值 */
  const res = parseModel(value)
  /**对于值不为空的处理设置value的值为assignment的值 */
  if (res.key === null) 
  {
    return `${value}=${assignment}`
  } 
  /**对于值为空的处理 */
  else 
  {
    return `$set(${res.exp}, ${res.key}, ${assignment})`
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

let len, str, chr, index, expressionPos, expressionEndPos

type ModelParseResult = {
  exp: string,
  key: string | null
}
/**
 * 模块分析
 * @param {*} val 
 */
export function parseModel (val: string): ModelParseResult 
{
  /**获取字符串的长度 */
  len = val.length
  /**对于字符串中不存在方括号的处理 */
  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) 
  {
    /**获取最后一个点号的位置 */
    index = val.lastIndexOf('.')
    /**对于找到点号的处理
     * 设置exp为属性key为值
     */
    if (index > -1) 
    {
      return {
        exp: val.slice(0, index),
        key: '"' + val.slice(index + 1) + '"'
      }
    } 
    /**对于没有找到点号的处理 */
    else 
    {
      return {
        exp: val,
        key: null
      }
    }
  }
  /**对于存在方括号的处理 */
  str = val
  index = expressionPos = expressionEndPos = 0

  while (!eof()) 
  {
    chr = next()
    /**对于是头字符的处理 */
    if (isStringStart(chr)) 
    {
      parseString(chr)
    } 
    /**对于是方括号的处理 */
    else if (chr === 0x5B) 
    {
      parseBracket(chr)
    }
  }

  return 
  {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}
/**
 * 获取字符串的下一个字符的编码值
 */
function next (): number 
{
  return str.charCodeAt(++index)
}
/**
 * 判断是否到了字符串的结尾
 */
function eof (): boolean 
{
  return index >= len
}
/**
 * 是否是字符串的开始，即判断传入的参数是否时单引号或者是双引号
 * @param {*} chr 
 */
function isStringStart (chr: number): boolean 
{
  return chr === 0x22 || chr === 0x27
}
/**
 * 方括号的处理，返回找到匹配的方括号结束位置
 * @param {*} chr 
 */
function parseBracket (chr: number): void 
{
  let inBracket = 1
  expressionPos = index
  while (!eof()) 
  {
    chr = next()
    if (isStringStart(chr)) 
    {
      parseString(chr)
      continue
    }
    /**对于是方括号的处理 */
    if (chr === 0x5B) 
    {
      inBracket++
    }
    /**对于是方括号结束的处理 */
    if (chr === 0x5D) 
    {
      inBracket--
    }
    if (inBracket === 0) 
    {
      expressionEndPos = index
      break
    }
  }
}
/**
 * 字符串分析
 * 在字符串中寻找是否还有此字符
 * @param {*} chr 
 */
function parseString (chr: number): void 
{
  const stringQuote = chr
  /**一直循环到字符串结束 */
  while (!eof()) 
  {
    /**获取下一个字符的值 */
    chr = next()
    /**如果在后续的字符串中找到此字符退出 */
    if (chr === stringQuote) 
    {
      break
    }
  }
}
