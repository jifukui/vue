/* not type checking this file because flow doesn't play well with Proxy */
/**导入内核的配置 */
import config from 'core/config'
/** */
import { warn, makeMap } from '../util/index'

let initProxy

if (process.env.NODE_ENV !== 'production') 
{
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )
  /**警告函数 */
  const warnNonPresent = (target, key) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }
  /**判断当前的运行环境是否支持Proxy */
  const hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/)
  /**对于支持代理的处理 */
  if (hasProxy) 
  {
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    /**进行代理的处理，不允许设置预留的一些参数，返回设置的状态 */
    config.keyCodes = new Proxy(config.keyCodes, 
    {
      set (target, key, value) 
      {
        if (isBuiltInModifier(key)) 
        {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } 
        else 
        {
          target[key] = value
          return true
        }
      }
    })
  }
  /**返回对象中是否有此属性 */
  const hasHandler = 
  {
    has (target, key) 
    {
      const has = key in target
      /**不属于预留的且首字符不为下划线 */
      const isAllowed = allowedGlobals(key) || key.charAt(0) === '_'
      if (!has && !isAllowed) 
      {
        warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }
  /**
   * 获取此属性的值
   */
  const getHandler = 
  {
    get (target, key) 
    {
      if (typeof key === 'string' && !(key in target)) 
      {
        warnNonPresent(target, key)
      }
      return target[key]
    }
  }
  /**
   * 代理的初始化函数
   * 对于支持代理设置Vue函数进行设置时的代理函数传递给renderproxy
   * 对于不支持代理的返回设置为对象原型
   * vm为Vue函数
   */
  initProxy = function initProxy (vm) 
  {
    if (hasProxy) 
    {
      // determine which proxy handler to use
      const options = vm.$options
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      vm._renderProxy = new Proxy(vm, handlers)
    } 
    else 
    {
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
