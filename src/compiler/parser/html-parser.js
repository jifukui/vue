/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

import { makeMap, no } from 'shared/util'
import { isNonPhrasingTag } from 'web/compiler/util'

// Regular Expressions for parsing tags and attributes
/**匹配属性[0]为整体匹配的值[1]为匹配到的属性[2]为等号[3]为属性的值 */
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
/**匹配a-zA-Z_一个后面接0到多个 */
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
/**匹配 */
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
/**匹配开始标签的结束标签 */
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
/**匹配以<!doctype开始 +任意非>字符 并以>结束的字符 */
const doctype = /^<!DOCTYPE [^>]+>/i
/**匹配以<!--开始的字符串 */
const comment = /^<!--/
/**匹配以<![开始的字符 */
const conditionalComment = /^<!\[/

let IS_REGEX_CAPTURING_BROKEN = false
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === ''
})

/**
 * 定义原生的文本元素
 */
export const isPlainTextElement = makeMap('script,style,textarea', true)
const reCache = {}
/**解码的映射表 */
const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
}
/**编码的属性 */
const encodedAttr = /&(?:lt|gt|quot|amp);/g
/**编码的属性 */
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g

// #5992
/**忽略新行的标签正则表达式 */
const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'
/**
 * 解码属性
 * @param {*} value 
 * @param {*} shouldDecodeNewlines 
 */
function decodeAttr (value, shouldDecodeNewlines) 
{
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
  return value.replace(re, match => decodingMap[match])
}
/**
 * 分析HTML的函数
 * @param {*} html 模板字符串
 * @param {*} options 传入的处理方法和参数
 */
export function parseHTML (html, options) 
{
  const stack = []
  const expectHTML = options.expectHTML
  const isUnaryTag = options.isUnaryTag || no
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no
  let index = 0
  let last, lastTag
  while (html) 
  {
    last = html
    /**
     * 对于lastTag的值不为空或者不是原生的文本元素的处理
     */
    if (!lastTag || !isPlainTextElement(lastTag)) 
    {
      /**
       * 获取第一个<符出现的位置对于出现的位置为第一个值的处理
       */
      let textEnd = html.indexOf('<')
      if (textEnd === 0) 
      {
        if (comment.test(html)) 
        {
          const commentEnd = html.indexOf('-->')

          if (commentEnd >= 0) 
          {
            if (options.shouldKeepComment) 
            {
              options.comment(html.substring(4, commentEnd))
            }
            advance(commentEnd + 3)
            continue
          }
        }
        if (conditionalComment.test(html)) 
        {
          const conditionalEnd = html.indexOf(']>')

          if (conditionalEnd >= 0) 
          {
            advance(conditionalEnd + 2)
            continue
          }
        }
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) 
        {
          advance(doctypeMatch[0].length)
          continue
        }
        /**匹配结束标签 */
        const endTagMatch = html.match(endTag)
        if (endTagMatch) 
        {
          const curIndex = index
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1], curIndex, index)
          continue
        }

        /**获取处理开始标签的处理 */
        const startTagMatch = parseStartTag()
        /**对于处理结果为真的处理 */
        if (startTagMatch) 
        {
          handleStartTag(startTagMatch)
          if (shouldIgnoreFirstNewline(lastTag, html)) 
          {
            advance(1)
          }
          continue
        }
      }

      let text, rest, next
      if (textEnd >= 0) 
      {
        rest = html.slice(textEnd)
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) 
        {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1)
          if (next < 0) 
          {
            break
          }
          textEnd += next
          rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
        advance(textEnd)
      }

      if (textEnd < 0) 
      {
        text = html
        html = ''
      }

      if (options.chars && text) 
      {
        options.chars(text)
      }
    } 
    /**
     * 对于lasttag的值为空或者lastTag的值为原生文本元素的处理
     */
    else 
    {
      let endTagLength = 0
      const stackedTag = lastTag.toLowerCase()
      const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
      const rest = html.replace(reStackedTag, function (all, text, endTag) 
      {
        endTagLength = endTag.length
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') 
        {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) 
        {
          text = text.slice(1)
        }
        if (options.chars) 
        {
          options.chars(text)
        }
        return ''
      })
      index += html.length - rest.length
      html = rest
      parseEndTag(stackedTag, index - endTagLength, index)
    }
    /**
     * 对于html的值为last的值的处理
     */
    if (html === last) 
    {
      options.chars && options.chars(html)
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) 
      {
        options.warn(`Mal-formatted tag at end of template: "${html}"`)
      }
      break
    }
  }
  /**分析结束标签 */
  parseEndTag()
  /**
   * 更新当前的索引值获取字符串在此索引值后面的内容
   * @param {*} n 
   */
  function advance (n) 
  {
    index += n
    html = html.substring(n)
  }
  /**
   * 分析开始标签
   * 返回匹配到结果
   */
  function parseStartTag () 
  {
    /**匹配开始标签 */
    const start = html.match(startTagOpen)
    if (start) 
    {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      }
      /**前进 */
      advance(start[0].length)
      let end, attr
      /**
       * 对于没有匹配到结束标签或者是匹配到属性的处理
       * 前进属性个数据长度，添加到匹配的属性数组中
       */
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) 
      {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      /**对于匹配到结束标签的处理
       * 返回匹配结果
       */
      if (end) 
      {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }
  /**
   * 开始标签的处理
   * @param {*} match 开始标签中的属性数组
   * 获取标签名
   */
  function handleStartTag (match) 
  {
    /**标签名 */
    const tagName = match.tagName
    const unarySlash = match.unarySlash
    /**这个值应该一直是真 */
    if (expectHTML) 
    {
      /**对于结束标签是p或者是非短语标签的处理 */
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) 
      {
        parseEndTag(lastTag)
      }
      /** */
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) 
      {
        parseEndTag(tagName)
      }
    }

    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) 
    {
      const args = match.attrs[i]
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) 
      {
        if (args[3] === '') 
        { 
          delete args[3] 
        }
        if (args[4] === '') 
        { 
          delete args[4] 
        }
        if (args[5] === '') 
        { 
          delete args[5] 
        }
      }
      const value = args[3] || args[4] || args[5] || ''
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      }
    }

    if (!unary) 
    {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
      lastTag = tagName
    }

    if (options.start) 
    {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }
  /**
   * 分析结束标签
   * @param {*} tagName 
   * @param {*} start 
   * @param {*} end 
   */
  function parseEndTag (tagName, start, end) 
  {
    let pos, lowerCasedTagName
    if (start == null) 
    {
      start = index
    }
    if (end == null) 
    {
      end = index
    }

    if (tagName) 
    {
      lowerCasedTagName = tagName.toLowerCase()
    }

    // Find the closest opened tag of the same type
    if (tagName) 
    {
      for (pos = stack.length - 1; pos >= 0; pos--) 
      {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) 
        {
          break
        }
      }
    } 
    else 
    {
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) 
    {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) 
      {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) 
        {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`
          )
        }
        if (options.end) 
        {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } 
    else if (lowerCasedTagName === 'br') 
    {
      if (options.start) 
      {
        options.start(tagName, [], true, start, end)
      }
    } 
    else if (lowerCasedTagName === 'p') 
    {
      if (options.start) 
      {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) 
      {
        options.end(tagName, start, end)
      }
    }
  }
}
