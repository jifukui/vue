/* @flow */

const validDivisionCharRE = /[\w).+\-_$\]]/
/**
 * 根据输入的表达式转换为表达式
 * @param {*} exp 传入的属性  "{ fontSize: postFontSize + 'em' }"
 */
export function parseFilters (exp: string): string {
  let inSingle = false
  let inDouble = false
  let inTemplateString = false
  let inRegex = false
  let curly = 0
  let square = 0
  let paren = 0
  let lastFilterIndex = 0
  /**
   * c为当前字符的值
   * prev为之前字符的值
   */
  let c, prev, i, expression, filters

  for (i = 0; i < exp.length; i++) 
  {
    prev = c
    c = exp.charCodeAt(i)
    if (inSingle) 
    {
      /**当前字符为单引号，之前字符不是反斜杠 */
      if (c === 0x27 && prev !== 0x5C) 
      {
        inSingle = false
      }
    } 
    else if (inDouble) 
    {
      /**当前字符为双引号，之前字符不为反斜杠 */
      if (c === 0x22 && prev !== 0x5C) 
      {
        inDouble = false
      }
    } 
    else if (inTemplateString) 
    {
      /**当前字符为反单引号，之前字符不是反斜杠 */
      if (c === 0x60 && prev !== 0x5C) 
      {
        inTemplateString = false
      }
    } 
    else if (inRegex) 
    {
      /**当前字符为斜杠，之前字符不是反斜杠 */
      if (c === 0x2f && prev !== 0x5C) 
      {
        inRegex = false
      }
    } 
    /**当前字符为竖杠之后的字符不是竖杠且之前的字符不是竖杠且curly的值为否且square的值为否且paren的值为否 */
    else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) 
    {
      if (expression === undefined) 
      {
        // first filter, end of expression
        lastFilterIndex = i + 1
        expression = exp.slice(0, i).trim()
      } 
      else 
      {
        pushFilter()
      }
    } 
    else 
    {
      switch (c) 
      {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) 
      { // /
        let j = i - 1
        let p
        // find first non-whitespace prev char
        for (; j >= 0; j--) 
        {
          p = exp.charAt(j)
          if (p !== ' ') 
          {
            break
          }
        }
        if (!p || !validDivisionCharRE.test(p)) 
        {
          inRegex = true
        }
      }
    }
  }

  if (expression === undefined) 
  {
    expression = exp.slice(0, i).trim()
  } 
  else if (lastFilterIndex !== 0) 
  {
    pushFilter()
  }

  function pushFilter () 
  {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim())
    lastFilterIndex = i + 1
  }

  if (filters) 
  {
    for (i = 0; i < filters.length; i++) 
    {
      expression = wrapFilter(expression, filters[i])
    }
  }

  return expression
}
/**
 * 过滤器的封装
 * @param {*} exp 
 * @param {*} filter 
 */
function wrapFilter (exp: string, filter: string): string 
{
  /**获取字符串中的左括号 */
  const i = filter.indexOf('(')
  /**没有找到的处理 */
  if (i < 0) 
  {
    return `_f("${filter}")(${exp})`
  } 
  /**找到的处理 */
  else 
  {
    const name = filter.slice(0, i)
    const args = filter.slice(i + 1)
    return `_f("${name}")(${exp},${args}`
  }
}
