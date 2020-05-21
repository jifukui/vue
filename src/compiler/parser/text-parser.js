/* @flow */

import { cached } from 'shared/util'
import { parseFilters } from './filter-parser'
/**默认的标签正则表达式 {{}}小括号中的.号和换行符只能出现0或者是1次*/
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
/**扩展的标签正则表达式 */
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
/**创建正则表达式 */
const buildRegex = cached(delimiters => {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&')
  const close = delimiters[1].replace(regexEscapeRE, '\\$&')
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
})
/**
 * 分析处理文本
 * @param {*} text 
 * @param {*} delimiters 
 */
export function parseText (
  text: string,
  delimiters?: [string, string]
): string | void 
{
  /**定义使用的正则表达式 */
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  /**对于没有匹配上的处理 */
  if (!tagRE.test(text)) 
  {
    return
  }
  const tokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index
  /**一直提取匹配的项 */
  while ((match = tagRE.exec(text))) 
  {
    index = match.index
    // push text token
    if (index > lastIndex) 
    {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }
    // tag token
    const exp = parseFilters(match[1].trim())
    tokens.push(`_s(${exp})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) 
  {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
  return tokens.join('+')
}
