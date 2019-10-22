/* @flow */
/**vue-master\src\core\util\util.js 错误处理相关函数*/
import config from '../config'
import { warn } from './debug'
import { inBrowser } from './env'
/**错误处理函数 */
export function handleError (err: Error, vm: any, info: string) 
{
  if (vm) 
  {
    let cur = vm
    while ((cur = cur.$parent)) 
    {
      /**设置hooks为错误捕捉函数 */
      const hooks = cur.$options.errorCaptured
      if (hooks) 
      {
        for (let i = 0; i < hooks.length; i++) 
        {
          try 
          {
            /**错误捕捉 */
            const capture = hooks[i].call(cur, err, vm, info) === false
            if (capture) 
            {
              return
            }
          } 
          catch (e) 
          {
            /**出现错误调用错误处理函数 */
            globalHandleError(e, cur, 'errorCaptured hook')
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info)
}

function globalHandleError (err, vm, info) 
{
  /**判断是否配置了错误处理 */
  if (config.errorHandler) 
  {
    try 
    {
      /**调用错误处理 */
      return config.errorHandler.call(null, err, vm, info)
    } 
    catch (e) 
    {
      /**输出错误信息 */
      logError(e, null, 'config.errorHandler')
    }
  }
  /**输出错误信息 */
  logError(err, vm, info)
}
/**输出错误信息 */
function logError (err, vm, info) 
{
  /**对于开发环境不是生产模式输出错误原因和错误 */
  if (process.env.NODE_ENV !== 'production') 
  {
    warn(`Error in ${info}: "${err.toString()}"`, vm)
  }
  /* istanbul ignore else */
  /**控制台输出错误信息 */
  if (inBrowser && typeof console !== 'undefined') 
  {
    console.error(err)
  } 
  else 
  {
    throw err
  }
}
/**end vue-master\src\core\util\util.js */