/* @flow */
// 获取配置文件
import config from 'core/config'

import { warn, cached } from 'core/util/index'

import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
// 获取dom元素
import { query } from './util/index'

import { shouldDecodeNewlines } from './util/compat'

import { compileToFunctions } from './compiler/index'
/**
 * 获取DOM元素或者DOM元素的内部的HTML
 */
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})
/** 设置mount为Vue中的mount的实现 */
const mount = Vue.prototype.$mount
/** build生成的文件
 * 进行挂载操作，返回组件对象
 * @param {*} el 挂载对象的标记
 * @param {*} hydrating 
 */
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 获取挂载节点的DOM对象
  el = el && query(el)
  // 如果DOM元素为body元素或者是html元素的处理进行报错，反之返回这个DOM对象
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }
  // 获取组件的参数
  const options = this.$options
  /** 对于对象的渲染不存在的处理 */
  if (!options.render) {
    let template = options.template
    /** 对于传入的对象有template属性的处理 */
    if (template) {
      /** 如果template的类型是字符串的的处理 */
      if (typeof template === 'string') {
        /** 对于第一个字符为#好的处理，获取这个字符串的DOM元素的HTML内容 */
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          // 对于处于发布模式且没有template属性的处理
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        /** 如果具有nodetype属性返回模板的内部html */
        template = template.innerHTML
      } else {
        /** 返回此对象 */
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      /** 对于DOM元素存在的处理获取此元素的HTML文本 */
      template = getOuterHTML(el)
    }
    /** 对于传入的对象有template属性的处理，即存在插入节点的处理 */
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      /**
       * 获取渲染和静态渲染函数，传入模板，是否检测新行，分隔符，，还有this
       */
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      // 设置渲染器和静态渲染函数
      options.render = render
      options.staticRenderFns = staticRenderFns
      /** 对于不是发布模式且有对于性能进行检测的处理 */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  /** 返回调用此函数进行挂载的处理 */
  return mount.call(this, el, hydrating)
}

/**
 * 返回此DOM元素的HTML样式
 * @param {*} el 元素
 */
function getOuterHTML (el: Element): string {
  /** 对于DOM元素具有outHTML属性的返回此属性的值 */
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    /** 对于没有outHTML属性的创建一个div元素并在此元素后面添加传入DOM元素的扩展
   * 返回此元素的HTML
   */
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
/** 定义compile的值为compileToFunctions */
Vue.compile = compileToFunctions
// 导出Vue对象
export default Vue
