/* @flow */

import deindent from 'de-indent'
import { parseHTML } from 'compiler/parser/html-parser'
import { makeMap } from 'shared/util'
// 隔离正则表达式
const splitRE = /\r?\n/g
// 替换正则表达式
const replaceRE = /./g
// 特殊标签
const isSpecialTag = makeMap('script,style,template', true)
/**
 * 属性
 */
type Attribute = {
  name: string,
  value: string
};

/**
 * 组件分析
 * @param {*} content 内容  内容字符串
 * @param {*} options 操作  操纵对象
 */
export function parseComponent (
  content: string,
  options?: Object = {}
 ): SFCDescriptor 
 {
  const sfc: SFCDescriptor = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  }
  let depth = 0
  let currentBlock: ?(SFCBlock | SFCCustomBlock) = null
  /**
   * 开始处理组件
   * @param {*} tag     开始标签
   * @param {*} attrs   属性
   * @param {*} unary 
   * @param {*} start   开始位置
   * @param {*} end     结束位置
   */
  function start (
    tag: string,
    attrs: Array<Attribute>,
    unary: boolean,
    start: number,
    end: number
  ) {
    // 对于深度为0的处理，设置当前块的属性
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce((cumulated, { name, value }) => {
          cumulated[name] = value || true
          return cumulated
        }, Object.create(null))
      }
      /**
       * 对于特殊的标签的处理
       * 检测当前块和属相数组
       */
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs)
        if (tag === 'style') {
          // 对于标签是style的处理，加入到sfc的styles数组中
          sfc.styles.push(currentBlock)
        } else {
          // 对于是其他类型的标签替换此标签的值
          sfc[tag] = currentBlock
        }
      } else { // custom blocks
        sfc.customBlocks.push(currentBlock)
      }
    }
    // 对于unary的值不为真设置depth的值自加一
    if (!unary) {
      depth++
    }
  }
  /**
   * 检测属性
   * @param {*} block 块
   * @param {*} attrs 属性数组
   */
  function checkAttrs (block: SFCBlock, attrs: Array<Attribute>) {
    // 获取属相对象的长度
    for (let i = 0; i < attrs.length; i++) {
      // 获取属性值
      const attr = attrs[i]
      // 对于属性的name为lang
      if (attr.name === 'lang') {
        block.lang = attr.value
      }
      // 对于属性的name为scoped的处理
      if (attr.name === 'scoped') {
        block.scoped = true
      }
      // 对于属性的name为module的处理
      if (attr.name === 'module') {
        block.module = attr.value || true
      }
      // 对于属性的name的值为src的处理
      if (attr.name === 'src') {
        block.src = attr.value
      }
    }
  }
  /**
   * 结束分析标签
   * @param {*} tag 标签字符串
   * @param {*} start 开始的位置
   * @param {*} end 结束位置
   */
  function end (tag: string, start: number, end: number) {
    // 对于甚多值为1且当前块存在的处理
    if (depth === 1 && currentBlock) {
      currentBlock.end = start
      let text = deindent(content.slice(currentBlock.start, currentBlock.end))
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text
      }
      currentBlock.content = text
      currentBlock = null
    }
    depth--
  }
  /**
   * 填充内容
   * @param {*} block 块
   * @param {*} pad  填充内容
   */
  function padContent (block: SFCBlock | SFCCustomBlock, pad: true | "line" | "space") {
    // 对于填充的内容是space的处理将内容的开始到block.start的值截取并将替换正则表达式转换为空格符
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      const offset = content.slice(0, block.start).split(splitRE).length
      const padChar = block.type === 'script' && !block.lang
        ? '//\n'
        : '\n'
      return Array(offset).join(padChar)
    }
  }
  /** 分许HTML */
  parseHTML(content, {
    start,
    end
  })

  return sfc
}
