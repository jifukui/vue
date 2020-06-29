/* @flow */

import config from 'core/config'
import { addHandler, addProp, getBindingAttr } from 'compiler/helpers'
import { genComponentModel, genAssignmentCode } from 'compiler/directives/model'

let warn

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
export const RANGE_TOKEN = '__r'
/**
 * 根据el的对应的属性进行相关的模式化处理，返回成功或者是失败
 * @param {*} el 抽象元素
 * @param {*} dir 抽象指令
 * @param {*} _warn 警告处理函数
 */
export default function model (
  el: ASTElement,
  dir: ASTDirective,
  _warn: Function
): ?boolean {
  // 设置警告为传入的警告函数
  warn = _warn
  // 设置value的值为指令中的value
  const value = dir.value
  // 设置modifiers为指令中的modifiers
  const modifiers = dir.modifiers
  // 设置tag为元素中的tag
  const tag = el.tag
  // 设置type为元素中attrsmap的type值
  const type = el.attrsMap.type
  // 对于不是发布模式的处理
  if (process.env.NODE_ENV !== 'production') {
    // 不允许设置tag为input类型为file的value的值这个值为只读属性
    if (tag === 'input' && type === 'file') {
      warn(
        `<${el.tag} v-model="${value}" type="file">:\n` +
        `File inputs are read only. Use a v-on:change listener instead.`
      )
    }
  }
  // 对于元素节点是组件的处理
  if (el.component) {
    // 调用genComponentModel函数传入抽象节点，指令的值和修饰符
    // 生成元素的模型函数
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    /** 对于标签是select的处理 */
    genSelect(el, value, modifiers)
  } else if (tag === 'input' && type === 'checkbox') {
    /** 对于标签是input且类型是复选框的处理 */
    genCheckboxModel(el, value, modifiers)
  } else if (tag === 'input' && type === 'radio') {
    /** 对于是单选框的处理 */
    genRadioModel(el, value, modifiers)
  } else if (tag === 'input' || tag === 'textarea') {
    /** 对于是input或者是textarea的处理 */
    genDefaultModel(el, value, modifiers)
  } else if (!config.isReservedTag(tag)) {
    /** 对于不是预留标签的处理 */
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    /** 其他的错误处理 */
    warn(
      `<${el.tag} v-model="${value}">: ` +
      `v-model is not supported on this element type. ` +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    )
  }

  // ensure runtime directive metadata
  return true
}
/**
 * 
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */
function genCheckboxModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  const valueBinding = getBindingAttr(el, 'value') || 'null'
  const trueValueBinding = getBindingAttr(el, 'true-value') || 'true'
  const falseValueBinding = getBindingAttr(el, 'false-value') || 'false'
  addProp(el, 'checked',
    `Array.isArray(${value})` +
      `?_i(${value},${valueBinding})>-1` + (
        trueValueBinding === 'true'
          ? `:(${value})`
          : `:_q(${value},${trueValueBinding})`
      )
  )
  addHandler(el, 'change',
    `var $$a=${value},` +
        '$$el=$event.target,' +
        `$$c=$$el.checked?(${trueValueBinding}):(${falseValueBinding});` +
    'if(Array.isArray($$a)){' +
      `var $$v=${number ? '_n(' + valueBinding + ')' : valueBinding},` +
          '$$i=_i($$a,$$v);' +
      `if($$el.checked){$$i<0&&(${value}=$$a.concat([$$v]))}` +
      `else{$$i>-1&&(${value}=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}` +
    `}else{${genAssignmentCode(value, '$$c')}}`,
    null, true
  )
}
/**
 * 产生单选框模式
 * @param {*} el 元素对象
 * @param {*} value 
 * @param {*} modifiers 
 */
function genRadioModel (
    el: ASTElement,
    value: string,
    modifiers: ?ASTModifiers
) {
  // 获取修饰符
  const number = modifiers && modifiers.number
  // 获取此元素的value属性
  let valueBinding = getBindingAttr(el, 'value') || 'null'
  valueBinding = number ? `_n(${valueBinding})` : valueBinding
  addProp(el, 'checked', `_q(${value},${valueBinding})`)
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true)
}
/**
 * 生成选择模型
 * @param {*} el 元素对象
 * @param {*} value 参数值
 * @param {*} modifiers 修饰符
 */
function genSelect (
    el: ASTElement,
    value: string,
    modifiers: ?ASTModifiers
) {
  // 获取修饰符参数
  const number = modifiers && modifiers.number
  // 设置选择模型函数
  const selectedVal = `Array.prototype.filter` +
    `.call($event.target.options,function(o){return o.selected})` +
    `.map(function(o){var val = "_value" in o ? o._value : o.value;` +
    `return ${number ? '_n(val)' : 'val'}})`
  // 设置任务
  const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]'
  // 设置代码
  let code = `var $$selectedVal = ${selectedVal};`
  code = `${code} ${genAssignmentCode(value, assignment)}`
  // 对于select添加change处理函数
  addHandler(el, 'change', code, null, true)
}
/**
 * 产生默认模型
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */
function genDefaultModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  /** */
  const type = el.attrsMap.type
  /** */
  const { lazy, number, trim } = modifiers || {}
  const needCompositionGuard = !lazy && type !== 'range'
  /** */
  const event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input'
  /** 设置数值的表达式 */
  let valueExpression = '$event.target.value'
  if (trim) {
    valueExpression = `$event.target.value.trim()`
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`
  }

  let code = genAssignmentCode(value, valueExpression)
  if (needCompositionGuard) {
    code = `if($event.target.composing)return;${code}`
  }

  addProp(el, 'value', `(${value})`)
  addHandler(el, event, code, null, true)
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()')
  }
}
