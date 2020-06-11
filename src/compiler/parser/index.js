/* @flow */

import he from 'he'
import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
import { parseFilters } from './filter-parser'
import { cached, no, camelize } from 'shared/util'
import { genAssignmentCode } from '../directives/model'
import { isIE, isEdge, isServerRendering } from 'core/util/env'

import {
  addProp,
  addAttr,
  baseWarn,
  addHandler,
  addDirective,
  getBindingAttr,
  getAndRemoveAttr,
  pluckModuleFunction
} from '../helpers'

export const onRE = /^@|^v-on:/
export const dirRE = /^v-|^@|^:/
export const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/
export const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/

const argRE = /:(.*)$/
const bindRE = /^:|^v-bind:/
const modifierRE = /\.[^.]+/g

const decodeHTMLCached = cached(he.decode)

// configurable state
export let warn: any
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace
/** 定义属性的格式 */
type Attr = { name: string; value: string };

/**
 * 产生抽象元素
 * 根据对标签的解析产生对应的抽象结构
 * @param {*} tag 元素标签
 * @param {*} attrs 元素属性
 * @param {*} parent 元素的父节点
 */
export function createASTElement (
  tag: string,
  attrs: Array<Attr>,
  parent: ASTElement | void
): ASTElement 
{
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}

/**
 * 将HTML文本转换为抽象结构
 * @param {*} template HTML字符串，即模板字符串
 * @param {*} options 抽象结构体
 * 获取对象的
 * 实现只是警告一次的函数
 * 实现结束预处理的函数
 * 调用分析HTML
 */
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void 
{
  warn = options.warn || baseWarn

  platformIsPreTag = options.isPreTag || no
  platformMustUseProp = options.mustUseProp || no
  platformGetTagNamespace = options.getTagNamespace || no

  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters

  const stack = []
  const preserveWhitespace = options.preserveWhitespace !== false
  let root
  let currentParent
  let inVPre = false
  let inPre = false
  let warned = false
  /**
   * 警告一次的处理，
   * 如果没有警告过进行警告，如果已经警告过不在进行警告
   * @param {*} msg 
   */
  function warnOnce (msg) {
    if (!warned) 
    {
      warned = true
      warn(msg)
    }
  }
  /**
   * 
   * @param {*} element 
   */
  function endPre (element) 
  {
    // check pre state
    if (element.pre) 
    {
      inVPre = false
    }
    if (platformIsPreTag(element.tag)) 
    {
      inPre = false
    }
  }
  /**
   * 调用分析HTML文件
   */
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    /**
     * 
     * @param {*} tag 
     * @param {*} attrs 
     * @param {*} unary 
     */
    start (tag, attrs, unary) 
    {
      // check namespace.
      // inherit parent ns if there is one
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') 
      {
        attrs = guardIESVGBug(attrs)
      }

      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) 
      {
        element.ns = ns
      }

      if (isForbiddenTag(element) && !isServerRendering()) 
      {
        element.forbidden = true
        process.env.NODE_ENV !== 'production' && warn(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          `<${tag}>` + ', as they will not be parsed.'
        )
      }

      // apply pre-transforms
      for (let i = 0; i < preTransforms.length; i++) 
      {
        element = preTransforms[i](element, options) || element
      }

      if (!inVPre) 
      {
        processPre(element)
        if (element.pre) 
        {
          inVPre = true
        }
      }
      if (platformIsPreTag(element.tag)) 
      {
        inPre = true
      }
      if (inVPre) 
      {
        processRawAttrs(element)
      } 
      else if (!element.processed) 
      {
        // structural directives
        processFor(element)
        processIf(element)
        processOnce(element)
        // element-scope stuff
        processElement(element, options)
      }
      /**
       * 检测根的约束条件
       * @param {*} el 
       */
      function checkRootConstraints (el) 
      {
        if (process.env.NODE_ENV !== 'production') 
        {
          /**
           * 获取el 对象的标签
           */
          if (el.tag === 'slot' || el.tag === 'template') 
          {
            warnOnce(
              `Cannot use <${el.tag}> as component root element because it may ` +
              'contain multiple nodes.'
            )
          }
          if (el.attrsMap.hasOwnProperty('v-for')) 
          {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            )
          }
        }
      }

      // tree management
      if (!root) 
      {
        root = element
        checkRootConstraints(root)
      } 
      else if (!stack.length) 
      {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) 
        {
          checkRootConstraints(element)
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          })
        } 
        else if (process.env.NODE_ENV !== 'production') 
        {
          warnOnce(
            `Component template should contain exactly one root element. ` +
            `If you are using v-if on multiple elements, ` +
            `use v-else-if to chain them instead.`
          )
        }
      }
      if (currentParent && !element.forbidden) 
      {
        if (element.elseif || element.else) 
        {
          processIfConditions(element, currentParent)
        } 
        else if (element.slotScope) 
        { // scoped slot
          currentParent.plain = false
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
        } 
        else 
        {
          currentParent.children.push(element)
          element.parent = currentParent
        }
      }
      if (!unary) 
      {
        currentParent = element
        stack.push(element)
      } 
      else 
      {
        endPre(element)
      }
      // apply post-transforms
      for (let i = 0; i < postTransforms.length; i++) 
      {
        postTransforms[i](element, options)
      }
    },
    /**
     * 
     */
    end () 
    {
      // remove trailing whitespace
      const element = stack[stack.length - 1]
      const lastNode = element.children[element.children.length - 1]
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop()
      }
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      endPre(element)
    },
    /**
     * 
     * @param {*} text 
     */
    chars (text: string) 
    {
      if (!currentParent) 
      {
        if (process.env.NODE_ENV !== 'production') 
        {
          if (text === template) 
          {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            )
          } 
          else if ((text = text.trim())) 
          {
            warnOnce(
              `text "${text}" outside root element will be ignored.`
            )
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) 
      {
        return
      }
      const children = currentParent.children
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : ''
      if (text) 
      {
        let expression
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) 
        {
          children.push({
            type: 2,
            expression,
            text
          })
        } 
        else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') 
        {
          children.push({
            type: 3,
            text
          })
        }
      }
    },
    /**
     * 
     * @param {*} text 
     */
    comment (text: string) 
    {
      currentParent.children.push({
        type: 3,
        text,
        isComment: true
      })
    }
  })
  return root
}
/**
 * 预指令的处理
 * 获取元素对象中的预处理的属性值，
 * 如果值不为NULL设置值的pre属性的值为真
 * @param {*} el 
 */
function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true
  }
}
/**
 * 原始属性的处理
 * @param {*} el 
 */
function processRawAttrs (el) {
  /** 获取对象的属性数组 */
  const l = el.attrsList.length
  /** 对于数组长度大于0的处理
   * 将属性名和属性值组成的数组存储在el的attrs数组中
   */
  if (l) {
    const attrs = el.attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      }
    }
  } else if (!el.pre) {
    /** 对于el的预处理属性为假的处理，设置元素的plain属性为真 */
    // non root node in pre blocks with no attributes
    el.plain = true
  }
}
/**
 * 处理元素
 * @param {*} element 
 * @param {*} options 
 */
export function processElement (element: ASTElement, options: CompilerOptions) {
  processKey(element)

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length

  processRef(element)
  processSlot(element)
  processComponent(element)
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element
  }
  processAttrs(element)
}
/**
 * 处理key属性
 * 如果此属性存在设置此元素的key属性的值为返回的表达式
 * @param {*} el 
 */
function processKey (el) {
  const exp = getBindingAttr(el, 'key')
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn(`<template> cannot be keyed. Place the key on real elements instead.`)
    }
    el.key = exp
  }
}
/**
 * 处理ref属性
 * @param {*} el 
 */
function processRef (el) {
  /** 获取此对象ref属性的值 */
  const ref = getBindingAttr(el, 'ref')
  /** 对于值不为假的处理
   * 设置el的ref属性为ref属性的值
   * 设置refInFor，即是否有for属性
   */
  if (ref) {
    el.ref = ref
    el.refInFor = checkInFor(el)
  }
}
/**
 * for指令的处理
 * @param {*} el 
 */
export function processFor (el: ASTElement) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const inMatch = exp.match(forAliasRE)
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid v-for expression: ${exp}`
      )
      return
    }
    el.for = inMatch[2].trim()
    const alias = inMatch[1].trim()
    const iteratorMatch = alias.match(forIteratorRE)
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim()
      el.iterator1 = iteratorMatch[2].trim()
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim()
      }
    } else {
      el.alias = alias
    }
  }
}
/**
 * 处理v-if指令
 * @param {*} el 
 */
function processIf (el) {
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) {
    el.if = exp
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if')
    if (elseif) {
      el.elseif = elseif
    }
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} parent 
 */
function processIfConditions (el, parent) {
  const prev = findPrevElement(parent.children)
  if (prev && prev.if) {
    addIfCondition(prev, 
      {
      exp: el.elseif,
      block: el
    })
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
      `used on element <${el.tag}> without corresponding v-if.`
    )
  }
}
/**
 * 查找前面的元素
 * @param {*} children 
 */
function findPrevElement (children: Array<any>): ASTElement | void {
  let i = children.length
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn(
          `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
          `will be ignored.`
        )
      }
      children.pop()
    }
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} condition 
 */
export function addIfCondition (el: ASTElement, condition: ASTIfCondition) {
  if (!el.ifConditions) {
    el.ifConditions = []
  }
  el.ifConditions.push(condition)
}
/**
 * 处理一次
 * @param {*} el 
 */
function processOnce (el) {
  /**
   * 获取v-once属性，并设置对象的once属性为此属性中是否存在v-once
   */
  const once = getAndRemoveAttr(el, 'v-once')
  if (once != null) {
    el.once = true
  }
}
/**
 * 处理槽
 * @param {*} el 
 */
function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name')
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        `\`key\` does not work on <slot> because slots are abstract outlets ` +
        `and can possibly expand into multiple elements. ` +
        `Use the key on a wrapping element instead.`
      )
    }
  } else {
    let slotScope
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope')
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && slotScope) {
        warn(
          `the "scope" attribute for scoped slots have been deprecated and ` +
          `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
          `can also be used on plain elements in addition to <template> to ` +
          `denote scoped slots.`,
          true
        )
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      el.slotScope = slotScope
    }
    const slotTarget = getBindingAttr(el, 'slot')
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (!el.slotScope) {
        addAttr(el, 'slot', slotTarget)
      }
    }
  }
}
/**
 * 组件处理
 * @param {*} el 
 */
function processComponent (el) {
  let binding
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true
  }
}
/**
 * 处理属性
 * @param {*} el 
 */
function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, rawName, value, modifiers, isProp
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true
      // modifiers
      modifiers = parseModifiers(name)
      if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '')
        value = parseFilters(value)
        isProp = false
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true
            name = camelize(name)
            if (name === 'innerHtml') name = 'innerHTML'
          }
          if (modifiers.camel) {
            name = camelize(name)
          }
          if (modifiers.sync) {
            addHandler(
              el,
              `update:${camelize(name)}`,
              genAssignmentCode(value, `$event`)
            )
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value)
        } else {
          addAttr(el, name, value)
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '')
        addHandler(el, name, value, modifiers, false, warn)
      } else { // normal directives
        name = name.replace(dirRE, '')
        // parse arg
        const argMatch = name.match(argRE)
        const arg = argMatch && argMatch[1]
        if (arg) {
          name = name.slice(0, -(arg.length + 1))
        }
        addDirective(el, name, rawName, value, arg, modifiers)
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value)
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        const expression = parseText(value, delimiters)
        if (expression) {
          warn(
            `${name}="${value}": ` +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          )
        }
      }
      addAttr(el, name, JSON.stringify(value))
    }
  }
}
/**
 * 判断此属性向上是否有for属性
 * @param {*} el 
 */
function checkInFor (el: ASTElement): boolean {
  let parent = el
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent
  }
  return false
}
/**
 * 
 * @param {*} name 
 */
function parseModifiers (name: string): Object | void {
  const match = name.match(modifierRE)
  if (match) {
    const ret = {}
    match.forEach(m => { ret[m.slice(1)] = true })
    return ret
  }
}
/**
 * 将属性数组中的name属性值为键value属性值为值的映射表
 * @param {*} attrs 属性数组
 */
function makeAttrsMap (attrs: Array<Object>): Object {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn('duplicate attribute: ' + attrs[i].name)
    }
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
/**
 * 判断是否是文本标签即是否是script和style标签
 * @param {*} el 
 */
function isTextTag (el): boolean {
  return el.tag === 'script' || el.tag === 'style'
}
/**
 * 
 * @param {*} el DOM对象的抽象形式
 */
function isForbiddenTag (el): boolean {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

const ieNSBug = /^xmlns:NS\d+/
const ieNSPrefix = /^NS\d+:/

/**
 * 
 * @param {*} attrs 
 */
function guardIESVGBug (attrs) {
  const res = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '')
      res.push(attr)
    }
  }
  return res
}
/**
 * 
 * @param {*} el 
 * @param {*} value 
 */
function checkForAliasModel (el, value) {
  let _el = el
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn(
        `<${el.tag} v-model="${value}">: ` +
        `You are binding v-model directly to a v-for iteration alias. ` +
        `This will not be able to modify the v-for source array because ` +
        `writing to the alias is like modifying a function local variable. ` +
        `Consider using an array of objects and use v-model on an object property instead.`
      )
    }
    _el = _el.parent
  }
}
