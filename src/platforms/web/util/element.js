/* @flow */

import { inBrowser } from 'core/util/env'
import { makeMap } from 'shared/util'

export const namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
}
/**HTML标签 */
export const isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
)

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
export const isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
)
/** 判断是否是预指令 */
export const isPreTag = (tag: ?string): boolean => tag === 'pre'
/**
 * 判断是否是预留指令 
 * @param {*} tag 
 */
export const isReservedTag = (tag: string): ?boolean => {
  return isHTMLTag(tag) || isSVG(tag)
}
/**
 * 
 * @param {*} tag 
 */
export function getTagNamespace (tag: string): ?string {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

const unknownElementCache = Object.create(null)
/**
 * 
 * @param {*} tag 
 */
export function isUnknownElement (tag: string): boolean {
  /**如果不是浏览器环境返回真 */
  if (!inBrowser) 
  {
    return true
  }
  /**如果是预留的标签返回假 */
  if (isReservedTag(tag)) 
  {
    return false
  }
  /**将标签小写转换 */
  tag = tag.toLowerCase()
  /**如果此标签存在于未知元素中返回此未知元素的值 */
  if (unknownElementCache[tag] != null) 
  {
    return unknownElementCache[tag]
  }
  const el = document.createElement(tag)
  /**对于标签中有连接号的处理 */
  if (tag.indexOf('-') > -1) 
  {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  }
  /**对于不在在连接号的处理 */ 
  else 
  {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

export const isTextInputType = makeMap('text,number,password,search,email,tel,url')
