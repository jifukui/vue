/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { shouldDecodeNewlines } from './util/compat'
import { compileToFunctions } from './compiler/index'
/**
 * 获取DOM元素的内部HTML
 */
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})
/**设置mount为Vue中的mount的实现 */
const mount = Vue.prototype.$mount
/**
 * 实现Vue的mount方法
 * el:DOM元素的挂载点
 * hydrating:
 */
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component 
{
  /**获取此字符串或者是DOM对象 */
  el = el && query(el)

  /**对于DOM对象是body对象或者是文档对象的处理 */
  if (el === document.body || el === document.documentElement) 
  {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  /**对于对象的渲染不存在的处理 */
  if (!options.render) 
  {
    let template = options.template
    /**对于传入的对象有template属性的处理 */
    if (template) 
    {
      /**如果template的类型是字符串的的处理 */
      if (typeof template === 'string') 
      {
        /**对于第一个字符为#好的处理 */
        if (template.charAt(0) === '#') 
        {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) 
          {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } 
      /**如果具有nodetype属性返回模板的内部html */
      else if (template.nodeType) 
      {
        template = template.innerHTML
      } 
      /**返回此对象 */
      else 
      {
        if (process.env.NODE_ENV !== 'production') 
        {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    }
    /**对于DOM元素存在的处理获取此元素的HTML文本 */ 
    else if (el) 
    {
      template = getOuterHTML(el)
    }
    /**对于传入的对象有template属性的处理 */
    if (template) 
    {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) 
      {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) 
      {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  /**返回调用此函数进行挂载的处理 */
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
/**
 * 返回此DOM元素的HTML样式
 * @param {*} el 
 */
function getOuterHTML (el: Element): string 
{
  /**对于DOM元素具有outHTML属性的返回此属性的值 */
  if (el.outerHTML) 
  {
    return el.outerHTML
  } 
  /**对于没有outHTML属性的创建一个div元素并在此元素后面添加传入DOM元素的扩展
   * 返回此元素的HTML
   */
  else 
  {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
/**定义compile的值为compileToFunctions */
Vue.compile = compileToFunctions

export default Vue
