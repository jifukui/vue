/* @flow */

import { makeMap } from 'shared/util'

/**预留属性 */
export const isReservedAttr = makeMap('style,class')

// attributes that should be using props for binding
/**接收值的属性 */
const acceptValue = makeMap('input,textarea,option,select,progress')
/**
 * 
 * @param {*} tag 
 * @param {*} type 
 * @param {*} attr 属性名称
 */
export const mustUseProp = (tag: string, type: ?string, attr: string): boolean => 
{
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
}

export const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck')

export const isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
)

export const xlinkNS = 'http://www.w3.org/1999/xlink'
/**
 * 判断是否是xlink
 * @param {*} name 
 */
export const isXlink = (name: string): boolean => 
{
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
}
/**
 * 获取xlink属性的值
 * @param {*} name 
 */
export const getXlinkProp = (name: string): string => {
  return isXlink(name) ? name.slice(6, name.length) : ''
}
/**
 * 
 * @param {*} val 
 */
export const isFalsyAttrValue = (val: any): boolean => {
  return val == null || val === false
}
