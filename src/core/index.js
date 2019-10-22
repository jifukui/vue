/**\vue-master\src\core\index.js */
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'

/**初始化全局API */
initGlobalAPI(Vue);


/**设置vue的$isServer属性的访问方法 */
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});


/**设置Vue的$ssrContext属性的访问方法 */
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

/**定义Vue的版本 */
Vue.version = '__VERSION__'
/**end \vue-master\src\core\index.js */
export default Vue
