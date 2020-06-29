/* @flow */

import { noop, extend } from 'shared/util'
import { warn as baseWarn, tip } from 'core/util/debug'
/**  定义编译函数的结果 */
type CompiledFunctionResult = 
{
  render: Function;
  staticRenderFns: Array<Function>;
};
/**
 * 创建函数
 * @param {*} code 函数的代码
 * @param {*} errors 错误信息
 */
function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
/**
 * 创建编译器转换为功能函数
 * @param {*} compile 
 */
export function createCompileToFunctionFn (compile: Function): Function {
  // 这里应该是说明cache的数据格式为string为键值属性为CompiledFunctionResult类型
  // 这个是闭包的私有变量存储的是
  const cache: {
    [key: string]: CompiledFunctionResult;
  } = Object.create(null)
  /**
   * template：模板字符串
   * option：编译指令
   * vm:Vue对象
   */
  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    // 将传入的参数和空对象进行扩展,返回新的参数
    options = extend({}, options)
    // 获取传入参数的警告函数若不存在返回基本的警告函数
    const warn = options.warn || baseWarn
    // 删除options对象中的警告函数
    delete options.warn

    /** 对于不是发布模式的处理 */
    if (process.env.NODE_ENV !== 'production') {
      try {
        // 创建一个新的函数 返回1
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          )
        }
      }
    }
    // 获取参数中的分隔符，为分隔符转换为字符串加上模板如果没有分隔符直接返回模板字符串
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    // 如果cache存在这个属性，返回这个内容
    if (cache[key]) {
      return cache[key]
    }
    // 使用模板和参数调用编译器函数
    const compiled = compile(template, options)
    // 对于不是发布模式的处理
    if (process.env.NODE_ENV !== 'production') {
      // 编辑器的错误属性存在且编译器的错误属性的长度大于0，即有错误存在的处理，进行警告
      if (compiled.errors && compiled.errors.length) {
        warn(
          `Error compiling template:\n\n${template}\n\n` +
          compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
          vm
        )
      }
      // 对于编译器的存在提示内容的处理
      if (compiled.tips && compiled.tips.length) {
        // 遍历所有的提示，对这个组件条用tip函数
        compiled.tips.forEach(msg => tip(msg, vm))
      }
    }
    // 创建结果对象
    const res = {}
    // 创建
    const fnGenErrors = []
    // 设置结果的渲染函数
    res.render = createFunction(compiled.render, fnGenErrors)
    // 设置结果的静态
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })
    // 如果不是发布模式的处理
    if (process.env.NODE_ENV !== 'production') {
      // 对于没有编译错误属性或者编译错误长度值为0但是同时存在错误的处理
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
          fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
          vm
        )
      }
    }
    // 返回结果
    return (cache[key] = res)
  }
}
