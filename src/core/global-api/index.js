/* @flow */
/**vue-master\src\core\global-api */
import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'
/**
 * 全局API Vue对象的初始化
 * @param {*} Vue Vue的实例化
 */
export function initGlobalAPI(Vue : GlobalAPI) {
  // config
  const configDef = {}
  /**时间configDef的get方法，即获取配置的参数 */
  configDef.get = () => config
  /**对于开发环境为production的处理其实没有什么作用 */
  if (process.env.NODE_ENV !== 'production') 
  {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  /**定义Vue的config属性为默认的configDef属性 */
  Object.defineProperty(Vue, 'config', configDef)
  /**设置Vue的util属性的相关方法，warn extend mergeOptions defineRective */
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }
  /**定义一些方法 */
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick
  /**创建空的Vue对象的options的对象 */
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  /**设置Vue对象的_base属性的值指向自己Vue本身 */
  Vue.options._base = Vue
  /**对Vue的options属性的components属性和buildInComponents属性进行扩展 */
  extend(Vue.options.components, builtInComponents)
  /**初始化Use */
  initUse(Vue)
  /**初始化混入 */
  initMixin(Vue)
  /**初始化扩展 */
  initExtend(Vue)
  /**初始化资源注册 */
  initAssetRegisters(Vue)
}
/**end vue-master\src\core\global-api */