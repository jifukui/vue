import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) 
{
  /**判断是否是使用New创建的vue */
  if (
    process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) 
  {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  /**初始化 */
  console.log("The vue first is "+JSON.stringify(options));
  this._init(options)
}
/**初始化入口 */
initMixin(Vue)
/**状态绑定$watch函数 */
stateMixin(Vue)
/**事件方法 */
eventsMixin(Vue)
/**生命周期方法 */
lifecycleMixin(Vue)
/**渲染方法 */
renderMixin(Vue)

export default Vue
