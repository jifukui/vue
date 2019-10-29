/* @flow */

import { inBrowser } from 'core/util/index'

// check whether current browser encodes a char inside attribute values
/**判断编码字符是否存在于内容中 */
function shouldDecode (content: string, encoded: string): boolean 
{
  const div = document.createElement('div')
  div.innerHTML = `<div a="${content}"/>`
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
export const shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false
