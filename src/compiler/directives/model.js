/* @flow */

/**
 * 产生组件模式
 * 即生成此抽象元素的model的值参数和回调函数
 * @param {*} el 抽象元素
 * @param {*} value 指令值
 * @param {*} modifiers 修饰符
 */
export function genComponentModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  // 获取修饰符中的number属性和trim属性
  const { number, trim } = modifiers || {}
  /** 设置基本的表达式 */
  const baseValueExpression = '$$v'
  let valueExpression = baseValueExpression
  // 对于修饰符中存在trim属性的处理，即去掉首尾的空白符
  if (trim) {
    // 定义参数值的表达式为根据基本表达式的值的类型是否为字符串
    // 如果baseValueExpression的值为字符串返回baseValueExpression去掉首尾空格的值
    // baseValueExpression如果baseValueExpression不是字符串返回baseValueExpression的值
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
        `? ${baseValueExpression}.trim()` +
        `: ${baseValueExpression})`
  }
  // 对于修饰符中存在number属性的处理，即需要传入的数据为数值
  if (number) {
    // 设置valueExpression 的值为_n(valueExpression的值)
    valueExpression = `_n(${valueExpression})`
  }
  // 设置 assignment的值为调用genAssignmentCode的返回值
  // 返回的是赋值字符串或者是$set字符串
  const assignment = genAssignmentCode(value, valueExpression)
  // 设置抽象节点的model属性，有value,expression,callback
  el.model = {
    value: `(${value})`,
    expression: `"${value}"`,
    callback: `function (${baseValueExpression}) {${assignment}}`
  }
}

/**
 * 根据传入的数值，设置其数值或是设置方法
 * @param {*} value 传入的参数值
 * @param {*} assignment 传入的处理代码
 */
export function genAssignmentCode (
  value: string,
  assignment: string
): string {
  /** 返回进行模块化处理结束后的值，即区分属性值和属性名 */
  const res = parseModel(value)
  // 对于结果中的属性名为null的处理，设置value=assignment
  if (res.key === null) {
    return `${value}=${assignment}`
  } else {
    /** 结果的key属性不为Null的处理 设置返回的字符串为 */
    return `$set(${res.exp}, ${res.key}, ${assignment})`
  }
}
/**
 * 定义变量
 * len：传入字符串的长度
 * str: 传入的字符串
 * chr：当前获取的字符
 * index：当前处理字符的位置
 * expressionPos：表达式开始的位置号
 * expressionEndPos：表达式解决的位置
 */
let len, str, chr, index, expressionPos, expressionEndPos

type ModelParseResult = {
  exp: string,
  key: string | null
}
/**
 * 模块分析
 * @param {*} val 参数值
 */
export function parseModel (val: string): ModelParseResult {
  /** 获取字符串的长度 */
  len = val.length
  // 对于不存在'['但是存在']'的处理
  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    /** 获取最后一个点号的位置 */
    index = val.lastIndexOf('.')
    // 对于存在'.'的处理
    // 返回exp的值为字符串到.号的位置
    // 返回key的值为从点号后面到字符串结束的值
    if (index > -1) {
      return {
        exp: val.slice(0, index),
        key: '"' + val.slice(index + 1) + '"'
      }
    } else {
      /** 对于没有找到点号的处理
       * exp的值为传入的值
       * key的值为null
       */
      return {
        exp: val,
        key: null
      }
    }
  }
  /** 对于存在方括号的处理 */
  str = val
  index = expressionPos = expressionEndPos = 0
  // 遍历字符串到结尾
  while (!eof()) {
    chr = next()
    /** 对于是头字符的处理，调用parseString函数处理字符串
     *  直到此字符再次出现
     */
    if (isStringStart(chr)) {
      parseString(chr)
    } else if (chr === 0x5B) {
      /** 对于是方括号的处理，调用parseBracket函数处理
       * 直到所有的方括号字符都被匹配上，返回被匹配的位置
       */
      parseBracket(chr)
    }
  }
  /** 返回参数值exp为从0到'['开始的位置
   * key为重表达式开始到']'结束的位置
   */
  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}
/**
 * 获取字符串的下一个字符的编码值
 */
function next (): number {
  return str.charCodeAt(++index)
}
/**
 * 判断是否到了字符串的结尾
 */
function eof (): boolean {
  return index >= len
}
/**
 * 是否是字符串的开始，
 * 即判断传入的参数是否时单引号或者是双引号
 * @param {*} chr 传入的字符
 */
function isStringStart (chr: number): boolean {
  return chr === 0x22 || chr === 0x27
}
/**
 * 方括号的处理，返回找到匹配的方括号结束位置
 * @param {*} chr 传入的字符
 */
function parseBracket (chr: number): void {
  let inBracket = 1
  expressionPos = index
  while (!eof()) {
    chr = next()
    if (isStringStart(chr)) {
      parseString(chr)
      continue
    }
    /** 对于是方括号开始字符的处理 */
    if (chr === 0x5B) {
      inBracket++
    }
    /** 对于是方括号结束字符的处理 */
    if (chr === 0x5D) {
      inBracket--
    }
    // 对于开始方括号都被匹配的处理
    if (inBracket === 0) {
      expressionEndPos = index
      break
    }
  }
}
/**
 * 字符串分析
 * 在字符串中寻找是否还有此字符
 * @param {*} chr 传入的字符
 */
function parseString (chr: number): void {
  // 获取传入的字符
  const stringQuote = chr
  /** 一直循环到字符串结束 */
  while (!eof()) {
    /** 获取下一个字符的值 */
    chr = next()
    /** 如果在后续的字符串中找到此字符退出 */
    if (chr === stringQuote) {
      break
    }
  }
}
