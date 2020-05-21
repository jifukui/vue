import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
/**
 * Vue的构造函数
 * @param {*} options option为创建Vue时的传入的对象结构
 */
function Vue (options) {
  /** 判断是否是使用New创建的vue */
  if (
    process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  /** 根据传入的数据进行Vue对象的初始化工作 */
  this._init(options)
}
/**
 * 这个应该是第一个函数
 * 给Vue对象添加_init方法
 */
initMixin(Vue)
/** 状态绑定$watch函数 */
stateMixin(Vue)
/** 事件方法 */
eventsMixin(Vue)
/** 生命周期方法 */
lifecycleMixin(Vue)
/** 渲染方法 */
renderMixin(Vue)

export default Vue
