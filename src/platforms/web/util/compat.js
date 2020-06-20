/* @flow */

import { inBrowser } from 'core/util/index'

/**
 * 判断编码字符是否存在于内容中，查看文档中是否有linux换行符
 * @param {*} content 被查找文本
 * @param {*} encoded 查找内容
 */
function shouldDecode (content: string, encoded: string): boolean {
  const div = document.createElement('div')
  div.innerHTML = `<div a="${content}"/>`
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
// 对于是浏览器，如果是调用shouldDecode函数的结果，反之返回否
export const shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false
